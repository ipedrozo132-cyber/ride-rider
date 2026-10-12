import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const startLat = searchParams.get('startLat')
  const startLng = searchParams.get('startLng')
  const endLat = searchParams.get('endLat')
  const endLng = searchParams.get('endLng')

  if (!startLat || !startLng || !endLat || !endLng) {
    return NextResponse.json({ error: 'Coordenadas incompletas' }, { status: 400 })
  }

  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=false`
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'SmartRide-App/1.0 (contact@infiniteintelligencelabs.com)'
      }
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Falha no cálculo da rota' }, { status: 500 })
    }

    const data = await response.json()
    if (!data.routes || data.routes.length === 0) {
      return NextResponse.json({ error: 'Nenhuma rota encontrada' }, { status: 404 })
    }

    const route = data.routes[0]
    const distanceKm = parseFloat((route.distance / 1000).toFixed(1))
    const durationMinutes = Math.round(route.duration / 60)

    return NextResponse.json({
      distanceKm,
      durationMinutes
    })
  } catch (error) {
    return NextResponse.json({ error: 'Erro de ligação' }, { status: 500 })
  }
}
