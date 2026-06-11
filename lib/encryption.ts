import crypto from 'crypto';

const algorithm = 'aes-256-gcm';
const secretKey = process.env.ENCRYPTION_KEY || ''; // 32 bytes

export function encrypt(text: string): string {
  if (!secretKey) {
    throw new Error('ENCRYPTION_KEY environment variable is missing.');
  }
  
  if (secretKey.length !== 32) {
    throw new Error('ENCRYPTION_KEY must be exactly 32 bytes/characters long.');
  }

  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag().toString('hex');
  
  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

export function decrypt(encryptedText: string): string {
  if (!secretKey) {
    throw new Error('ENCRYPTION_KEY environment variable is missing.');
  }

  if (secretKey.length !== 32) {
    throw new Error('ENCRYPTION_KEY must be exactly 32 bytes/characters long.');
  }

  const parts = encryptedText.split(':');
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted text format.');
  }

  const [ivHex, authTagHex, encryptedHex] = parts;
  
  const decipher = crypto.createDecipheriv(
    algorithm, 
    Buffer.from(secretKey), 
    Buffer.from(ivHex, 'hex')
  );
  
  decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));
  
  let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}
