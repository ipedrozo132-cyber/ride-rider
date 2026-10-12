import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  if (!query || query.trim().length < 3) {
    return NextResponse.json({ results: [] })
  }

  try {
    const encoded = encodeURIComponent(query.trim())
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&addressdetails=1&limit=5`,
      {
        headers: {
          'User-Agent': 'SmartRide-App/1.0 (contact@infiniteintelligencelabs.com)',
          'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8'
        }
      }
    )

    if (!response.ok) {
      return NextResponse.json({ results: [] })
    }

    const data = await response.json()

    const results = data.map((item: any) => ({
      name: item.display_name.split(',')[0],
      address: item.display_name,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon)
    }))

    return NextResponse.json({ results })
  } catch (error) {
    return NextResponse.json({ error: 'Falha ao buscar endereço', results: [] }, { status: 500 })
  }
}
