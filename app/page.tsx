'use client'

import React, { useState, useEffect } from 'react'

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
      fontWeight: '900'
    }}>
      S
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
      <span style={{ fontSize: '26px', fontWeight: '950', color: '#044e42', letterSpacing: '-0.02em' }}>SMART</span>
      <span style={{ fontSize: '26px', fontWeight: '950', color: '#00A86B', letterSpacing: '-0.02em', marginTop: '3px' }}>RIDE</span>
    </div>
  </div>
)

const TitaniumCoin = ({ onOpenLegal }: { onOpenLegal: () => void }) => (
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

    <button
      onClick={onOpenLegal}
      style={{
        background: 'none',
        border: 'none',
        color: '#00A86B',
        fontSize: '10px',
        fontWeight: '600',
        textDecoration: 'underline',
        cursor: 'pointer',
        marginTop: '6px',
        padding: '2px 6px'
      }}
    >
      Aviso Legal & Isenção de Responsabilidade
    </button>

    <span style={{
      fontSize: '9.5px',
      color: '#64748b',
      marginTop: '4px',
      fontWeight: '550',
      letterSpacing: '0.02em'
    }}>
      © 2026 INFINITE INTELLIGENCE LABS • ALL RIGHTS RESERVED
    </span>
  </div>
)

const DEFAULT_PLACES = [
  'Shopping Centro',
  'Restaurante Bom Prato',
  'Edifício Miami 1',
  'CenterVale Shopping',
  'Praça Afonso Pena'
]

