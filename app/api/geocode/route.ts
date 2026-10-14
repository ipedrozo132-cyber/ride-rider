import { NextResponse } from 'next/server'

// Cálculo matemático de distância geodésica (fórmula de Haversine)
function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Raio da Terra em km
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')
  const userLatStr = searchParams.get('lat')
  const userLngStr = searchParams.get('lng')

  if (!q || q.trim().length < 2) {
    return NextResponse.json({ results: [] })
  }

  const userLat = userLatStr ? parseFloat(userLatStr) : -23.2055
  const userLng = userLngStr ? parseFloat(userLngStr) : -45.8841

  try {
    // 1. Delimitação geográfica restrita ao Vale do Paraíba / SP (~40km de raio)
    const delta = 0.40
    const left = userLng - delta
    const top = userLat + delta
    const right = userLng + delta
    const bottom = userLat - delta

    // 2. Busca priorizada na região com countrycodes=br rígido
   let url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      q.trim()
    )}&addressdetails=1&limit=10&countrycodes=br&viewbox=${left},${top},${right},${bottom}&bounded=0&dedupe=1`

    let response = await fetch(url, {
      headers: {
        'User-Agent': 'MakeEasyApp/1.0 (contato@makeeasy.app)',
        'Accept-Language': 'pt-BR,pt;q=0.9'
      }
    })

    let data = response.ok ? await response.json() : []

    // 3. Fallback: se for um termo muito específico e não achar na caixa de 40km, busca no estado de SP
    if (!data || data.length === 0) {
      const fallbackUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        q.trim()
      )}&addressdetails=1&limit=8&countrycodes=br&viewbox=${left},${top},${right},${bottom}`
      
      const fallbackRes = await fetch(fallbackUrl, {
        headers: {
          'User-Agent': 'MakeEasyApp/1.0 (contato@makeeasy.app)',
          'Accept-Language': 'pt-BR,pt;q=0.9'
        }
      })
      if (fallbackRes.ok) {
        data = await fallbackRes.json()
      }
    }

    if (!Array.isArray(data)) {
      return NextResponse.json({ results: [] })
    }

    // 4. Mapeia e calcula a distância exata de cada local em relação ao usuário
    const mappedResults = data.map((item: any) => {
      const parts = item.display_name.split(',')
      const name = parts[0].trim()
      const address = parts.slice(1, 4).join(',').trim()
      const itemLat = parseFloat(item.lat)
      const itemLng = parseFloat(item.lon)
      const distance = getDistanceKm(userLat, userLng, itemLat, itemLng)

      return {
        name,
        address,
        lat: itemLat,
        lng: itemLng,
        distance
      }
    })

    // 5. Ordena rigorosamente do MAIS PRÓXIMO para o MAIS DISTANTE
    mappedResults.sort((a, b) => a.distance - b.distance)

    return NextResponse.json({ results: mappedResults.slice(0, 6) })
  } catch (error) {
    return NextResponse.json({ results: [] })
  }
}
