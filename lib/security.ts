import crypto from 'crypto'
import fs from 'fs'
import path from 'path'

export type AuthState = {
  passwordHash: string
  passwordSalt: string
  verificationEnabled: boolean
  totpSecretEncrypted?: string
  pendingTotpSecretEncrypted?: string
  recoveryCodesEncrypted?: string
  pendingRecoveryCodesEncrypted?: string
  lastSetupAt?: number
  pendingSetupAt?: number
}

const AUTH_STORE_PATH = path.join(process.cwd(), 'data', 'auth.json')
const PASSWORD_LENGTH = 12
const TOTP_DIGITS = 6
const TOTP_PERIOD_SECONDS = 30
const MAX_VERIFICATION_ATTEMPTS = 5
const LOCKOUT_MS = 10 * 60 * 1000
const DEFAULT_PASSWORD = process.env.ADMIN_PASSWORD
const ENCRYPTION_KEY = process.env.SECURITY_KEY || process.env.SESSION_SECRET || 'development-security-key-change-me'

function toBase32(value: Buffer): string {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
  let output = ''
  let bits = 0
  let valueIndex = 0

  for (let i = 0; i < value.length; i++) {
    bits = (bits << 8) | value[i]
    valueIndex += 8

    while (valueIndex >= 5) {
      valueIndex -= 5
      output += alphabet[(bits >> valueIndex) & 31]
    }
  }

  if (valueIndex > 0) {
    output += alphabet[(bits << (5 - valueIndex)) & 31]
  }

  return output
}

function decodeBase32(secret: string): Buffer {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
  let bits = 0
  let value = 0
  const output: number[] = []

  for (const char of secret.toUpperCase()) {
    const index = alphabet.indexOf(char)
    if (index === -1) continue
    value = (value << 5) | index
    bits += 5

    if (bits >= 8) {
      bits -= 8
      output.push((value >> bits) & 0xff)
    }
  }

  return Buffer.from(output)
}

const verificationAttempts = new Map<string, { count: number; lockedUntil: number }>()

function getKeyMaterial() {
  return crypto.createHash('sha256').update(ENCRYPTION_KEY).digest()
}

export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.pbkdf2Sync(password, salt, 200_000, 32, 'sha256').toString('hex')
  return { hash, salt }
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  if (!password || !hash || !salt) return false

  const expectedHash = crypto.pbkdf2Sync(password, salt, 200_000, 32, 'sha256').toString('hex')
  try {
    return crypto.timingSafeEqual(Buffer.from(expectedHash, 'hex'), Buffer.from(hash, 'hex'))
  } catch {
    return false
  }
}

export function getPasswordStrength(password: string): { score: number; label: string; valid: boolean } {
  if (!password) return { score: 0, label: 'Empty', valid: false }

  const checks = [
    /.{12,}/,
    /[a-z]/,
    /[A-Z]/,
    /\d/,
    /[^A-Za-z0-9]/,
  ]

  const score = checks.filter((rule) => rule.test(password)).length

  if (score <= 2) return { score, label: 'Weak', valid: false }
  if (score === 3 || score === 4) return { score, label: 'Good', valid: true }
  return { score, label: 'Strong', valid: true }
}

export function ensurePasswordIsStrong(password: string): boolean {
  return getPasswordStrength(password).valid && password.length >= PASSWORD_LENGTH
}

export function generateTotpSecret(): string {
  return toBase32(crypto.randomBytes(20)).replace(/=+$/g, '')
}

export function generateTotpCode(secret: string, timestamp = Date.now()): string {
  const key = decodeBase32(secret)
  const counter = Math.floor(timestamp / (TOTP_PERIOD_SECONDS * 1000))
  const buffer = Buffer.alloc(8)
  let value = BigInt(counter)

  for (let i = 7; i >= 0; i--) {
    buffer[i] = Number(value & BigInt(0xff))
    value >>= BigInt(8)
  }

  const hmac = crypto.createHmac('sha1', key)
  hmac.update(buffer)
  const digest = hmac.digest()
  const offset = digest[digest.length - 1] & 0x0f
  const binary = ((digest[offset] & 0x7f) << 24) | ((digest[offset + 1] & 0xff) << 16) | ((digest[offset + 2] & 0xff) << 8) | (digest[offset + 3] & 0xff)

  const code = binary % 1000000
  return String(code).padStart(TOTP_DIGITS, '0')
}

