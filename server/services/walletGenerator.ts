import { randomBytes, createHmac, createHash } from 'crypto'
import { generateMnemonic, mnemonicToSeedSync, entropyToMnemonic } from 'bip39'
import { sign } from 'tweetnacl'

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

const BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function bufferToHex(buffer: Buffer | Uint8Array): string {
  return Buffer.from(buffer).toString('hex')
}

function base64Encode(buffer: Buffer | Uint8Array): string {
  return Buffer.from(buffer).toString('base64')
}

function base58Encode(buffer: Buffer): string {
  if (buffer.length === 0) return ''

  let num = BigInt('0x' + buffer.toString('hex'))
  let encoded = ''

  while (num > 0n) {
    const remainder = num % 58n
    num = num / 58n
    encoded = BASE58_ALPHABET[Number(remainder)] + encoded
  }

  // Handle leading zeros
  for (let i = 0; i < buffer.length && buffer[i] === 0; i++) {
    encoded = '1' + encoded
  }

  return encoded
}

function generateEntropy(strength: number = 128): Buffer {
  if (![128, 160, 192, 224, 256].includes(strength)) {
    throw new Error('Strength must be 128, 160, 192, 224 or 256 bits')
  }
  return randomBytes(strength / 8)
}

function deriveMasterKey(seed: Buffer): { masterPrivateKey: Buffer; masterChainCode: Buffer } {
  const key = Buffer.from('Octra seed', 'utf8')
  const mac = createHmac('sha512', key).update(seed).digest()

  const masterPrivateKey = mac.slice(0, 32)
  const masterChainCode = mac.slice(32, 64)

  return { masterPrivateKey, masterChainCode }
}

function createOctraAddress(publicKey: Buffer): string {
  const hash = createHash('sha256').update(publicKey).digest()
  const base58Hash = base58Encode(hash)
  return 'oct' + base58Hash
}

function verifyAddressFormat(address: string): boolean {
  if (!address.startsWith('oct')) return false
  if (address.length !== 47) return false

  const base58Part = address.slice(3)
  for (const char of base58Part) {
    if (!BASE58_ALPHABET.includes(char)) return false
  }

  return true
}

export async function generateWallet(
  onProgress: (status: string, wallet?: WalletData) => void
): Promise<void> {
  onProgress('Generating entropy...')
  await sleep(200)

  const entropy = generateEntropy(128)
  onProgress('Entropy generated')
  await sleep(200)

  onProgress('Creating mnemonic phrase...')
  await sleep(200)

  const mnemonic = entropyToMnemonic(entropy.toString('hex'))
  const mnemonicWords = mnemonic.split(' ')
  onProgress('Mnemonic created')
  await sleep(200)

  onProgress('Deriving seed from mnemonic...')
  await sleep(200)

  const seed = mnemonicToSeedSync(mnemonic)
  onProgress('Seed derived')
  await sleep(200)

  onProgress('Deriving master key...')
  await sleep(200)

  const { masterPrivateKey, masterChainCode } = deriveMasterKey(seed)
  onProgress('Master key derived')
  await sleep(200)

  onProgress('Creating Ed25519 keypair...')
  await sleep(200)

  const keyPair = sign.keyPair.fromSeed(masterPrivateKey)
  const privateKeyRaw = Buffer.from(keyPair.secretKey.slice(0, 32))
  const publicKeyRaw = Buffer.from(keyPair.publicKey)

  onProgress('Keypair created')
  await sleep(200)

  onProgress('Generating Octra address...')
  await sleep(200)

  const address = createOctraAddress(publicKeyRaw)

  if (!verifyAddressFormat(address)) {
    throw new Error('Invalid address format generated')
  }

  onProgress('Address generated and verified')
  await sleep(200)

  onProgress('Testing signature functionality...')
  await sleep(200)

  const testMessage = '{"from":"test","to":"test","amount":"1000000","nonce":1}'
  const messageBytes = Buffer.from(testMessage, 'utf8')
  const signature = sign.detached(messageBytes, keyPair.secretKey)
  const signatureB64 = base64Encode(signature)

  let signatureValid = false
  try {
    signatureValid = sign.detached.verify(messageBytes, signature, keyPair.publicKey)
    onProgress('Signature test passed')
  } catch (error) {
    onProgress('Signature test failed')
  }

  await sleep(200)

  const walletData: WalletData = {
    mnemonic: mnemonicWords,
    seed_hex: bufferToHex(seed),
    master_chain_hex: bufferToHex(masterChainCode),
    private_key_hex: bufferToHex(privateKeyRaw),
    public_key_hex: bufferToHex(publicKeyRaw),
    private_key_b64: base64Encode(privateKeyRaw),
    public_key_b64: base64Encode(publicKeyRaw),
    address: address,
    entropy_hex: bufferToHex(entropy),
    test_message: testMessage,
    test_signature: signatureB64,
    signature_valid: signatureValid,
  }

  onProgress('Wallet generation complete!', walletData)
}