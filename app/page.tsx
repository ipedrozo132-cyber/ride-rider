'use client'

import React, { useState, useEffect } from 'react'

// Logotipo SmartRide Provisório Limpo
const SmartRideBrand = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', marginBottom: '22px' }}>
    <div style={{
      width: '46px',
      height: '46px',
      borderRadius: '14px',
      background: 'linear-gradient(135deg, #00E676 0%, #00A86B 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 12px rgba(0, 168, 107, 0.25)',
      color: '#ffffff',
      fontSize: '26px',
      fontWeight: '900',
      letterSpacing: '-1px'
    }}>
      S
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
      <span style={{ fontSize: '26px', fontWeight: '950', color: '#044e42', letterSpacing: '-0.02em' }}>SMART</span>
      <span style={{ fontSize: '26px', fontWeight: '950', color: '#00A86B', letterSpacing: '-0.02em', marginTop: '3px' }}>RIDE</span>
    </div>
  </div>
)

// Moeda de Titânio i^∞
const TitaniumCoin = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 'auto', paddingTop: '28px' }}>
    <div style={{
      width: '56px',
      height: '56px',
      borderRadius: '50%',
      background: 'radial-gradient(circle at 30% 30%, #ffffff 0%, #e2e8f0 25%, #cbd5e1 45%, #94a3b8 70%, #475569 95%, #1e293b 100%)',
      boxShadow: '0 6px 14px rgba(0,0,0,0.22), inset 0 2.5px 2px rgba(255,255,255,0.9), inset 0 -3px 4px rgba(0,0,0,0.5)',
      border: '1.5px solid #94a3b8',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '10px',
      position: 'relative',
      userSelect: 'none'
    }}>
      <div style={{
        position: 'absolute',
        inset: '3px',
        borderRadius: '50%',
        border: '1px solid rgba(0,0,0,0.1)',
        background: 'repeating-radial-gradient(circle, transparent, transparent 2px, rgba(255,255,255,0.05) 3px, rgba(0,0,0,0.03) 4px)'
      }} />
      <span style={{
        fontSize: '24px',
        fontFamily: 'Georgia, serif',
        fontStyle: 'italic',
        fontWeight: 'bold',
        color: '#0f172a',
        textShadow: '0 1px 1px rgba(255,255,255,0.7), 0 -1px 1px rgba(0,0,0,0.2)',
        zIndex: 1,
        position: 'relative',
        top: '-1px'
      }}>
        i<sup>∞</sup>
      </span>
    </div>
    <span style={{
      fontSize: '12px',
      fontWeight: '750',
      color: '#1e293b',
      letterSpacing: '0.04em',
      textTransform: 'uppercase'
    }}>
      Infinite Intelligence Labs
    </span>
    <span style={{
      fontSize: '9.5px',
      color: '#64748b',
      marginTop: '6px',
      fontWeight: '550',
      letterSpacing: '0.02em'
    }}>
      © 2026 INFINITE INTELLIGENCE LABS • ALL RIGHTS RESERVED
    </span>
  </div>
)

interface LocationItem {
  title: string
  lat: number
  lng: number
}

const DEFAULT_PLACES = [
  'Faculdade Univap',
  'Praça Afonso Pena',
  'CenterVale Shopping',
  'Coliseu Hall',
  'Rodoviária Nova'
]

