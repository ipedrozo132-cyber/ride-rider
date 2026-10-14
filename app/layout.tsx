import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: 'Make Easy',
  description: 'Cotação rápida e facilitada de rotas para Uber e 99',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Make Easy'
  },
  icons: {
    icon: '/api/icon',
    apple: '/api/icon'
  }
}

export const viewport: Viewport = {
  themeColor: '#2563eb',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Make Easy" />
        <link rel="apple-touch-icon" href="/api/icon" />
      </head>
      <body style={{ margin: 0, padding: 0, backgroundColor: '#f8fafc' }}>
        {children}
      </body>
    </html>
  )
}
