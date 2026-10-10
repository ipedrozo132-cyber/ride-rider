'use client'

import React, { useState } from 'react'
import { ArrowRight, ShieldCheck, MapPin, Edit3 } from 'lucide-react'

// Logotipo Proprietário: Letra "B" estilizada com curvas de rota em verde esmeralda
const BestRideLogo = ({ size = 28 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ filter: 'drop-shadow(0 0 8px rgba(0, 230, 118, 0.35))' }}
  >
    {/* Contêiner com efeito de vidro fosco */}
    <rect width="32" height="32" rx="9" fill="#131823" stroke="#1e293b" strokeWidth="1" />
    {/* Haste esquerda / Ponto de partida */}
    <path
      d="M9 7.5V24.5"
      stroke="#00E676"
      strokeWidth="3.2"
      strokeLinecap="round"
    />
    {/* Curva superior de rota */}
    <path
      d="M9 8.5H16C19.3 8.5 22 11.2 22 14.5C22 16 20.8 17.5 19 18"
      stroke="#00E676"
      strokeWidth="2.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Curva inferior de rota acelerada */}
    <path
      d="M9 16.5H17C20.5 16.5 23.5 19.5 23.5 23C23.5 24 22.5 24.5 21 24.5H9"
      stroke="#00E676"
      strokeWidth="2.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Ponto de destino final em ciano */}
    <circle cx="21" cy="24.5" r="1.5" fill="#38bdf8" />
  </svg>
)

export default function BestRideApp() {
  const [useGps, setUseGps] = useState(true)
  const [pickupAddress, setPickupAddress] = useState('Minha localização atual')
  const [destinationAddress, setDestinationAddress] = useState('Praça Afonso Pena')

  // Coordenadas padrão de teste (SJC: Vila Betânia -> Centro)
  const pickupLat = '-23.2055'
  const pickupLng = '-45.8841'
  const destLat = '-23.1896'
  const destLng = '-45.8841'

  const handleUberClick = () => {
    const encodedDest = encodeURIComponent(destinationAddress)
    const encodedPickup = encodeURIComponent(pickupAddress)

    const pickupParam = useGps 
      ? 'pickup=my_location' 
      : `pickup[latitude]=${pickupLat}&pickup[longitude]=${pickupLng}&pickup[formatted_address]=${encodedPickup}`

    const nativeUri = `uber://?action=setPickup&${pickupParam}&dropoff[latitude]=${destLat}&dropoff[longitude]=${destLng}&dropoff[nickname]=${encodedDest}&dropoff[formatted_address]=${encodedDest}`
    window.location.assign(nativeUri)
  }

  const handle99Click = () => {
    const encodedDest = encodeURIComponent(destinationAddress)
    const encodedPickup = encodeURIComponent(useGps ? 'Minha Localização' : pickupAddress)

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
        {/* Cabeçalho Oficial com Logo B Proprietário */}
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <BestRideLogo size={32} />
              <h1 style={{ fontSize: '21px', fontWeight: '900', letterSpacing: '0.02em', margin: 0 }}>
                BEST <span style={{ color: '#00E676' }}>RIDE</span>
              </h1>
            </div>
            <p style={{ fontSize: '11px', color: '#64748b', margin: '3px 0 0 0' }}>
              Comparador Inteligente & Despacho Imediato
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
            v1.0 Ready
          </span>
        </header>

        {/* Bloco de Rotas */}
        <div style={{
          backgroundColor: '#131823',
          border: '1px solid #1e293b',
          borderRadius: '16px',
          padding: '14px',
          marginBottom: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Ponto de Partida
              </span>
              <button
                onClick={() => {
                  setUseGps(!useGps)
                  if (useGps) setPickupAddress('Vila Betânia')
                  else setPickupAddress('Minha localização atual')
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#38bdf8',
                  fontSize: '11px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: 0
                }}
              >
                <Edit3 size={11} />
                {useGps ? 'Digitar endereço' : 'Usar meu GPS'}
              </button>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#0a0d14',
              border: '1px solid #334155',
              borderRadius: '8px',
              padding: '8px 10px'
            }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: useGps ? '#00E676' : '#38bdf8' }} />
              {useGps ? (
                <span style={{ fontSize: '13px', color: '#fff', fontWeight: '500' }}>
                  Minha localização atual (GPS)
                </span>
              ) : (
                <input
                  type="text"
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  placeholder="Endereço de partida..."
                  style={{
                    width: '100%',
                    background: 'none',
                    border: 'none',
                    color: '#fff',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                />
              )}
            </div>
          </div>

          <div>
            <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '6px' }}>
              Destino
            </span>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#0a0d14',
              border: '1px solid #334155',
              borderRadius: '8px',
              padding: '8px 10px'
            }}>
              <MapPin size={14} color="#f43f5e" />
              <input
                type="text"
                value={destinationAddress}
                onChange={(e) => setDestinationAddress(e.target.value)}
                placeholder="Para onde vamos?"
                style={{
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  color: '#fff',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
            </div>
          </div>
        </div>

        {/* Melhores Opções */}
        <h2 style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.05em', marginBottom: '10px' }}>
          Melhores Opções de Corrida
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Card 99 Pop */}
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

          {/* Card UberX */}
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

      {/* Assinatura Infinite Intelligence Labs */}
      <footer style={{
        marginTop: '24px',
        textAlign: 'center',
        borderTop: '1px solid #1e293b',
        paddingTop: '14px'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
          border: '1px solid #334155',
          boxShadow: '0 1px 3px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
          padding: '4px 10px',
          borderRadius: '20px',
          marginBottom: '8px'
        }}>
          <span style={{
            fontSize: '12px',
            fontFamily: 'Georgia, serif',
            fontStyle: 'italic',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #f1f5f9 0%, #94a3b8 50%, #cbd5e1 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '0.05em'
          }}>
            i<sup>∞</sup>
          </span>
          <span style={{
            fontSize: '10px',
            fontWeight: '700',
            letterSpacing: '0.06em',
            background: 'linear-gradient(135deg, #f8fafc 0%, #cbd5e1 50%, #94a3b8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textTransform: 'uppercase'
          }}>
            Infinite Intelligence Labs
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: '#64748b', fontSize: '10px', marginBottom: '4px' }}>
          <ShieldCheck size={12} color="#00E676" />
          <span>Protocolo Nativo Direto • Sem taxas intermediárias</span>
        </div>

        <p style={{
          fontSize: '9px',
          color: '#475569',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          margin: 0,
          fontWeight: '600'
        }}>
          © 2026 BEST RIDE • ALL RIGHTS RESERVED
        </p>
      </footer>
    </main>
  )
}
