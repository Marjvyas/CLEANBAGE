import type { Metadata, Viewport } from 'next'
import '@/app/globals.css'
import { Inter } from "next/font/google"
import { UserProvider } from '../context/UserContext'
import { ToasterProvider } from '../components/ToasterProvider'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: 'CLEANBAGE',
  description: 'CLEANBAGE: Smart Waste Management App', // Fixed viewport warning
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen animate-gradient-background overflow-x-hidden`}>
        <UserProvider>
          {children}
          <ToasterProvider />
        </UserProvider>
      </body>
    </html>
  )
}
