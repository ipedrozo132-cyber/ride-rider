'use client'

import React, { useState } from 'react'
import { Navigation, ArrowRight, ShieldCheck, Zap } from 'lucide-react'

export default function RideRiderPOC() {
  const [destinationName, setDestinationName] = useState('Praça Afonso Pena')
  const destLat = '-23.1896'
  const destLng = '-45.8841'

  // Universal Link Uber (abre direto o app oficial ou cai na tela com destino preenchido)
  const uberHref = `https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[latitude]=${destLat}&dropoff[longitude]=${destLng}&dropoff[nickname]=${encodeURIComponent(destinationName)}`

  // Universal / Intent Link 99 para Android e iOS
  const didiHref = `https://page.didiglobal.com/passenger/index.html?dest_lat=${destLat}&dest_lng=${destLng}&dest_name=${encodeURIComponent(destinationName)}`

  return (
    <main style={{
      minHeight: '100vh',
      backgroundColor: '#0a0d14',
      color: '#f8fafc',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '24px 16px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      maxWidth: '480px',
      margin: '0 auto'
    }}>
      {/* Cabeçalho */}
      <div>
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={22} color="#00E676" />
              <h1 style={{ fontSize: '20px', fontWeight: '800', letterSpacing: '-0.02em', margin: 0 }}>
                RIDE<span style={{ color: '#00E676' }}>RIDER</span>
              </h1>
            </div>
            <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}>
              Comparador de Tarifas & Despacho Imediato
            </p>
          </div>
          <span style={{
            fontSize: '10px',
            backgroundColor: 'rgba(0, 230, 118, 0.1)',
            color: '#00E676',
            border: '1px solid rgba(0, 230, 118, 0.3)',
            padding: '4px 8px',
            borderRadius: '12px',
            fontWeight: '600'
          }}>
            POC v0.2
          </span>
        </header>

        {/* Bloco de Rota */}
        <div style={{
          backgroundColor: '#131823',
          border: '1px solid #1e293b',
          borderRadius: '16px',
          padding: '16px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#00E676' }} />
            <span style={{ fontSize: '13px', color: '#94a3b8' }}>Partida: <strong>Minha localização atual (GPS)</strong></span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
                padding: '8px 12px',
                color: '#fff',
                fontSize: '13px',
                outline: 'none'
              }}
            />
          </div>
        </div>

        {/* Comparador de Preços */}
        <h2 style={{ fontSize: '13px', textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.05em', marginBottom: '12px' }}>
          Melhores Opções em Tempo Real
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Card 99 */}
          <div style={{
            backgroundColor: '#131823',
            border: '1px solid #22c55e',
            borderRadius: '16px',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontWeight: '700', fontSize: '15px' }}>99 Pop</span>
                <span style={{
                  fontSize: '9px',
                  backgroundColor: 'rgba(34, 197, 94, 0.2)',
                  color: '#22c55e',
                  padding: '2px 6px',
                  borderRadius: '6px',
                  fontWeight: '700'
                }}>
                  MAIS BARATO
                </span>
              </div>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>Chegada estimada: 3-5 min</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#22c55e' }}>R$ 7,80</div>
              <a
                href={didiHref}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  marginTop: '6px',
                  backgroundColor: '#22c55e',
                  color: '#000',
                  borderRadius: '8px',
                  padding: '8px 14px',
                  fontSize: '12px',
                  fontWeight: '700',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                Pedir 99 <ArrowRight size={12} />
              </a>
            </div>
          </div>

          {/* Card Uber */}
          <div style={{
            backgroundColor: '#131823',
            border: '1px solid #1e293b',
            borderRadius: '16px',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontWeight: '700', fontSize: '15px' }}>UberX</span>
              </div>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>Chegada estimada: 2 min</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#f8fafc' }}>R$ 14,20</div>
              <a
                href={uberHref}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  marginTop: '6px',
                  backgroundColor: '#1e293b',
                  color: '#fff',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  padding: '8px 14px',
                  fontSize: '12px',
                  fontWeight: '700',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                Pedir Uber <ArrowRight size={12} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Rodapé com Assinatura Oficial */}
      <footer style={{
        marginTop: '36px',
        textAlign: 'center',
        borderTop: '1px solid #1e293b',
        paddingTop: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#64748b', fontSize: '11px', marginBottom: '8px' }}>
          <ShieldCheck size={14} color="#00E676" />
          <span>Deep Link Seguro • Sem intermediação financeira</span>
        </div>
        <p style={{
          fontSize: '10px',
          color: '#475569',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          margin: 0,
          fontWeight: '600'
        }}>
          © 2026 Infinite Intelligence Labs • All Rights Reserved
        </p>
      </footer>
    </main>
  )
}