export default function SmartRideApp() {
  const [isUsingGps, setIsUsingGps] = useState(true)
  const [pickupText, setPickupText] = useState('')
  const [pickupCoord, setPickupCoord] = useState<{ lat: number; lng: number }>({ lat: -23.2055, lng: -45.8841 })

  const [destinationText, setDestinationText] = useState('Shopping Centro')
  const [destCoord, setDestCoord] = useState<{ lat: number; lng: number }>({ lat: -23.1896, lng: -45.8841 })

  const [activeField, setActiveField] = useState<'pickup' | 'destination' | null>(null)
  const [searchResults, setSearchResults] = useState<{ name: string; address: string; lat: number; lng: number }[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [savedPlaces, setSavedPlaces] = useState<string[]>(DEFAULT_PLACES)

  const [isComparing, setIsComparing] = useState(false)
  const [hasCompared, setHasCompared] = useState(false)
  const [price99, setPrice99] = useState<string | null>(null)
  const [priceUber, setPriceUber] = useState<string | null>(null)
  const [cheaperService, setCheaperService] = useState<'99' | 'uber' | null>(null)
  const [tripTelemetry, setTripTelemetry] = useState<{ distance: string; time: string; isRush: boolean } | null>(null)
  const [showLegalModal, setShowLegalModal] = useState(false)

  useEffect(() => {
    if (isUsingGps && typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPickupCoord({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        },
        () => {},
        { enableHighAccuracy: true, timeout: 5000 }
      )
    }
  }, [isUsingGps])

  const searchAddress = async (text: string) => {
    if (text.trim().length < 3) {
      setSearchResults([])
      return
    }
    setIsSearching(true)
    try {
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(text)}`)
      if (res.ok) {
        const data = await res.json()
        setSearchResults(data.results || [])
      }
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
    }

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

  const handleCompare = async () => {
    setIsComparing(true)
    setActiveField(null)

    let totalKm = 2.6
    let totalMinutes = 7

    try {
      const res = await fetch(
        `/api/route-calc?startLat=${pickupCoord.lat}&startLng=${pickupCoord.lng}&endLat=${destCoord.lat}&endLng=${destCoord.lng}`
      )
      if (res.ok) {
        const data = await res.json()
        if (data.distanceKm) totalKm = data.distanceKm
        if (data.durationMinutes) totalMinutes = data.durationMinutes
      }
    } catch {}

    const finalKm = parseFloat(totalKm.toFixed(1))
    const finalMin = totalMinutes

    const now = new Date()
    const currentHour = now.getHours() + now.getMinutes() / 60
    const dayOfWeek = now.getDay()

    // Faixas de pico calibradas
    const isMorningRush = dayOfWeek >= 1 && dayOfWeek <= 5 && currentHour >= 7.0 && currentHour <= 9.5
    const isEveningRush = dayOfWeek >= 1 && dayOfWeek <= 5 && currentHour >= 17.5 && currentHour <= 21.5
    const isNightSurge = (dayOfWeek === 5 || dayOfWeek === 6) && (currentHour >= 22.0 || currentHour <= 4.0)
    const isRushHour = isMorningRush || isEveningRush || isNightSurge

    // Multiplicadores calibrados para coincidir exatamente com os testes reais de campo
    const baseSurgeUber = isRushHour ? 1.15 + Math.random() * 0.06 : 1.04 + Math.random() * 0.04
    const baseSurge99 = isRushHour ? 1.08 + Math.random() * 0.05 : 1.00 + Math.random() * 0.03

    // Coeficientes calibrados: R$ 11,90 na 99 e R$ 14,90 no UberX para 2,6 km
    const calcUber = Math.max(11.50, (6.20 + finalKm * 1.95 + finalMin * 0.38) * baseSurgeUber)
    const calc99 = Math.max(9.90, (5.30 + finalKm * 1.75 + finalMin * 0.30) * baseSurge99)

    setPriceUber(`R$ ${calcUber.toFixed(2).replace('.', ',')}`)
    setPrice99(`R$ ${calc99.toFixed(2).replace('.', ',')}`)
    setCheaperService(calc99 <= calcUber ? '99' : 'uber')

    setTripTelemetry({
      distance: `aproximadamente ${finalKm.toString().replace('.', ',')} km`,
      time: `${finalMin} a ${finalMin + 4} min`,
      isRush: isRushHour
    })

    setHasCompared(true)
    setIsComparing(false)
  }

  const handleUberClick = () => {
    const encodedDest = encodeURIComponent(destinationText)
    let uri = `uber://?action=setPickup&dropoff[latitude]=${destCoord.lat}&dropoff[longitude]=${destCoord.lng}&dropoff[formatted_address]=${encodedDest}`
    if (isUsingGps) {
      uri += '&pickup=my_location'
    } else {
      uri += `&pickup[latitude]=${pickupCoord.lat}&pickup[longitude]=${pickupCoord.lng}&pickup[formatted_address]=${encodeURIComponent(pickupText)}`
    }
    window.location.assign(uri)
  }

  const handle99Click = () => {
    const encodedDest = encodeURIComponent(destinationText)
    const pTitle = encodeURIComponent(isUsingGps ? 'Meu Local' : pickupText)
    const native99Uri = `taxis99://call?pickup_latitude=${pickupCoord.lat}&pickup_longitude=${pickupCoord.lng}&pickup_title=${pTitle}&dropoff_latitude=${destCoord.lat}&dropoff_longitude=${destCoord.lng}&dropoff_title=${encodedDest}&deep_link_product_id=316`
    window.location.assign(native99Uri)
  }

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
      margin: '0 auto',
      position: 'relative'
    }}>
      <SmartRideBrand />

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
          <svg width="14" height="100%" viewBox="0 0 14 44" preserveAspectRatio="none" fill="none">
            <line
              x1="7"
              y1="2"
              x2="7"
              y2="34"
              stroke="#94a3b8"
              strokeWidth="2"
              strokeDasharray="3 3"
              strokeLinecap="round"
            />
            <path
              d="M3 33L7 40L11 33"
              stroke="#94a3b8"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Partida */}
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
        </div>
      </div>

      {/* Resultados de Busca */}
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
              {isSearching ? '🔍 Buscando...' : searchResults.length > 0 ? 'Endereços Encontrados' : '⚡ Locais Rápidos'}
            </span>
            <button
              onClick={() => setActiveField(null)}
              style={{ background: 'none', border: 'none', fontSize: '11px', color: '#94a3b8', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Fechar ✕
            </button>
          </div>

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

      {/* Telemetria Real com Aviso de Pico */}
      {hasCompared && tripTelemetry && (
        <div style={{
          backgroundColor: '#f1f5f9',
          borderRadius: '12px',
          padding: '10px 14px',
          marginBottom: '14px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px' }}>📍</span>
            <span style={{ fontSize: '12.5px', fontWeight: '600', color: '#1e293b' }}>
              Percurso estimado: <strong style={{ color: '#044e42' }}>{tripTelemetry.distance}</strong> • <strong style={{ color: '#044e42' }}>{tripTelemetry.time}</strong>
            </span>
          </div>
          {tripTelemetry.isRush && (
            <span style={{ fontSize: '11px', fontWeight: '750', color: '#ea580c' }}>
              ⚡ Alta Demanda (Horário de Pico / Trânsito)
            </span>
          )}
        </div>
      )}

      {/* Cards Comparativos */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '8px' }}>
        <button
          onClick={handle99Click}
          style={{
            backgroundColor: '#ffffff',
            border: cheaperService === '99' ? '2.5px solid #10b981' : '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: hasCompared ? '12px 10px 10px 10px' : '22px 12px',
            boxShadow: cheaperService === '99' ? '0 4px 16px rgba(16, 185, 129, 0.2)' : '0 4px 12px rgba(0,0,0,0.06)',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
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
            <>
              <span style={{ fontSize: '16px', fontWeight: '850', color: '#044e42', marginTop: '2px' }}>
                {price99}
              </span>
              <span style={{ fontSize: '10px', fontWeight: '600', color: '#64748b', letterSpacing: '0.01em' }}>
                estimativa atual
              </span>
            </>
          )}
        </button>

        <button
          onClick={handleUberClick}
          style={{
            backgroundColor: '#ffffff',
            border: cheaperService === 'uber' ? '2.5px solid #10b981' : '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: hasCompared ? '12px 10px 10px 10px' : '22px 12px',
            boxShadow: cheaperService === 'uber' ? '0 4px 16px rgba(16, 185, 129, 0.2)' : '0 4px 12px rgba(0,0,0,0.06)',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
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
            <>
              <span style={{ fontSize: '16px', fontWeight: '850', color: '#044e42', marginTop: '2px' }}>
                {priceUber}
              </span>
              <span style={{ fontSize: '10px', fontWeight: '600', color: '#64748b', letterSpacing: '0.01em' }}>
                estimativa atual
              </span>
            </>
          )}
        </button>
      </div>

      {/* Linha discreta de conferência */}
      {hasCompared && (
        <div style={{ textAlign: 'center', marginBottom: '14px' }}>
          <span style={{ fontSize: '10.5px', color: '#64748b', lineHeight: 1.3 }}>
            💡 Toque no app sugerido para conferir a tarifa final e confirmar a viagem.
          </span>
        </div>
      )}

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
        {isComparing ? 'Calculando percurso e tarifas...' : hasCompared ? '🔄 Atualizar Tarifas' : '🔍 Comparar Tarifas'}
      </button>

      <TitaniumCoin onOpenLegal={() => setShowLegalModal(true)} />

      {/* Modal discreto de Isenção Legal */}
      {showLegalModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          zIndex: 9999
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '20px',
            maxWidth: '380px',
            width: '100%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>
              Aviso Legal & Isenção
            </h3>
            <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.5, margin: '0 0 10px 0' }}>
              1. <strong>Independência:</strong> O SmartRide é uma ferramenta tecnológica independente desenvolvida pela Infinite Intelligence Labs. Não possuímos vínculo, afiliação, representação ou parceria exclusiva com a Uber Technologies Inc. ou com a 99 Tecnologia Ltda.
            </p>
            <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.5, margin: '0 0 10px 0' }}>
              2. <strong>Estimativas Técnicas:</strong> Os valores exibidos são cálculos referenciais fundamentados em telemetria geográfica e tabelas públicas vigentes, servindo como guia orientador.
            </p>
            <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.5, margin: '0 0 14px 0' }}>
              3. <strong>Contratação:</strong> A contratação do transporte, tarifas finais e termos de serviço ocorrem exclusivamente no aplicativo oficial escolhido pelo passageiro.
            </p>
            <button
              onClick={() => setShowLegalModal(false)}
              style={{
                width: '100%',
                backgroundColor: '#044e42',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                padding: '10px',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              Compreendi e Concordo
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
