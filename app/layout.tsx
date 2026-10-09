import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: 'RideRider - Comparador de Tarifas',
  description: 'Comparador de mobilidade urbana em tempo real e despacho direto via deep link.',
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  themeColor: '#0a0d14',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt">
      <body style={{ margin: 0, padding: 0, backgroundColor: '#0a0d14' }}>
        {children}
      </body>
    </html>
  )
}
