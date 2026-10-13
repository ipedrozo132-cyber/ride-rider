'use client'

import React, { useState, useEffect } from 'react'

const MakeEasyBrand = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '20px' }}>
    <div style={{
      width: '44px',
      height: '44px',
      borderRadius: '12px',
      background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
      color: '#ffffff',
      fontSize: '24px',
      fontWeight: '900'
    }}>
      ⚡
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
      <span style={{ fontSize: '24px', fontWeight: '950', color: '#0f172a', letterSpacing: '-0.02em' }}>MAKE</span>
      <span style={{ fontSize: '24px', fontWeight: '950', color: '#2563eb', letterSpacing: '-0.02em' }}>EASY</span>
    </div>
  </div>
)

const DEFAULT_PLACES = [
  'Shopping Centro',
  'CenterVale Shopping',
  'Praça Afonso Pena',
  'Restaurante Bom Prato',
  'Edifício Miami 1'
]

export default function MakeEasyApp() {
  const [isUsingGps, setIsUsingGps] = useState(true)
  const [pickupText, setPickupText] = useState('')
  const [pickupCoord, setPickupCoord] = useState<{ lat: number; lng: number }>({ lat: -23.2055, lng: -45.8841 })

  // Parada Intermediária
  const [hasStop, setHasStop] = useState(false)
  const [stopText, setStopText] = useState('')
  const [stopCoord, setStopCoord] = useState<{ lat: number; lng: number } | null>(null)

  // Destino Final
  const [destinationText, setDestinationText] = useState('Shopping Centro')
  const [destCoord, setDestCoord] = useState<{ lat: number; lng: number }>({ lat: -23.1896, lng: -45.8841 })

  // Telemetria da Rota (Distância e Tempo)
  const [routeInfo, setRouteInfo] = useState<{ distance: string; duration: string } | null>(null)
  const [isLoadingRoute, setIsLoadingRoute] = useState(false)

  const [activeField, setActiveField] = useState<'pickup' | 'stop' | 'destination' | null>(null)
  const [searchResults, setSearchResults] = useState<{ name: string; address: string; lat: number; lng: number }[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [savedPlaces, setSavedPlaces] = useState<string[]>(DEFAULT_PLACES)

  // Alerta de Parada Copiada
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Modal de Apoio / Pix
  const [showSupportModal, setShowSupportModal] = useState(false)
  const [isAdFree, setIsAdFree] = useState(false)
  const [pixCopied, setPixCopied] = useState(false)

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

  // Atualiza a telemetria sempre que as coordenadas mudarem
  useEffect(() => {
    const fetchRouteTelemetry = async () => {
      setIsLoadingRoute(true)
      try {
        const res = await fetch(
          `/api/route-calc?startLat=${pickupCoord.lat}&startLng=${pickupCoord.lng}&endLat=${destCoord.lat}&endLng=${destCoord.lng}`
        )
        if (res.ok) {
          const data = await res.json()
          if (data.distanceKm && data.durationMinutes) {
            setRouteInfo({
              distance: `aproximadamente ${data.distanceKm.toFixed(1).replace('.', ',')} km`,
              duration: `${data.durationMinutes} min`
            })
          }
        }
      } catch {
        // Fallback básico caso a API demore
        setRouteInfo(null)
      } finally {
        setIsLoadingRoute(false)
      }
    }

    if (pickupCoord && destCoord) {
      fetchRouteTelemetry()
    }
  }, [pickupCoord, destCoord])

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 4500)
  }

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
    } else if (activeField === 'stop') {
      setStopText(item.name)
      setStopCoord({ lat: item.lat, lng: item.lng })
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

  const handleCopyStopAndNotify = () => {
    if (hasStop && stopText.trim()) {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(stopText.trim())
      }
      showToast(`📋 Endereço da parada copiado: "${stopText}"! Cole no app para adicionar a parada intermediária.`)
    }
  }

  const handleLaunchUber = () => {
    handleCopyStopAndNotify()
    const encodedDest = encodeURIComponent(destinationText)
    let uri = `uber://?action=setPickup&dropoff[latitude]=${destCoord.lat}&dropoff[longitude]=${destCoord.lng}&dropoff[formatted_address]=${encodedDest}`
    if (isUsingGps) {
      uri += '&pickup=my_location'
    } else {
      uri += `&pickup[latitude]=${pickupCoord.lat}&pickup[longitude]=${pickupCoord.lng}&pickup[formatted_address]=${encodeURIComponent(pickupText)}`
    }
    window.location.assign(uri)
  }

  const handleLaunch99 = () => {
    handleCopyStopAndNotify()
    const encodedDest = encodeURIComponent(destinationText)
    const pTitle = encodeURIComponent(isUsingGps ? 'Meu Local' : pickupText)
    const native99Uri = `taxis99://call?pickup_latitude=${pickupCoord.lat}&pickup_longitude=${pickupCoord.lng}&pickup_title=${pTitle}&dropoff_latitude=${destCoord.lat}&dropoff_longitude=${destCoord.lng}&dropoff_title=${encodedDest}&deep_link_product_id=316`
    window.location.assign(native99Uri)
  }

  const copyPixCode = () => {
    const pixPayload = 'contato@makeeasy.app'
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(pixPayload)
    }
    setPixCopied(true)
    setTimeout(() => setPixCopied(false), 3000)
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
      <MakeEasyBrand />

      {/* Notificação Toast Flutuante */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '16px',
          left: '20px',
          right: '20px',
          maxWidth: '390px',
          margin: '0 auto',
          backgroundColor: '#0f172a',
          color: '#ffffff',
          padding: '12px 14px',
          borderRadius: '12px',
          fontSize: '12.5px',
          lineHeight: 1.4,
          boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Caixa de Rota */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '18px',
        border: '1px solid #e2e8f0',
        padding: '16px 14px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
        marginBottom: '10px',
        position: 'relative'
      }}>
        {/* Ponto 1: Partida */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
            <div style={{
              width: '13px',
              height: '13px',
              borderRadius: '50%',
              backgroundColor: isUsingGps ? '#10b981' : '#38bdf8',
              boxShadow: isUsingGps ? '0 0 0 3px rgba(16, 185, 129, 0.2)' : '0 0 0 3px rgba(56, 189, 248, 0.2)',
              flexShrink: 0
            }} />
            
            {isUsingGps ? (
              <span style={{ fontSize: '13.5px', fontWeight: '600', color: '#1e293b' }}>
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
                  fontSize: '13.5px',
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
              padding: '5px 8px',
              borderRadius: '8px',
              fontSize: '11px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            {isUsingGps ? '✏️ Alterar' : '🎯 GPS'}
          </button>
        </div>

        {/* Ponto 2: Parada Intermediária (Opcional) */}
        {hasStop && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            marginBottom: '12px',
            paddingTop: '8px',
            borderTop: '1px dashed #e2e8f0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
              <div style={{
                width: '13px',
                height: '13px',
                borderRadius: '3px',
                backgroundColor: '#f59e0b',
                boxShadow: '0 0 0 3px rgba(245, 158, 11, 0.2)',
                flexShrink: 0
              }} />
              <input
                type="text"
                value={stopText}
                onFocus={() => setActiveField('stop')}
                onChange={(e) => {
                  setStopText(e.target.value)
                  searchAddress(e.target.value)
                }}
                placeholder="Parada intermediária..."
                style={{
                  width: '100%',
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontSize: '13.5px',
                  fontWeight: '600',
                  color: '#0f172a'
                }}
              />
            </div>
            <button
              onClick={() => {
                setHasStop(false)
                setStopText('')
                setStopCoord(null)
              }}
              style={{
                border: 'none',
                background: 'none',
                color: '#94a3b8',
                fontSize: '11px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              ✕ Remover
            </button>
          </div>
        )}

        {/* Ponto 3: Destino Final */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          paddingTop: '8px',
          borderTop: hasStop ? 'none' : '1px solid #f1f5f9'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
            <div style={{
              width: '13px',
              height: '13px',
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
                fontSize: '13.5px',
                fontWeight: '600',
                color: '#0f172a'
              }}
            />
          </div>
        </div>

        {/* Botão de Adicionar Parada */}
        {!hasStop && (
          <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid #f8fafc', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={() => {
                setHasStop(true)
                setActiveField('stop')
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#2563eb',
                fontSize: '11.5px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              + Adicionar Parada Intermediária
            </button>
          </div>
        )}
      </div>

      {/* Barra de Telemetria de Trajeto (Distância e Tempo) */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        padding: '9px 12px',
        marginBottom: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.03)'
      }}>
        <span style={{ fontSize: '13px' }}>📍</span>
        <span style={{ fontSize: '12px', fontWeight: '600', color: '#334155' }}>
          {isLoadingRoute ? (
            'Calculando trajeto...'
          ) : routeInfo ? (
            <>
              Percurso: <strong style={{ color: '#0f172a' }}>{routeInfo.distance}</strong> • Duração estimada: <strong style={{ color: '#0f172a' }}>{routeInfo.duration}</strong>
            </>
          ) : (
            'Percurso: calculando coordenadas...'
          )}
        </span>
      </div>

      {/* Resultados de Busca Rápida */}
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
            <span style={{ fontSize: '11px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>
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

      {
