import type React from "react"
import { Geist } from "next/font/google"
import { Playfair_Display } from "next/font/google"
import "./globals.css"

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
})

export const metadata = {
  title: "Museu Domingos Rebelo",
  description: "História da Escola Secundária Domingos Rebelo",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt" className={`${geistSans.variable} ${playfair.variable} antialiased`}>
      <body>{children}</body>
    </html>
  )
}