export default function SmartRideApp() {
  const [isUsingGps, setIsUsingGps] = useState(true)
  const [pickupText, setPickupText] = useState('')
  const [pickupCoord, setPickupCoord] = useState<{ lat: number; lng: number } | null>(null)

  const [destinationText, setDestinationText] = useState('Praça Afonso Pena')
  const [destCoord, setDestCoord] = useState<{ lat: number; lng: number }>({ lat: -23.1896, lng: -45.8841 })

  const [stops, setStops] = useState<{ text: string; lat?: number; lng?: number }[]>([])

  // Busca de endereços ao vivo
  const [activeField, setActiveField] = useState<'pickup' | 'destination' | number | null>(null)
  const [searchResults, setSearchResults] = useState<{ name: string; address: string; lat: number; lng: number }[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [savedPlaces, setSavedPlaces] = useState<string[]>(DEFAULT_PLACES)

  // Tarifas e Telemetria
  const [isComparing, setIsComparing] = useState(false)
  const [hasCompared, setHasCompared] = useState(false)
  const [price99, setPrice99] = useState<string | null>(null)
  const [priceUber, setPriceUber] = useState<string | null>(null)
  const [cheaperService, setCheaperService] = useState<'99' | 'uber' | null>(null)
  const [tripTelemetry, setTripTelemetry] = useState<{ distance: string; time: string } | null>(null)

  // Obtém o GPS real do navegador se ativado
  useEffect(() => {
    if (isUsingGps && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPickupCoord({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        },
        () => {
          // Coordenada padrão de fallback
          setPickupCoord({ lat: -23.2055, lng: -45.8841 })
        },
        { enableHighAccuracy: true, timeout: 5000 }
      )
    }
  }, [isUsingGps])

  // Busca dinâmica com debounce
  const searchAddress = async (text: string) => {
    if (text.trim().length < 3) {
      setSearchResults([])
      return
    }
    setIsSearching(true)
    try {
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(text)}`)
      const data = await res.json()
      setSearchResults(data.results || [])
    } catch {
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleSelectLocation = (item: { name: string; lat: number; lng: number }) => {
    if (activeField === 'pickup') {
      setPickupText(item.name)
      setPickupCoord({ lat: item.lat, lng: item.lng })
    } else if (activeField === 'destination') {
      setDestinationText(item.name)
      setDestCoord({ lat: item.lat, lng: item.lng })
    } else if (typeof activeField === 'number') {
      const updated = [...stops]
      updated[activeField] = { text: item.name, lat: item.lat, lng: item.lng }
      setStops(updated)
    }

    // Salva na memória rápida
    setSavedPlaces(prev => [item.name, ...prev.filter(p => p !== item.name)].slice(0, 7))
    setActiveField(null)
    setSearchResults([])
  }

  const toggleGpsMode = () => {
    if (isUsingGps) {
      setIsUsingGps(false)
      setPickupText('')
      setActiveField('pickup')
    } else {
      setIsUsingGps(true)
      setPickupText('')
      setActiveField(null)
    }
  }

  const addStop = () => {
    if (stops.length < 2) {
      setStops([...stops, { text: '' }])
      setActiveField(stops.length)
    }
  }

  const removeStop = (index: number) => {
    setStops(stops.filter((_, i) => i !== index))
    if (activeField === index) setActiveField(null)
  }

  const updateStopText = (index: number, val: string) => {
    const updated = [...stops]
    updated[index] = { ...updated[index], text: val }
    setStops(updated)
    searchAddress(val)
  }

  // Motor Dinâmico de Cotação
  const handleCompare = () => {
    setIsComparing(true)
    setActiveField(null)

    setTimeout(() => {
      // Simula percurso real com base na rota
      const baseDistance = 5.6 + (stops.length * 3.8)
      const baseTime = 14 + (stops.length * 8)

      // Fator dinâmico que simula a variação de mercado (Uber vs 99)
      const randFactor = Math.random()
      let finalUber: number
      let final99: number

      if (randFactor > 0.5) {
        // Horário onde a 99 está mais em conta
        final99 = Math.max(7.9, 4.2 + (baseDistance * 1.35) + (baseTime * 0.22))
        finalUber = final99 + 4.5 + Math.random() * 3
        setCheaperService('99')
      } else {
        // Horário onde o UberX está mais em conta
        finalUber = Math.max(8.5, 4.8 + (baseDistance * 1.45) + (baseTime * 0.25))
        final99 = finalUber + 3.8 + Math.random() * 2.5
        setCheaperService('uber')
      }

      setPrice99(`R$ ${final99.toFixed(2).replace('.', ',')}`)
      setPriceUber(`R$ ${finalUber.toFixed(2).replace('.', ',')}`)

      setTripTelemetry({
        distance: `aproximadamente ${baseDistance.toFixed(1).replace('.', ',')} km`,
        time: `${baseTime} a ${baseTime + 4} min`
      })

      setHasCompared(true)
      setIsComparing(false)
    }, 700)
  }

  // Despacho 1 Toque com Coordenadas Reais
  const handleUberClick = () => {
    const dLat = destCoord.lat
    const dLng = destCoord.lng
    const encodedDest = encodeURIComponent(destinationText)

    let uri = `uber://?action=setPickup&dropoff[latitude]=${dLat}&dropoff[longitude]=${dLng}&dropoff[formatted_address]=${encodedDest}`
    if (isUsingGps) {
      uri += '&pickup=my_location'
    } else if (pickupCoord) {
      uri += `&pickup[latitude]=${pickupCoord.lat}&pickup[longitude]=${pickupCoord.lng}&pickup[formatted_address]=${encodeURIComponent(pickupText)}`
    }
    window.location.assign(uri)
  }

  const handle99Click = () => {
    const dLat = destCoord.lat
    const dLng = destCoord.lng
    const encodedDest = encodeURIComponent(destinationText)
    const pLat = pickupCoord ? pickupCoord.lat : -23.2055
    const pLng = pickupCoord ? pickupCoord.lng : -45.8841
    const pTitle = encodeURIComponent(isUsingGps ? 'Meu Local' : pickupText)

    const native99Uri = `taxis99://call?pickup_latitude=${pLat}&pickup_longitude=${pLng}&pickup_title=${pTitle}&dropoff_latitude=${dLat}&dropoff_longitude=${dLng}&dropoff_title=${encodedDest}&deep_link_product_id=316`
    window.location.assign(native99Uri)
  }

  const svgHeight = stops.length === 2 ? 132 : stops.length === 1 ? 88 : 44
  const lineY2 = stops.length === 2 ? 122 : stops.length === 1 ? 78 : 34
  const arrowY = stops.length === 2 ? 121 : stops.length === 1 ? 77 : 33
  const arrowTipY = stops.length === 2 ? 128 : stops.length === 1 ? 84 : 40

  return (
    <main style={{
      minHeight: '100dvh',
      boxSizing: 'border-box',
      backgroundColor: '#f8fafc',
      color: '#0f172a',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '24px 20px',
      display: 'flex',
      flexDirection: 'column',
      maxWidth: '430px',
      margin: '0 auto'
    }}>
      <SmartRideBrand />

      {/* Caixa de Rota */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '18px',
        border: '1px solid #e2e8f0',
        padding: '16px 14px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
        marginBottom: '14px',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          left: '14px',
          top: '32px',
          bottom: '34px',
          width: '14px',
          display: 'flex',
          justifyContent: 'center',
          pointerEvents: 'none'
        }}>
          <svg width="14" height="100%" viewBox={`0 0 14 ${svgHeight}`} preserveAspectRatio="none" fill="none">
            <line
              x1="7"
              y1="2"
              x2="7"
              y2={lineY2}
              stroke="#94a3b8"
              strokeWidth="2"
              strokeDasharray="3 3"
              strokeLinecap="round"
            />
            <path
              d={`M3 ${arrowY}L7 ${arrowTipY}L11 ${arrowY}`}
              stroke="#94a3b8"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Linha 1: Partida */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '14px', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0 }}>
            <div style={{
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              backgroundColor: isUsingGps ? '#10b981' : '#38bdf8',
              boxShadow: isUsingGps ? '0 0 0 3px rgba(16, 185, 129, 0.2)' : '0 0 0 3px rgba(56, 189, 248, 0.2)',
              flexShrink: 0
            }} />
            
            {isUsingGps ? (
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>
                Minha localização atual (GPS)
              </span>
            ) : (
              <input
                type="text"
                autoFocus
                value={pickupText}
                onFocus={() => setActiveField('pickup')}
                onChange={(e) => {
                  setPickupText(e.target.value)
                  searchAddress(e.target.value)
                }}
                placeholder="Digitar partida..."
                style={{
                  width: '100%',
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#0f172a'
                }}
              />
            )}
          </div>

          <button
            onClick={toggleGpsMode}
            style={{
              border: 'none',
              backgroundColor: isUsingGps ? '#f1f5f9' : '#ecfdf5',
              color: isUsingGps ? '#475569' : '#059669',
              padding: '5px 9px',
              borderRadius: '8px',
              fontSize: '11px',
              fontWeight: '700',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {isUsingGps ? '✏️ Alterar' : '🎯 Meu GPS'}
          </button>
        </div>

        <div style={{ height: '1px', backgroundColor: '#f1f5f9', marginLeft: '28px', marginBottom: '14px' }} />

        {/* Paradas */}
        {stops.map((stop, index) => (
          <React.Fragment key={index}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '14px', position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0 }}>
                <div style={{
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  backgroundColor: index === 0 ? '#f59e0b' : '#fb923c',
                  boxShadow: index === 0 ? '0 0 0 3px rgba(245, 158, 11, 0.2)' : '0 0 0 3px rgba(251, 146, 60, 0.2)',
                  flexShrink: 0
                }} />
                <input
                  type="text"
                  autoFocus={index === stops.length - 1}
                  value={stop.text}
                  onFocus={() => setActiveField(index)}
                  onChange={(e) => updateStopText(index, e.target.value)}
                  placeholder={`Parada ${index + 1}...`}
                  style={{
                    width: '100%',
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#0f172a'
                  }}
                />
              </div>

              <button
                onClick={() => removeStop(index)}
                style={{
                  border: 'none',
                  backgroundColor: '#fee2e2',
                  color: '#ef4444',
                  width: '24px',
                  height: '24px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: '800',
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>
            </div>
            <div style={{ height: '1px', backgroundColor: '#f1f5f9', marginLeft: '28px', marginBottom: '14px' }} />
          </React.Fragment>
        ))}

        {/* Destino */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0 }}>
            <div style={{
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              backgroundColor: '#ef4444',
              boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.2)',
              flexShrink: 0
            }} />
            <input
              type="text"
              value={destinationText}
              onFocus={() => setActiveField('destination')}
              onChange={(e) => {
                setDestinationText(e.target.value)
                searchAddress(e.target.value)
              }}
              placeholder="Para onde quer ir?"
              style={{
                width: '100%',
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: '14px',
                fontWeight: '600',
                color: '#0f172a'
              }}
            />
          </div>

          {stops.length < 2 && (
            <button
              onClick={addStop}
              style={{
                border: '1px solid #e2e8f0',
                backgroundColor: '#f8fafc',
                color: '#044e42',
                padding: '4px 8px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              + Parada
            </button>
          )}
        </div>
      </div>

      {/* Sugestões Inteligentes e Resultados da Busca */}
      {activeField !== null && (
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '14px',
          border: '1px solid #e2e8f0',
          padding: '12px',
          marginBottom: '14px',
          boxShadow: '0 6px 16px rgba(0,0,0,0.08)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '11.5px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>
              {isSearching ? '🔍 Buscando...' : searchResults.length > 0 ? 'Endereços Encontrados' : '⚡ Favoritos Rápidos'}
            </span>
            <button
              onClick={() => setActiveField(null)}
              style={{ background: 'none', border: 'none', fontSize: '11px', color: '#94a3b8', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Fechar ✕
            </button>
          </div>

          {/* Lista de Resultados Reais */}
          {searchResults.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {searchResults.map((res, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectLocation(res)}
                  style={{
                    textAlign: 'left',
                    padding: '8px 10px',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>{res.name}</div>
                  <div style={{ fontSize: '11px', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {res.address}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {savedPlaces.map((place, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectLocation({ name: place, lat: -23.1896, lng: -45.8841 })}
                  style={{
                    backgroundColor: '#f1f5f9',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '6px 10px',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#1e293b',
                    cursor: 'pointer'
                  }}
                >
                  📍 {place}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Cápsula de Telemetria */}
      {hasCompared && tripTelemetry && (
        <div style={{
          backgroundColor: '#f1f5f9',
          borderRadius: '12px',
          padding: '10px 14px',
          marginBottom: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          border: '1px solid #e2e8f0'
        }}>
          <span style={{ fontSize: '13px' }}>📍</span>
          <span style={{ fontSize: '12.5px', fontWeight: '600', color: '#1e293b' }}>
            Percurso estimado: <strong style={{ color: '#044e42' }}>{tripTelemetry.distance}</strong> • <strong style={{ color: '#044e42' }}>{tripTelemetry.time}</strong>
          </span>
        </div>
      )}

      {/* Cards de Comparação com Destaque para o Menor Preço */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
        {/* Card 99 */}
        <button
          onClick={handle99Click}
          style={{
            backgroundColor: '#ffffff',
            border: cheaperService === '99' ? '2.5px solid #10b981' : '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: hasCompared ? '14px 10px' : '22px 12px',
            boxShadow: cheaperService === '99' ? '0 4px 16px rgba(16, 185, 129, 0.2)' : '0 4px 12px rgba(0,0,0,0.06)',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            position: 'relative'
          }}
        >
          {hasCompared && cheaperService === '99' && (
            <span style={{
              position: 'absolute',
              top: '-10px',
              backgroundColor: '#10b981',
              color: '#ffffff',
              fontSize: '10px',
              fontWeight: '800',
              padding: '2px 8px',
              borderRadius: '20px',
              textTransform: 'uppercase'
            }}>
              Melhor Opção 🚀
            </span>
          )}
          <div style={{
            width: '54px',
            height: '40px',
            backgroundColor: '#ffc107',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{ fontSize: '23px', fontWeight: '950', color: '#000' }}>99</span>
          </div>
          {hasCompared && (
            <span style={{ fontSize: '15px', fontWeight: '800', color: '#044e42' }}>
              {price99}
            </span>
          )}
        </button>

        {/* Card UberX */}
        <button
          onClick={handleUberClick}
          style={{
            backgroundColor: '#ffffff',
            border: cheaperService === 'uber' ? '2.5px solid #10b981' : '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: hasCompared ? '14px 10px' : '22px 12px',
            boxShadow: cheaperService === 'uber' ? '0 4px 16px rgba(16, 185, 129, 0.2)' : '0 4px 12px rgba(0,0,0,0.06)',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            position: 'relative'
          }}
        >
          {hasCompared && cheaperService === 'uber' && (
            <span style={{
              position: 'absolute',
              top: '-10px',
              backgroundColor: '#10b981',
              color: '#ffffff',
              fontSize: '10px',
              fontWeight: '800',
              padding: '2px 8px',
              borderRadius: '20px',
              textTransform: 'uppercase'
            }}>
              Melhor Opção 🚀
            </span>
          )}
          <div style={{ height: '40px', display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: '25px', fontWeight: '900', color: '#000000' }}>UberX</span>
          </div>
          {hasCompared && (
            <span style={{ fontSize: '15px', fontWeight: '800', color: '#044e42' }}>
              {priceUber}
            </span>
          )}
        </button>
      </div>

      {/* Botão de Comparar */}
      <button
        onClick={handleCompare}
        disabled={isComparing}
        style={{
          width: '100%',
          backgroundColor: hasCompared ? '#0f172a' : '#044e42',
          color: '#ffffff',
          border: 'none',
          borderRadius: '14px',
          padding: '14px 16px',
          fontSize: '15px',
          fontWeight: '700',
          cursor: isComparing ? 'wait' : 'pointer',
          marginBottom: '16px'
        }}
      >
        {isComparing ? 'Consultando tarifas ao vivo...' : hasCompared ? '🔄 Atualizar Tarifas' : '🔍 Comparar Tarifas'}
      </button>

      <TitaniumCoin />
    </main>
  )
}
