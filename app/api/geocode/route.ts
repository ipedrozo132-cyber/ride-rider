import { NextResponse } from 'next/server'

// Distância geodésica (Haversine)
function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371
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

  // Bounding box local (aproximadamente 35 km)
  const delta = 0.35
  const minLng = userLng - delta
  const minLat = userLat - delta
  const maxLng = userLng + delta
  const maxLat = userLat + delta
  const bbox = `${minLng},${minLat},${maxLng},${maxLat}`

  // 1. Promessa de busca no Mapbox (com viés de proximidade local)
  const fetchMapbox = async () => {
    try {
      const mapboxUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        queryTerm
      )}.json?country=br&proximity=${userLng},${userLat}&language=pt&autocomplete=true&limit=8&access_token=${MAPBOX_TOKEN}`

      const res = await fetch(mapboxUrl)
      if (!res.ok) return []
      const data = await res.json()

      if (!data.features) return []

      return data.features.map((item: any) => {
        const itemLng = item.center[0]
        const itemLat = item.center[1]
        return {
          name: item.text,
          address: item.place_name,
          lat: itemLat,
          lng: itemLng,
          distance: Number(getDistanceKm(userLat, userLng, itemLat, itemLng).toFixed(1)),
          source: 'mapbox'
        }
      })
    } catch {
      return []
    }
  }

  // 2. Promessa de busca no Nominatim (focado no raio da cidade, exatamente como funcionava antes)
  const fetchNominatim = async () => {
    try {
      const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        queryTerm
      )}&addressdetails=1&limit=8&countrycodes=br&viewbox=${minLng},${maxLat},${maxLng},${minLat}&bounded=0&dedupe=1`

      const res = await fetch(nominatimUrl, {
        headers: {
          'User-Agent': 'MakeEasyApp/1.0 (contato@makeeasy.app)',
          'Accept-Language': 'pt-BR,pt;q=0.9'
        }
      })
      if (!res.ok) return []
      const data = await res.json()

      if (!Array.isArray(data)) return []

      return data.map((item: any) => {
        const parts = item.display_name.split(',')
        const name = parts[0].trim()
        const itemLat = parseFloat(item.lat)
        const itemLng = parseFloat(item.lon)
        return {
          name: name,
          address: item.display_name,
          lat: itemLat,
          lng: itemLng,
          distance: Number(getDistanceKm(userLat, userLng, itemLat, itemLng).toFixed(1)),
          source: 'nominatim'
        }
      })
    } catch {
      return []
    }
  }

  // Executa os dois motores simultaneamente em paralelo
  const [mapboxSettled, nominatimSettled] = await Promise.allSettled([
    fetchMapbox(),
    fetchNominatim()
  ])

  const mapboxResults = mapboxSettled.status === 'fulfilled' ? mapboxSettled.value : []
  const nominatimResults = nominatimSettled.status === 'fulfilled' ? nominatimSettled.value : []

  // Junta os resultados
  const combined = [...nominatimResults, ...mapboxResults]

  // Remove duplicados aproximados (mesmo nome/endereço ou coordenadas muito próximas)
  const uniqueResults: any[] = []
  for (const item of combined) {
    const isDuplicate = uniqueResults.some(
      existing =>
        existing.address.toLowerCase() === item.address.toLowerCase() ||
        (Math.abs(existing.lat - item.lat) < 0.002 && Math.abs(existing.lng - item.lng) < 0.002)
    )
    if (!isDuplicate) {
      uniqueResults.push(item)
    }
  }

  // Ordena por proximidade do usuário
  uniqueResults.sort((a, b) => a.distance - b.distance)

  return NextResponse.json({ results: uniqueResults.slice(0, 10) })
}
