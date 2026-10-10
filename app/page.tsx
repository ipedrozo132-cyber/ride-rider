'use client'

import React, { useState } from 'react'
import { Navigation, ArrowRight, ShieldCheck, Zap } from 'lucide-react'

export default function RideRiderPOC() {
  const [destinationName, setDestinationName] = useState('Praça Afonso Pena')
  
  // Coordenadas aproximadas de teste em São José dos Campos (Vila Betânia -> Centro)
  const pickupLat = '-23.2055'
  const pickupLng = '-45.8841'
  const destLat = '-23.1896'
  const destLng = '-45.8841'

  // Chamada Uber (Já 100% validada)
  const handleUberClick = () => {
    const encodedName = encodeURIComponent(destinationName)
    const nativeUri = `uber://?action=setPickup&pickup=my_location&dropoff[latitude]=${destLat}&dropoff[longitude]=${destLng}&dropoff[nickname]=${encodedName}&dropoff[formatted_address]=${encodedName}`
    window.location.assign(nativeUri)
  }

  // Chamada 99 com os parâmetros oficiais obrigatórios de partida e destino
  const handle99Click = () => {
    const encodedDest = encodeURIComponent(destinationName)
    const encodedPickup = encodeURIComponent('Minha Localização')
    
    // A 99 exige o par completo: pickup + dropoff
    const native99Uri = `taxis99://call?pickup_latitude=${pickupLat}&pickup_longitude=${pickupLng}&pickup_title=${encodedPickup}&dropoff_latitude=${destLat}&dropoff_longitude=${destLng}&dropoff_title=${encodedDest}&deep_link_product_id=316`
    
    window.location.assign(native99Uri)
  }

  return (
    <main style={{
      minHeight: '100dvh',
      boxSizing: 'border-box',
      backgroundColor: '#0a0d14',
      color: '#f8fafc',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      maxWidth: '480px',
      margin: '0 auto'
    }}>
      <div>
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={22} color="#00E676" />
              <h1 style={{ fontSize: '20px', fontWeight: '800', letterSpacing: '-0.02em', margin: 0 }}>
                RIDE<span style={{ color: '#00E676' }}>RIDER</span>
              </h1>
            </div>
            <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0 0' }}>
              Comparador de Tarifas & Despacho Imediato
            </p>
          </div>
          <span style={{
            fontSize: '10px',
            backgroundColor: 'rgba(0, 230, 118, 0.1)',
            color: '#00E676',
            border: '1px solid rgba(0, 230, 118, 0.3)',
            padding: '3px 8px',
            borderRadius: '12px',
            fontWeight: '600'
          }}>
            POC v0.6
          </span>
        </header>

        {/* Bloco de Rota */}
        <div style={{
          backgroundColor: '#131823',
          border: '1px solid #1e293b',
          borderRadius: '14px',
          padding: '14px',
          marginBottom: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#00E676' }} />
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>Partida: <strong>Minha localização atual (GPS)</strong></span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Navigation size={14} color="#38bdf8" />
            <input
              type="text"
              value={destinationName}
              onChange={(e) => setDestinationName(e.target.value)}
              placeholder="Digite o destino..."
              style={{
                width: '100%',
                backgroundColor: '#0a0d14',
                border: '1px solid #334155',
                borderRadius: '8px',
                padding: '8px 10px',
                color: '#fff',
                fontSize: '13px',
                outline: 'none'
              }}
            />
          </div>
        </div>

        {/* Lista de Opções */}
        <h2 style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.05em', marginBottom: '10px' }}>
          Melhores Opções em Tempo Real
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Card 99 */}
          <div style={{
            backgroundColor: '#131823',
            border: '1px solid #22c55e',
            borderRadius: '14px',
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontWeight: '700', fontSize: '14px' }}>99 Pop</span>
                <span style={{
                  fontSize: '9px',
                  backgroundColor: 'rgba(34, 197, 94, 0.2)',
                  color: '#22c55e',
                  padding: '1px 5px',
                  borderRadius: '4px',
                  fontWeight: '700'
                }}>
                  MAIS BARATO
                </span>
              </div>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>Chegada estimada: 3-5 min</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '16px', fontWeight: '800', color: '#22c55e' }}>R$ 7,80</div>
              <button
                onClick={handle99Click}
                style={{
                  marginTop: '4px',
                  backgroundColor: '#22c55e',
                  color: '#000',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                Pedir 99 <ArrowRight size={12} />
              </button>
            </div>
          </div>

          {/* Card Uber */}
          <div style={{
            backgroundColor: '#131823',
            border: '1px solid #1e293b',
            borderRadius: '14px',
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontWeight: '700', fontSize: '14px' }}>UberX</span>
              </div>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>Chegada estimada: 2 min</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '16px', fontWeight: '800', color: '#f8fafc' }}>R$ 14,20</div>
              <button
                onClick={handleUberClick}
                style={{
                  marginTop: '4px',
                  backgroundColor: '#1e293b',
                  color: '#fff',
                  border: '1px solid #334155',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                Pedir Uber <ArrowRight size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <footer style={{
        marginTop: '20px',
        textAlign: 'center',
        borderTop: '1px solid #1e293b',
        paddingTop: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#64748b', fontSize: '11px', marginBottom: '6px' }}>
          <ShieldCheck size={13} color="#00E676" />
          <span>Deep Link Seguro • Sem intermediação financeira</span>
        </div>
        <p style={{
          fontSize: '9px',
          color: '#475569',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          margin: 0,
          fontWeight: '600'
        }}>
          © 2026 INFINITE INTELLIGENCE LABS • ALL RIGHTS RESERVED
        </p>
      </footer>
    </main>
  )
}
