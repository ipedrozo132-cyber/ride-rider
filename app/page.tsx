'use client'

import React, { useState } from 'react'

// Logotipo B em curvas contínuas de pista estilizada
const BestRideBrand = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', marginBottom: '28px' }}>
    <svg width="56" height="56" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Traço contínuo em fita que desenha o B */}
      <path
        d="M20 12C20 12 36 12 40 18C44 24 38 29 32 30C42 31 46 37 42 45C38 52 24 52 20 52C16 52 14 49 14 45C14 40 18 36 28 36C38 36 40 31 36 28C32 25 20 25 20 25"
        stroke="#00A86B"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 12V52"
        stroke="#008B74"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
      <span style={{ fontSize: '26px', fontWeight: '900', color: '#044e42', letterSpacing: '-0.02em' }}>BEST</span>
      <span style={{ fontSize: '26px', fontWeight: '900', color: '#044e42', letterSpacing: '-0.02em', marginTop: '2px' }}>RIDE</span>
    </div>
  </div>
)

// Moeda de Titânio Infinite Intelligence Labs
const TitaniumCoin = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 'auto', paddingTop: '28px' }}>
    <div style={{
      width: '46px',
      height: '46px',
      borderRadius: '50%',
      background: 'radial-gradient(circle at 35% 35%, #f1f5f9 0%, #cbd5e1 45%, #64748b 85%, #334155 100%)',
      boxShadow: '0 4px 10px rgba(0,0,0,0.18), inset 0 2px 2px rgba(255,255,255,0.8), inset 0 -2px 3px rgba(0,0,0,0.4)',
      border: '1px solid #94a3b8',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '8px'
    }}>
      <span style={{
        fontSize: '18px',
        fontFamily: 'Georgia, serif',
        fontStyle: 'italic',
        fontWeight: 'bold',
        color: '#1e293b',
        textShadow: '0 1px 1px rgba(255,255,255,0.6)'
      }}>
        i<sup>∞</sup>
      </span>
    </div>
    <span style={{
      fontSize: '12px',
      fontWeight: '600',
      color: '#334155',
      letterSpacing: '0.02em'
    }}>
      Infinite Intelligence Labs
    </span>
  </div>
)

export default function BestRideApp() {
  const [pickupAddress, setPickupAddress] = useState('Minha localização atual (GPS)')
  const [destinationAddress, setDestinationAddress] = useState('Praça Afonso Pena')

  // Coordenadas padrão de teste (SJC: Vila Betânia -> Centro)
  const pickupLat = '-23.2055'
  const pickupLng = '-45.8841'
  const destLat = '-23.1896'
  const destLng = '-45.8841'

  const handleUberClick = () => {
    const encodedDest = encodeURIComponent(destinationAddress)
    const nativeUri = `uber://?action=setPickup&pickup=my_location&dropoff[latitude]=${destLat}&dropoff[longitude]=${destLng}&dropoff[nickname]=${encodedDest}&dropoff[formatted_address]=${encodedDest}`
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

      {/* Trajeto com Linha Tracejada Contínua */}
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
          borderLeft: '2px dashed #94a3b8'
        }} />

        {/* Ponto de Partida */}
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
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: '14px',
              fontWeight: '500',
              color: '#1e293b'
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
            padding: '16px 12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'transform 0.1s ease',
            outline: 'none'
          }}
        >
          {/* Logo 99 Amarelo */}
          <div style={{
            width: '42px',
            height: '32px',
            backgroundColor: '#ffc107',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.08)'
          }}>
            <span style={{ fontSize: '18px', fontWeight: '900', color: '#000', letterSpacing: '-0.05em' }}>99</span>
          </div>
          <span style={{ fontSize: '13px', fontWeight: '700', color: '#334155' }}>
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
            padding: '16px 12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'transform 0.1s ease',
            outline: 'none'
          }}
        >
          <span style={{ fontSize: '19px', fontWeight: '800', color: '#000000', height: '32px', display: 'flex', alignItems: 'center' }}>
            UberX
          </span>
          <span style={{ fontSize: '13px', fontWeight: '700', color: '#334155' }}>
            (R$ 14,20)
          </span>
        </button>
      </div>

      {/* Assinatura com Moeda de Titânio */}
      <TitaniumCoin />
    </main>
  )
}
