import React from 'react'

interface WalletFieldProps {
  label: string
  children: React.ReactNode
}

export function WalletField({ label, children }: WalletFieldProps) {
  return (
    <div className="wallet-field">
      <div className="field-label text-gray-30">
        {label}
      </div>
      <div className="flex-1">
        {children}
      </div>
    </div>
  )
}