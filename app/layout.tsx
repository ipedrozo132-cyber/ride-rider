import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SmartRide | Mobilidade Inteligente',
  description: 'Compare tarifas 99 e UberX em tempo real com economia inteligente.',
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body style={{ margin: 0, padding: 0, backgroundColor: '#f8fafc' }}>
        {children}
      </body>
    </html>
  )
}
