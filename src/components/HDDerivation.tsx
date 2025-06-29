import React, { useState } from 'react'
import { WalletData } from '../types/wallet'
import { WalletField } from './WalletField'
import { CopyButton } from './CopyButton'
import { ArrowRight } from 'lucide-react'

interface HDDerivationProps {
  wallet: WalletData
}

interface DerivedResult {
  address: string
  path: string
  network_type_name: string
}

export function HDDerivation({ wallet }: HDDerivationProps) {
  const [networkType, setNetworkType] = useState(0)
  const [index, setIndex] = useState(0)
  const [derivedResult, setDerivedResult] = useState<DerivedResult | null>(null)
  const [isDerivingPath, setIsDerivingPath] = useState(false)

  const networkTypes = [
    { value: 0, label: 'MainCoin' },
    { value: 1, label: 'SubCoin' },
    { value: 2, label: 'Contract' },
    { value: 3, label: 'Subnet' },
    { value: 4, label: 'Account' },
  ]

  const derivePath = async () => {
    setIsDerivingPath(true)
    try {
      const response = await fetch('/api/derive', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          seed_hex: wallet.seed_hex,
          network_type: networkType,
          index: index
        })
      })

      const result = await response.json()
      if (result.success) {
        setDerivedResult(result)
      } else {
        alert('Derivation failed: ' + result.error)
      }
    } catch (error) {
      alert('Error: ' + (error as Error).message)
    } finally {
      setIsDerivingPath(false)
    }
  }

  return (
    <WalletField label="HD Derivation">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-40">Network Type:</label>
            <select
              value={networkType}
              onChange={(e) => setNetworkType(parseInt(e.target.value))}
              className="form-select"
            >
              {networkTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-40">Index:</label>
            <input
              type="number"
              value={index}
              onChange={(e) => setIndex(parseInt(e.target.value) || 0)}
              min="0"
              max="100"
              className="form-input w-20"
            />
          </div>

          <button
            onClick={derivePath}
            disabled={isDerivingPath}
            className="btn px-3 py-1.5 text-sm min-h-9 group"
          >
            {isDerivingPath ? (
              'Deriving...'
            ) : (
              <>
                Derive
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </button>
        </div>

        {derivedResult && (
          <div className="bg-gray-60 rounded-lg p-4 space-y-3 animate-fade-in">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-40">Derived Address:</span>
              <span className="field-value text-blue-300 font-semibold flex-1">
                {derivedResult.address}
              </span>
              <CopyButton text={derivedResult.address} />
            </div>
            <div>
              <span className="text-sm text-gray-40">Path:</span>
              <span className="field-value ml-2">{derivedResult.path}</span>
            </div>
            <div>
              <span className="text-sm text-gray-40">Network:</span>
              <span className="ml-2 text-sm">{derivedResult.network_type_name}</span>
            </div>
          </div>
        )}
      </div>
    </WalletField>
  )
}