import { writeFileSync } from 'fs'

interface WalletData {
  mnemonic: string[]
  seed_hex: string
  master_chain_hex: string
  private_key_hex: string
  public_key_hex: string
  private_key_b64: string
  public_key_b64: string
  address: string
  entropy_hex: string
  test_message: string
  test_signature: string
  signature_valid: boolean
}

export async function saveWalletToFile(data: WalletData): Promise<{ filename: string; content: string }> {
  const timestamp = Math.floor(Date.now() / 1000)
  const filename = `octra_wallet_${data.address.slice(-8)}_${timestamp}.txt`

  const content = `OCTRA WALLET
${'='.repeat(50)}

SECURITY WARNING: KEEP THIS FILE SECURE AND NEVER SHARE YOUR PRIVATE KEY

Generated: ${new Date().toISOString().replace('T', ' ').slice(0, 19)}
Address Format: oct + Base58(SHA256(pubkey))

Mnemonic: ${data.mnemonic.join(' ')}
Private Key (B64): ${data.private_key_b64}
Public Key (B64): ${data.public_key_b64}
Address: ${data.address}

Technical Details:
Entropy: ${data.entropy_hex}
Signature Algorithm: Ed25519
Derivation: BIP39-compatible (PBKDF2-HMAC-SHA512, 2048 iterations)
`

  writeFileSync(filename, content)

  return {
    filename,
    content
  }
}