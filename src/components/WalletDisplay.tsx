import React from 'react'
import { WalletData } from '../types/wallet'
import { WalletField } from './WalletField'
import { HDDerivation } from './HDDerivation'
import { CopyButton } from './CopyButton'

interface WalletDisplayProps {
  wallet: WalletData
}

export function WalletDisplay({ wallet }: WalletDisplayProps) {
  return (
    <div className="space-y-6">
      <WalletField label="Mnemonic (12 words)">
        <div className="flex items-center gap-2">
          <span className="field-value">{wallet.mnemonic.join(' ')}</span>
          <CopyButton text={wallet.mnemonic.join(' ')} />
        </div>
      </WalletField>

      <WalletField label="Private Key">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-40 w-12">Raw:</span>
            <span className="field-value flex-1">{wallet.private_key_hex}</span>
            <CopyButton text={wallet.private_key_hex} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-40 w-12">B64:</span>
            <span className="field-value flex-1">{wallet.private_key_b64}</span>
            <CopyButton text={wallet.private_key_b64} />
          </div>
        </div>
      </WalletField>

      <WalletField label="Public Key">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-40 w-12">Raw:</span>
            <span className="field-value flex-1">{wallet.public_key_hex}</span>
            <CopyButton text={wallet.public_key_hex} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-40 w-12">B64:</span>
            <span className="field-value flex-1">{wallet.public_key_b64}</span>
            <CopyButton text={wallet.public_key_b64} />
          </div>
        </div>
      </WalletField>

      <WalletField label="Octra Address">
        <div className="flex items-center gap-2">
          <span className="field-value text-blue-300 font-semibold">{wallet.address}</span>
          <CopyButton text={wallet.address} />
        </div>
      </WalletField>

      <WalletField label="Technical Information">
        <div className="space-y-2">
          <div>
            <span className="text-xs text-gray-40">Entropy:</span>
            <span className="field-value ml-2">{wallet.entropy_hex}</span>
          </div>
          <div>
            <span className="text-xs text-gray-40">Seed:</span>
            <span className="field-value ml-2">{wallet.seed_hex.substring(0, 64)}...</span>
          </div>
          <div>
            <span className="text-xs text-gray-40">Master Chain:</span>
            <span className="field-value ml-2">{wallet.master_chain_hex}</span>
          </div>
        </div>
      </WalletField>

      <WalletField label="Signature Test">
        <div className="space-y-2">
          <div>
            <span className="text-xs text-gray-40">Message:</span>
            <span className="field-value ml-2">{wallet.test_message}</span>
          </div>
          <div>
            <span className="text-xs text-gray-40">Signature:</span>
            <span className="field-value ml-2">{wallet.test_signature}</span>
          </div>
          <div>
            <span className="text-xs text-gray-40">Validation:</span>
            <span className={`ml-2 font-semibold ${wallet.signature_valid ? 'text-green-400' : 'text-red-400'}`}>
              {wallet.signature_valid ? 'VALID' : 'INVALID'}
            </span>
          </div>
        </div>
      </WalletField>

      <HDDerivation wallet={wallet} />
    </div>
  )
}