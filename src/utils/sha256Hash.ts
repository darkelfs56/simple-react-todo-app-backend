import { createHash } from 'crypto';

export function sha256Hash(data: string) {
  const sha256Hash = createHash('sha256');
  return sha256Hash.update(data).digest('hex');
}
