import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { QuizProvider } from "@/components/context/QuizContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Live Quiz Game",
  description: "Real-time multiplayer quiz game with WebSocket support",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QuizProvider>{children}</QuizProvider>
      </body>
    </html>
  )
}
