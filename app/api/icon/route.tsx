import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #3b82f6 100%)',
          borderRadius: '22%'
        }}
      >
        <span style={{ fontSize: 260 }}>⚡</span>
      </div>
    ),
    {
      width: 512,
      height: 512
    }
  )
}
