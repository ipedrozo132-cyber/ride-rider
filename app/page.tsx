'use client'

import React, { useState, useEffect } from 'react'

// Logótipo "S" Cifrão / Seta 3D com Presença Marcante
const SmartRideBrand = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '24px' }}>
    <svg width="64" height="64" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 6px 14px rgba(0, 168, 107, 0.25))' }}>
      <defs>
        {/* Gradiente da Haste / Seta de Economia */}
        <linearGradient id="arrowStem" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00E676" />
          <stop offset="60%" stopColor="#00A86B" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>

        {/* Gradiente das Fitas do "S" */}
        <linearGradient id="sTopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>

        <linearGradient id="sMidGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="50%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>

        <linearGradient id="sBotGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#0f766e" />
        </linearGradient>
      </defs>

      {/* 1. HASTE VERTICAL CENTRAL (Tronco da Seta / Cifrão) */}
      <rect x="32" y="8" width="8" height="42" rx="4" fill="url(#arrowStem)" />

      {/* 2. CURVA SUPERIOR DO "S" (Passa atrás da haste) */}
      <path
        d="M52 20C52 11 40 8 32 8C22 8 16 13 16 22C16 30 26 33 34 35"
        stroke="url(#sTopGrad)"
        strokeWidth="9"
        strokeLinecap="round"
      />

      {/* 3. CURVA DIAGONAL CENTRAL DO "S" (Passa NA FRENTE da haste, criando o entrelaçamento) */}
      <path
        d="M26 30C34 32 46 36 46 44C46 53 38 57 28 57C22 57 16 54 16 48"
        stroke="url(#sMidGrad)"
        strokeWidth="9"
        strokeLinecap="round"
        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.18))' }}
      />

      {/* 4. PONTA ROBUSTA DA SETA DESCENDENTE (Economia / Cifrão bem visível) */}
      <path
        d="M23 44L36 62L49 44H39V40H33V44H23Z"
        fill="url(#arrowStem)"
        stroke="#ffffff"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>

    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
      <span style={{ fontSize: '27px', fontWeight: '950', color: '#044e42', letterSpacing: '-0.02em' }}>SMART</span>
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

const DEFAULT_SAVED_PLACES = [
  'Faculdade Ellen',
  'Praça Afonso Pena',
  'Avenida José Longo',
  'Casa',
  'CenterVale Shopping'
]

export default function SmartRideApp() {
  const [isUsingGps, setIsUsingGps] = useState(true)
  const [manualPickup, setManualPickup] = useState('')
  const [stops, setStops] = useState<string[]>([])
  const [destinationAddress, setDestinationAddress] = useState('Praça Afonso Pena')

  const [savedPlaces, setSavedPlaces] = useState<string[]>(DEFAULT_SAVED_PLACES)
  const [activeField, setActiveField] = useState<'pickup' | 'destination' | number | null>(null)

  const [isComparing, setIsComparing] = useState(false)
  const [hasCompared, setHasCompared] = useState(false)
  const [price99, setPrice99] = useState<string | null>(null)
  const [priceUber, setPriceUber] = useState<string | null>(null)
  const [tripTelemetry, setTripTelemetry] = useState<{ distance: string; time: string } | null>(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('smart_ride_saved_places')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSavedPlaces(parsed)
        }
      }
    } catch {}
  }, [])

  const savePlaceToHistory = (place: string) => {
    const trimmed = place.trim()
    if (!trimmed || trimmed === 'Minha localização atual (GPS)') return
    setSavedPlaces(prev => {
      const updated = [trimmed, ...prev.filter(p => p.toLowerCase() !== trimmed.toLowerCase())].slice(0, 7)
      try {
        localStorage.setItem('smart_ride_saved_places', JSON.stringify(updated))
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
    const native99Uri = `taxis99://call?pickup_latitude=-23.2055&pickup_longitude=-45.8841&pickup_title=${pickupTitle}&dropoff_latitude=-23.1896&dropoff_longitude=-45.8841
