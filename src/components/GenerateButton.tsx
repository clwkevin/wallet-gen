import React from 'react'
import { Wallet, Loader2 } from 'lucide-react'

interface GenerateButtonProps {
  onGenerate: () => void
  isGenerating: boolean
}

export function GenerateButton({ onGenerate, isGenerating }: GenerateButtonProps) {
  return (
    <div className="text-center">
      <button
        onClick={onGenerate}
        disabled={isGenerating}
        className="btn btn-large btn-full group relative overflow-hidden"
      >
        <div className="flex items-center justify-center">
          {isGenerating ? (
            <Loader2 className="w-6 h-6 mr-3 animate-spin" />
          ) : (
            <Wallet className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
          )}
          {isGenerating ? 'Generating Wallet...' : 'Generate New Wallet'}
        </div>
        
        {/* Hover effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-200 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
      </button>
    </div>
  )
}