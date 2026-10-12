import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SmartRide',
  description: 'Comparador de tarifas de transporte em tempo real',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body style={{ margin: 0, padding: 0, boxSizing: 'border-box' }}>
        {children}
      </body>
    </html>
  )
}
