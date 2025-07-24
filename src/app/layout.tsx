import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import '@/styles/globals.css'
import { Providers } from './providers'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: 'Match Marking System',
  description: 'Professional sports match management and tracking system',
  keywords: ['sports', 'match', 'management', 'badminton', 'tennis', 'tournament'],
  authors: [{ name: 'Match Marking Team' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="font-poppins">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
