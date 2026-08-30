import test from 'node:test'
import assert from 'node:assert/strict'

import { hashPassword, verifyPassword, generateTotpCode, verifyTotpCode } from './security.ts'

test('hashPassword verifies the original password and rejects a wrong one', () => {
  const { hash, salt } = hashPassword('StrongPass!123')

  assert.equal(verifyPassword('StrongPass!123', hash, salt), true)
  assert.equal(verifyPassword('WrongPass!123', hash, salt), false)
})

test('TOTP codes validate for the current time and reject expired values', () => {
  const secret = 'JBSWY3DPEHPK3PXP'
  const now = 1_700_000_000_000

  const code = generateTotpCode(secret, now)

  assert.equal(verifyTotpCode(secret, code, now), true)
  assert.equal(verifyTotpCode(secret, code, now + 60_000), true)
  assert.equal(verifyTotpCode(secret, '000000', now), false)
})
