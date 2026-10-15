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

const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN || 'pk.eyJ1IjoiaXBlZHJvem8iLCJhIjoiY212OW9ncG5qMDV4czJ4b2N5eDIzOG5vcSJ9._7P5YeTaZneYtB2trmRVhA'

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
  const queryTerm = q.trim()

  // 1. TENTATIVA PRINCIPAL: Mapbox Search / Geocoding (Padrão Uber / POIs / Condomínios)
  try {
    const mapboxUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(queryTerm)}.json?country=br&proximity=${userLng},${userLat}&language=pt&autocomplete=true&limit=10&access_token=${MAPBOX_TOKEN}`

    const mapboxRes = await fetch(mapboxUrl)

    if (mapboxRes.ok) {
      const mapboxData = await mapboxRes.json()

      if (mapboxData.features && mapboxData.features.length > 0) {
        const results = mapboxData.features.map((item: any) => {
          const itemLng = item.center[0]
          const itemLat = item.center[1]
          const distance = getDistanceKm(userLat, userLng, itemLat, itemLng)

          return {
            name: item.text,
            address: item.place_name,
            lat: itemLat,
            lng: itemLng,
            distance: Number(distance.toFixed(1))
          }
        })

        // Ordena por proximidade do utilizador
        results.sort((a: any, b: any) => a.distance - b.distance)

        return NextResponse.json({ results, provider: 'mapbox' })
      }
    }
  } catch (err) {
    console.error('Falha no motor Mapbox, a ativar fallback automático para Nominatim:', err)
  }

  // 2. FALLBACK DE CONTINGÊNCIA: Nominatim (OpenStreetMap gratuito e ilimitado)
  try {
    const delta = 0.40
    const left = userLng - delta
    const top = userLat + delta
    const right = userLng + delta
    const bottom = userLat - delta

    const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      queryTerm
    )}&addressdetails=1&limit=10&countrycodes=br&viewbox=${left},${top},${right},${bottom}&bounded=0&dedupe=1`

    const nominatimRes = await fetch(nominatimUrl, {
      headers: {
        'User-Agent': 'MakeEasyApp/1.0 (contato@makeeasy.app)',
        'Accept-Language': 'pt-BR,pt;q=0.9'
      }
    })

    if (nominatimRes.ok) {
      const data = await nominatimRes.json()

      if (Array.isArray(data)) {
        const mappedResults = data.map((item: any) => {
          const parts = item.display_name.split(',')
          const name = parts[0].trim()
          const itemLat = parseFloat(item.lat)
          const itemLng = parseFloat(item.lon)
          const distance = getDistanceKm(userLat, userLng, itemLat, itemLng)

          return {
            name: name,
            address: item.display_name,
            lat: itemLat,
            lng: itemLng,
            distance: Number(distance.toFixed(1))
          }
        })

        mappedResults.sort((a: any, b: any) => a.distance - b.distance)

        return NextResponse.json({ results: mappedResults, provider: 'nominatim' })
      }
    }
  } catch (err) {
    console.error('Erro no fallback do Nominatim:', err)
  }

  return NextResponse.json({ results: [] })
}
