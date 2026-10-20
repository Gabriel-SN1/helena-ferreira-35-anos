import { neon } from '@neondatabase/serverless';
import { confirmationRepository } from './repository.mjs';

export function getDb() {
  const connection = process.env.DATABASE_URL;
  if (!connection) throw new Error('DATABASE_URL is required');
  const sql = neon(connection);
  return confirmationRepository(async (text, values = []) => sql.query(text, values));
}
