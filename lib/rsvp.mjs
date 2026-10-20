import { createHash, timingSafeEqual } from 'node:crypto';

/** @param {unknown} body */
export function validateGuest(body) {
  if (!body || typeof body !== 'object') return null;
  const { name, key } = /** @type {{name?: unknown, key?: unknown}} */ (body);
  if (typeof name !== 'string' || typeof key !== 'string') return null;
  const cleanName = name.trim().replace(/\s+/g, ' ');
  if (cleanName.length < 3 || cleanName.length > 100 || /[\u0000-\u001f\u007f]/.test(name)) return null;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(key)) return null;
  return { id: key, name: cleanName };
}

/** @param {string | null} header @param {string | undefined} password */
export function authorized(header, password) {
  if (!password || password.length < 12 || !header) return false;
  const hash = (/** @type {string} */ text) => createHash('sha256').update(text).digest();
  return timingSafeEqual(hash(header), hash(`Bearer ${password}`));
}

