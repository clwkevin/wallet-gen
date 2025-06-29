import { createHmac, createHash } from 'crypto'
import { sign } from 'tweetnacl'

const BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'

interface DeriveRequest {
  seed_hex: string
  network_type?: number
  index?: number
}

interface NetworkDerivation {
  address: string
  path: string
  network_type_name: string
}

function hexToBuffer(hex: string): Buffer {
  return Buffer.from(hex, 'hex')
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

function createOctraAddress(publicKey: Buffer): string {
  const hash = createHash('sha256').update(publicKey).digest()
  const base58Hash = base58Encode(hash)
  return 'oct' + base58Hash
}

function deriveMasterKey(seed: Buffer): { masterPrivateKey: Buffer; masterChainCode: Buffer } {
  const key = Buffer.from('Octra seed', 'utf8')
  const mac = createHmac('sha512', key).update(seed).digest()

  const masterPrivateKey = mac.slice(0, 32)
  const masterChainCode = mac.slice(32, 64)

  return { masterPrivateKey, masterChainCode }
}

function deriveChildKeyEd25519(
  privateKey: Buffer,
  chainCode: Buffer,
  index: number
): { childPrivateKey: Buffer; childChainCode: Buffer } {
  let data: Buffer

  if (index >= 0x80000000) {
    // Hardened derivation
    data = Buffer.concat([
      Buffer.from([0x00]),
      privateKey,
      Buffer.from([
        (index >>> 24) & 0xff,
        (index >>> 16) & 0xff,
        (index >>> 8) & 0xff,
        index & 0xff,
      ]),
    ])
  } else {
    // Non-hardened derivation
    const keyPair = sign.keyPair.fromSeed(privateKey)
    const publicKey = Buffer.from(keyPair.publicKey)
    data = Buffer.concat([
      publicKey,
      Buffer.from([
        (index >>> 24) & 0xff,
        (index >>> 16) & 0xff,
        (index >>> 8) & 0xff,
        index & 0xff,
      ]),
    ])
  }

  const mac = createHmac('sha512', chainCode).update(data).digest()
  const childPrivateKey = mac.slice(0, 32)
  const childChainCode = mac.slice(32, 64)

  return { childPrivateKey, childChainCode }
}

function derivePath(seed: Buffer, path: number[]): { key: Buffer; chain: Buffer } {
  const { masterPrivateKey, masterChainCode } = deriveMasterKey(seed)
  let key = masterPrivateKey
  let chain = masterChainCode

  for (const index of path) {
    const derived = deriveChildKeyEd25519(key, chain, index)
    key = derived.childPrivateKey
    chain = derived.childChainCode
  }

  return { key, chain }
}

function getNetworkTypeName(networkType: number): string {
  switch (networkType) {
    case 0:
      return 'MainCoin'
    case 1:
      return 'SubCoin'
    case 2:
      return 'Contract'
    case 3:
      return 'Subnet'
    case 4:
      return 'Account'
    default:
      return `Unknown ${networkType}`
  }
}

function deriveForNetwork(
  seed: Buffer,
  networkType: number = 0,
  network: number = 0,
  contract: number = 0,
  account: number = 0,
  index: number = 0,
  token: number = 0,
  subnet: number = 0
): NetworkDerivation {
  const coinType = networkType === 0 ? 0 : networkType

  const basePath = [
    0x80000000 + 345, // Purpose
    0x80000000 + coinType, // Coin type
    0x80000000 + network, // Network
  ]

  const contractPath = [0x80000000 + contract, 0x80000000 + account]
  const optionalPath = [0x80000000 + token, 0x80000000 + subnet]
  const finalPath = [index]

  const fullPath = [
    ...basePath,
    ...contractPath,
    ...optionalPath,
    ...finalPath,
  ]

  const { key: derivedKey } = derivePath(seed, fullPath)

  const keyPair = sign.keyPair.fromSeed(derivedKey)
  const derivedAddress = createOctraAddress(Buffer.from(keyPair.publicKey))

  const pathString = fullPath
    .map(i => (i & 0x7fffffff).toString() + (i & 0x80000000 ? "'" : ""))
    .join('/')

  return {
    address: derivedAddress,
    path: pathString,
    network_type_name: getNetworkTypeName(networkType),
  }
}

export async function deriveWalletAddress(data: DeriveRequest): Promise<NetworkDerivation> {
  const { seed_hex, network_type = 0, index = 0 } = data

  const seed = hexToBuffer(seed_hex)
  const derived = deriveForNetwork(
    seed,
    network_type,
    0, // network
    0, // contract
    0, // account
    index
  )

  return derived
}