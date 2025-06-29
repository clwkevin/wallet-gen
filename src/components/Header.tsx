import React from 'react'
import { Shield } from 'lucide-react'

export function Header() {
  return (
    <header className="text-center mb-10 animate-fade-in">
      <div className="flex items-center justify-center mb-6">
        <Shield className="w-12 h-12 text-blue-300 mr-4" />
        <h1 className="font-founders text-5xl md:text-6xl font-bold leading-tight tracking-tight">
          octra wallet generation
        </h1>
      </div>
      <p className="text-gray-40 text-lg max-w-2xl mx-auto">
        Generate secure Ed25519 wallets for the Octra blockchain with BIP39 mnemonic phrases and HD key derivation
      </p>
    </header>
  )
}