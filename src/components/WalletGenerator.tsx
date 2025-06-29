import React, { useState } from 'react'
import { StatusDisplay } from './StatusDisplay'
import { WalletDisplay } from './WalletDisplay'
import { GenerateButton } from './GenerateButton'
import { SecurityWarning } from './SecurityWarning'
import { WalletData } from '../types/wallet'

export function WalletGenerator() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [status, setStatus] = useState('Ready to generate wallet...')
  const [wallet, setWallet] = useState<WalletData | null>(null)

  const generateWallet = async () => {
    setIsGenerating(true)
    setStatus('')
    setWallet(null)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST'
      })

      if (!response.body) {
        throw new Error('No response body')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.substring(6))
              
              if (data.status) {
                setStatus(prev => prev + data.status + '\n')
              }
              
              if (data.wallet) {
                setWallet(data.wallet)
              }
            } catch (e) {
              console.warn('Failed to parse SSE data:', e)
            }
          }
        }
      }
    } catch (error) {
      setStatus(prev => prev + 'ERROR: ' + (error as Error).message + '\n')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-8 animate-slide-up">
      <div className="bg-gray-70 rounded-lg p-8 shadow-2xl border border-gray-60">
        <StatusDisplay status={status} />
        <GenerateButton 
          onGenerate={generateWallet} 
          isGenerating={isGenerating} 
        />
      </div>

      {wallet && (
        <div className="bg-gray-70 rounded-lg p-8 shadow-2xl border border-gray-60 animate-fade-in">
          <h2 className="font-founders text-3xl font-bold mb-6 text-blue-300">
            Your Wallet
          </h2>
          <SecurityWarning />
          <WalletDisplay wallet={wallet} />
        </div>
      )}
    </div>
  )
}