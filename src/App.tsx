import React from 'react'
import { WalletGenerator } from './components/WalletGenerator'
import { Header } from './components/Header'

function App() {
  return (
    <div className="min-h-screen bg-gray-80 text-white">
      <div className="container mx-auto max-w-4xl px-5 py-5">
        <Header />
        <WalletGenerator />
      </div>
    </div>
  )
}

export default App