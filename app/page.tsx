'use client'

import React, { useState, useEffect } from 'react'

// Logotipo Proprietário B do Best Ride
const BestRideBrand = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '24px' }}>
    <svg width="60" height="60" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 168, 107, 0.15))' }}>
      <path
        d="M20 10C20 10 37 10 42 16.5C46.5 22.5 40 28.5 32 29.5C43.5 30.5 48 37.5 43.5 45.5C39 52.5 24 52.5 20 52.5C15 52.5 13.5 49 13.5 45C13.5 39.5 18 35 29 35C40 35 42.5 29.5 37.5 26C33 22.5 20 22.5 20 22.5"
        stroke="#00E676"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M23 15C23 15 34 15 37 20C40 25 36.5 28.5 29.5 29C38.5 30 41 36.5 37 42C33.5 47 25 47 23 47"
        stroke="#00A86B"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.85"
      />
      <path
        d="M19.5 10V52.5"
        stroke="#008B74"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <path
        d="M14.5 14V48"
        stroke="#00A86B"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.7"
      />
      <circle cx="29" cy="35" r="2.5" fill="#38bdf8" />
    </svg>
    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
      <span style={{ fontSize: '27px', fontWeight: '950', color: '#044e42', letterSpacing: '-0.02em' }}>BEST</span>
      <span style={{ fontSize: '27px', fontWeight: '950', color: '#00A86B', letterSpacing: '-0.02em', marginTop: '3px' }}>RIDE</span>
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

// Locais padrão iniciais para agilidade
const DEFAULT_SAVED_PLACES = [
  'Faculdade Ellen',
  'Praça Afonso Pena',
  'Avenida José Longo',
  'Casa',
  'CenterVale Shopping'
]

