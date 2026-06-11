import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Encryption Utilities', () => {
  let encrypt: any;
  let decrypt: any;

  beforeEach(async () => {
    vi.resetModules();
    process.env.ENCRYPTION_KEY = '12345678901234567890123456789012'; // 32 bytes
    const mod = await import('@/lib/encryption');
    encrypt = mod.encrypt;
    decrypt = mod.decrypt;
  });

  it('should encrypt and decrypt correctly with valid 32-byte key', () => {
    const originalText = 'my-super-secret-oauth-token';
    const encrypted = encrypt(originalText);
    
    expect(encrypted).not.toBe(originalText);
    expect(encrypted.split(':').length).toBe(3); // iv:authTag:encrypted

    const decrypted = decrypt(encrypted);
    expect(decrypted).toBe(originalText);
  });

  it('should throw an error if key length is not 32 bytes', async () => {
    vi.resetModules();
    process.env.ENCRYPTION_KEY = 'short-key';
    const mod = await import('@/lib/encryption');
    
    expect(() => mod.encrypt('test')).toThrow('ENCRYPTION_KEY must be exactly 32 bytes/characters long.');
    expect(() => mod.decrypt('test')).toThrow('ENCRYPTION_KEY must be exactly 32 bytes/characters long.');
  });

  it('should throw an error on invalid encrypted format', () => {
    expect(() => decrypt('invalid-format')).toThrow('Invalid encrypted text format.');
  });
});