export function verifyTotpCode(secret: string, code: string, timestamp = Date.now(), windowSize = 2): boolean {
  if (!secret || !code || !/^\d{6}$/.test(code)) return false

  for (let offset = -windowSize; offset <= windowSize; offset++) {
    const candidate = generateTotpCode(secret, timestamp + offset * TOTP_PERIOD_SECONDS * 1000)
    if (candidate === code) return true
  }

  return false
}

export function getTotpAuthUrl(secret: string, label: string, issuer: string): string {
  const params = new URLSearchParams({
    secret,
    issuer,
    algorithm: 'SHA1',
    digits: String(TOTP_DIGITS),
    period: String(TOTP_PERIOD_SECONDS),
  })

  return `otpauth://totp/${encodeURIComponent(label)}?${params.toString()}`
}

export function generateRecoveryCodes(count = 8): string[] {
  return Array.from({ length: count }, () => {
    const bytes = crypto.randomBytes(4).readUInt32BE(0)
    return `RC-${String(bytes % 100000000).padStart(8, '0')}`
  })
}

export function encryptPayload(value: string): string {
  const key = getKeyMaterial()
  const iv = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)
  const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  return Buffer.concat([iv, tag, encrypted]).toString('base64')
}

export function decryptPayload(value: string): string {
  if (!value) return ''

  try {
    const key = getKeyMaterial()
    const buffer = Buffer.from(value, 'base64')
    const iv = buffer.subarray(0, 12)
    const tag = buffer.subarray(12, 28)
    const encrypted = buffer.subarray(28)

    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv)
    decipher.setAuthTag(tag)

    return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8')
  } catch {
    return ''
  }
}

export function getAuthStatePath(): string {
  const dir = path.dirname(AUTH_STORE_PATH)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  return AUTH_STORE_PATH
}

export function readAuthState(): AuthState {
  try {
    if (!fs.existsSync(getAuthStatePath())) {
      const defaultState = createDefaultAuthState()
      writeAuthState(defaultState)
      return defaultState
    }

    const raw = fs.readFileSync(getAuthStatePath(), 'utf8')
    const parsed = JSON.parse(raw) as Partial<AuthState>
    return {
      ...createDefaultAuthState(),
      ...parsed,
    }
  } catch (error) {
    console.error('Error reading auth state:', error)
    return createDefaultAuthState()
  }
}

export function writeAuthState(state: AuthState): void {
  fs.writeFileSync(getAuthStatePath(), JSON.stringify(state, null, 2), 'utf8')
}

export function createDefaultAuthState(): AuthState {
  const password = DEFAULT_PASSWORD || crypto.randomBytes(32).toString('hex')
  const { hash, salt } = hashPassword(password)
  return {
    passwordHash: hash,
    passwordSalt: salt,
    verificationEnabled: false,
  }
}

export function getVerificationRateLimitKey(scope: string): string {
  return `verification:${scope}`
}

export function getVerificationAttemptState(key: string): { blocked: boolean; remainingMs: number } {
  const now = Date.now()
  const record = verificationAttempts.get(key)

  if (!record) {
    return { blocked: false, remainingMs: 0 }
  }

  if (record.lockedUntil > now) {
    return { blocked: true, remainingMs: record.lockedUntil - now }
  }

  verificationAttempts.delete(key)
  return { blocked: false, remainingMs: 0 }
}

export function registerFailedVerificationAttempt(key: string): void {
  const now = Date.now()
  const existing = verificationAttempts.get(key) ?? { count: 0, lockedUntil: 0 }

  const nextCount = existing.count + 1
  if (nextCount >= MAX_VERIFICATION_ATTEMPTS) {
    verificationAttempts.set(key, { count: nextCount, lockedUntil: now + LOCKOUT_MS })
    return
  }

  verificationAttempts.set(key, { count: nextCount, lockedUntil: 0 })
}

export function clearVerificationAttempts(key: string): void {
  verificationAttempts.delete(key)
}