export default function BestRideApp() {
  const [isUsingGps, setIsUsingGps] = useState(true)
  const [manualPickup, setManualPickup] = useState('')
  const [stops, setStops] = useState<string[]>([])
  const [destinationAddress, setDestinationAddress] = useState('Praça Afonso Pena')

  // Controle de locais memorizados no aparelho
  const [savedPlaces, setSavedPlaces] = useState<string[]>(DEFAULT_SAVED_PLACES)
  const [activeField, setActiveField] = useState<'pickup' | 'destination' | number | null>(null)

  const [isComparing, setIsComparing] = useState(false)
  const [hasCompared, setHasCompared] = useState(false)
  const [price99, setPrice99] = useState<string | null>(null)
  const [priceUber, setPriceUber] = useState<string | null>(null)
  const [tripTelemetry, setTripTelemetry] = useState<{ distance: string; time: string } | null>(null)

  // Carrega histórico memorizado localmente ao abrir
  useEffect(() => {
    try {
      const stored = localStorage.getItem('best_ride_saved_places')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSavedPlaces(parsed)
        }
      }
    } catch {
      // Navegador em modo privado ou suporte desabilitado
    }
  }, [])

  // Guarda novos locais frequentemente usados
  const savePlaceToHistory = (place: string) => {
    const trimmed = place.trim()
    if (!trimmed || trimmed === 'Minha localização atual (GPS)') return
    setSavedPlaces(prev => {
      const updated = [trimmed, ...prev.filter(p => p.toLowerCase() !== trimmed.toLowerCase())].slice(0, 7)
      try {
        localStorage.setItem('best_ride_saved_places', JSON.stringify(updated))
      } catch {}
      return updated
    })
  }

  const selectSuggestedPlace = (place: string) => {
    if (activeField === 'pickup') {
      setManualPickup(place)
    } else if (activeField === 'destination') {
      setDestinationAddress(place)
    } else if (typeof activeField === 'number') {
      updateStop(activeField, place)
    }
    setActiveField(null)
  }

  const toggleGpsMode = () => {
    if (isUsingGps) {
      setIsUsingGps(false)
      setManualPickup('')
      setActiveField('pickup')
    } else {
      setIsUsingGps(true)
      setManualPickup('')
      setActiveField(null)
    }
  }

  const addStop = () => {
    if (stops.length < 2) {
      setStops([...stops, ''])
      setActiveField(stops.length)
    }
  }

  const removeStop = (index: number) => {
    setStops(stops.filter((_, i) => i !== index))
    if (activeField === index) setActiveField(null)
  }

  const updateStop = (index: number, value: string) => {
    const updated = [...stops]
    updated[index] = value
    setStops(updated)
  }

  const handleCompare = () => {
    setIsComparing(true)

    // Grava automaticamente os locais preenchidos no histórico
    if (!isUsingGps && manualPickup) savePlaceToHistory(manualPickup)
    if (destinationAddress) savePlaceToHistory(destinationAddress)
    stops.forEach(s => { if (s) savePlaceToHistory(s) })
    setActiveField(null)

    setTimeout(() => {
      if (stops.length === 2) {
        setPrice99('R$ 16,90')
        setPriceUber('R$ 24,50')
        setTripTelemetry({
          distance: 'aproximadamente 12,3 km',
          time: '28 a 35 min'
        })
      } else if (stops.length === 1) {
        setPrice99('R$ 12,40')
        setPriceUber('R$ 19,80')
        setTripTelemetry({
          distance: 'aproximadamente 8,7 km',
          time: '20 a 25 min'
        })
      } else {
        setPrice99('R$ 7,80')
        setPriceUber('R$ 14,20')
        setTripTelemetry({
          distance: 'aproximadamente 5,4 km',
          time: '12 a 15 min'
        })
      }
      setHasCompared(true)
      setIsComparing(false)
    }, 600)
  }

  const handleUberClick = () => {
    const encodedDest = encodeURIComponent(destinationAddress)
    const encodedPickup = encodeURIComponent(isUsingGps ? 'Minha Localização' : manualPickup)

    const pickupParam = isUsingGps
      ? 'pickup=my_location'
      : `pickup[formatted_address]=${encodedPickup}&pickup[nickname]=${encodedPickup}`

    const nativeUri = `uber://?action=setPickup&${pickupParam}&dropoff[latitude]=-23.1896&dropoff[longitude]=-45.8841&dropoff[nickname]=${encodedDest}&dropoff[formatted_address]=${encodedDest}`
    window.location.assign(nativeUri)
  }

  const handle99Click = () => {
    const encodedDest = encodeURIComponent(destinationAddress)
    const pickupTitle = encodeURIComponent(isUsingGps ? 'Minha Localização' : manualPickup)
    const native99Uri = `taxis99://call?pickup_latitude=-23.2055&pickup_longitude=-45.8841&pickup_title=${pickupTitle}&dropoff_latitude=-23.1896&dropoff_longitude=-45.8841&dropoff_title=${encodedDest}&deep_link_product_id=316`
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
      {/* Logotipo Superior */}
      <BestRideBrand />

      {/* Caixa de Trajeto */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '18px',
        border: '1px solid #e2e8f0',
        padding: '16px 14px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
        marginBottom: '14px',
        position: 'relative'
      }}>
        {/* Linha vertical tracejada com controle dinâmico */}
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
                value={manualPickup}
                onFocus={() => setActiveField('pickup')}
                onChange={(e) => setManualPickup(e.target.value)}
                placeholder="Ex: Faculdade, Rodoviária..."
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
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            {isUsingGps ? '✏️ Alterar' : '🎯 Meu GPS'}
          </button>
        </div>

        <div style={{ height: '1px', backgroundColor: '#f1f5f9', marginLeft: '28px', marginBottom: '14px' }} />

        {/* Paradas Intermediárias */}
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
                  value={stop}
                  onFocus={() => setActiveField(index)}
                  onChange={(e) => updateStop(index, e.target.value)}
                  placeholder={`Parada ${index + 1} (ex: Faculdade, Restaurante...)`}
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
                title="Remover parada"
                style={{
                  border: 'none',
                  backgroundColor: '#fee2e2',
                  color: '#ef4444',
                  width: '24px',
                  height: '24px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ✕
              </button>
            </div>
            <div style={{ height: '1px', backgroundColor: '#f1f5f9', marginLeft: '28px', marginBottom: '14px' }} />
          </React.Fragment>
        ))}

        {/* Linha Final: Destino */}
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
              value={destinationAddress}
              onFocus={() => setActiveField('destination')}
              onChange={(e) => setDestinationAddress(e.target.value)}
              placeholder="Para onde você quer ir?"
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
                border: 'none',
                backgroundColor: '#f8fafc',
                borderWidth: '1px',
                borderColor: '#e2e8f0',
                borderStyle: 'solid',
                color: '#044e42',
                padding: '4px 8px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: '700',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '3px'
              }}
            >
              + Parada
            </button>
          )}
        </div>
      </div>

      {/* Sugestões Rápidas de Locais Frequentes (Aparece ao focar no campo) */}
      {activeField !== null && (
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '14px',
          border: '1px solid #e2e8f0',
          padding: '10px 12px',
          marginBottom: '14px',
          boxShadow: '0 4px 14px rgba(0,0,0,0.06)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '11.5px', fontWeight: '750', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              ⚡ Sugestões Rápidas (Toque para preencher)
            </span>
            <button
              onClick={() => setActiveField(null)}
              style={{ background: 'none', border: 'none', fontSize: '11px', color: '#94a3b8', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Fechar ✕
            </button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {savedPlaces.map((place, idx) => (
              <button
                key={idx}
                onClick={() => selectSuggestedPlace(place)}
                style={{
                  backgroundColor: '#f1f5f9',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '6px 10px',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#1e293b',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <span>📍</span>
                <span>{place}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Cápsula Informativa: Distância + Tempo */}
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
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
        }}>
          <span style={{ fontSize: '13px' }}>📍</span>
          <span style={{ fontSize: '12.5px', fontWeight: '600', color: '#1e293b' }}>
            Percurso estimado: <strong style={{ color: '#044e42' }}>{tripTelemetry.distance}</strong> • <strong style={{ color: '#044e42' }}>{tripTelemetry.time}</strong>
          </span>
        </div>
      )}

      {/* Cards Lado a Lado (99 e Uber) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
        {/* Card 99 */}
        <button
          onClick={handle99Click}
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: hasCompared ? '16px 12px' : '22px 12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            outline: 'none',
            minHeight: '94px'
          }}
        >
          <div style={{
            width: '54px',
            height: '40px',
            backgroundColor: '#ffc107',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 5px rgba(0,0,0,0.08)'
          }}>
            <span style={{ fontSize: '23px', fontWeight: '950', color: '#000', letterSpacing: '-0.05em' }}>99</span>
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
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: hasCompared ? '16px 12px' : '22px 12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            outline: 'none',
            minHeight: '94px'
          }}
        >
          <div style={{ height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '25px', fontWeight: '900', color: '#000000', letterSpacing: '-0.02em' }}>
              UberX
            </span>
          </div>
          {hasCompared && (
            <span style={{ fontSize: '15px', fontWeight: '800', color: '#044e42' }}>
              {priceUber}
            </span>
          )}
        </button>
      </div>

      {/* Botão de Comparar / Atualizar */}
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
          marginBottom: '16px',
          boxShadow: '0 4px 12px rgba(4, 78, 66, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          transition: 'all 0.2s ease'
        }}
      >
        {isComparing ? (
          'Buscando tarifas...'
        ) : hasCompared ? (
          '🔄 Atualizar Tarifas'
        ) : (
          '🔍 Comparar Tarifas'
        )}
      </button>

      {/* Assinatura com Moeda de Titânio */}
      <TitaniumCoin />
    </main>
  )
}
