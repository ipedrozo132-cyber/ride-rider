'use client'

import React, { useState } from 'react'

// Logotipo Proprietário B do Best Ride
const BestRideBrand = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '28px' }}>
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 168, 107, 0.15))' }}>
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
      <span style={{ fontSize: '28px', fontWeight: '950', color: '#044e42', letterSpacing: '-0.03em' }}>BEST</span>
      <span style={{ fontSize: '28px', fontWeight: '950', color: '#00A86B', letterSpacing: '-0.03em', marginTop: '3px' }}>RIDE</span>
    </div>
  </div>
)

// Moeda de Titânio i^∞ Ampliada
const TitaniumCoin = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 'auto', paddingTop: '32px' }}>
    <div style={{
      width: '58px',
      height: '58px',
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
        fontSize: '25px',
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

export default function BestRideApp() {
  const [pickupAddress, setPickupAddress] = useState('Minha localização atual (GPS)')
  const [destinationAddress, setDestinationAddress] = useState('Praça Afonso Pena')

  // Coordenadas padrão de apoio
  const pickupLat = '-23.2055'
  const pickupLng = '-45.8841'
  const destLat = '-23.1896'
  const destLng = '-45.8841'

  // Verifica se o usuário manteve o GPS ou digitou outro local
  const isGpsDefault = pickupAddress.includes('(GPS)') || pickupAddress.trim().toLowerCase() === 'minha localização atual'

  const handleUberClick = () => {
    const encodedDest = encodeURIComponent(destinationAddress)
    const encodedPickup = encodeURIComponent(pickupAddress)

    // Se for GPS, usa my_location; se digitou outro endereço, passa o endereço digitado
    const pickupParam = isGpsDefault
      ? 'pickup=my_location'
      : `pickup[formatted_address]=${encodedPickup}&pickup[nickname]=${encodedPickup}`

    const nativeUri = `uber://?action=setPickup&${pickupParam}&dropoff[latitude]=${destLat}&dropoff[longitude]=${destLng}&dropoff[nickname]=${encodedDest}&dropoff[formatted_address]=${encodedDest}`
    window.location.assign(nativeUri)
  }

  const handle99Click = () => {
    const encodedDest = encodeURIComponent(destinationAddress)
    const encodedPickup = encodeURIComponent(pickupAddress)
    const native99Uri = `taxis99://call?pickup_latitude=${pickupLat}&pickup_longitude=${pickupLng}&pickup_title=${encodedPickup}&dropoff_latitude=${destLat}&dropoff_longitude=${destLng}&dropoff_title=${encodedDest}&deep_link_product_id=316`
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
      margin: '0 auto'
    }}>
      {/* Logotipo Superior */}
      <BestRideBrand />

      {/* Trajeto com Linha Tracejada */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        padding: '16px 14px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        marginBottom: '22px',
        position: 'relative'
      }}>
        {/* Linha vertical conectando os pontos */}
        <div style={{
          position: 'absolute',
          left: '26px',
          top: '32px',
          bottom: '32px',
          width: '2px',
          borderLeft: '2.5px dashed #cbd5e1'
        }} />

        {/* Ponto de Partida Flexível */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px', position: 'relative' }}>
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: '#10b981',
            boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.2)',
            flexShrink: 0
          }} />
          <input
            type="text"
            value={pickupAddress}
            onChange={(e) => setPickupAddress(e.target.value)}
            onFocus={() => {
              if (isGpsDefault) setPickupAddress('')
            }}
            placeholder="Digite o local de partida (ex: Faculdade)"
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: '14px',
              fontWeight: '550',
              color: '#334155'
            }}
          />
        </div>

        {/* Divisória sutil */}
        <div style={{ height: '1px', backgroundColor: '#f1f5f9', marginLeft: '26px', marginBottom: '14px' }} />

        {/* Destino */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', position: 'relative' }}>
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: '#ef4444',
            boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.2)',
            flexShrink: 0
          }} />
          <input
            type="text"
            value={destinationAddress}
            onChange={(e) => setDestinationAddress(e.target.value)}
            placeholder="Para onde vamos?"
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

      {/* Cards Lado a Lado (99 e Uber) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
        {/* Card 99 */}
        <button
          onClick={handle99Click}
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '18px 12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            transition: 'transform 0.1s ease',
            outline: 'none'
          }}
        >
          <div style={{
            width: '44px',
            height: '34px',
            backgroundColor: '#ffc107',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.08)'
          }}>
            <span style={{ fontSize: '19px', fontWeight: '950', color: '#000', letterSpacing: '-0.05em' }}>99</span>
          </div>
          <span style={{ fontSize: '13.5px', fontWeight: '750', color: '#334155' }}>
            (R$ 7,80)
          </span>
        </button>

        {/* Card UberX */}
        <button
          onClick={handleUberClick}
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '18px 12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            transition: 'transform 0.1s ease',
            outline: 'none'
          }}
        >
          <span style={{ fontSize: '20px', fontWeight: '850', color: '#000000', height: '34px', display: 'flex', alignItems: 'center' }}>
            UberX
          </span>
          <span style={{ fontSize: '13.5px', fontWeight: '750', color: '#334155' }}>
            (R$ 14,20)
          </span>
        </button>
      </div>

      {/* Assinatura com Moeda de Titânio */}
      <TitaniumCoin />
    </main>
  )
}
