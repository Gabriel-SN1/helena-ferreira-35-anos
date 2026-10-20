import { readFile } from 'node:fs/promises';
import { neon } from '@neondatabase/serverless';

if (!process.env.VERCEL) {
  try { process.loadEnvFile('.env.local'); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
}

if (!process.env.DATABASE_URL) {
  if (process.env.VERCEL) {
    console.error('Conecte o banco Neon ao projeto Vercel para configurar DATABASE_URL e faça um novo deploy.');
    process.exit(1);
  }
  console.log('DATABASE_URL ausente: build local sem banco. Para confirmar presenças, configure .env.local e execute npm run db:setup.');
} else {
  if (process.env.VERCEL && (process.env.ADMIN_PASSWORD?.length ?? 0) < 12) {
    console.error('Configure ADMIN_PASSWORD com pelo menos 12 caracteres na Vercel antes do deploy.');
    process.exit(1);
  }
  try {
    const sql = neon(process.env.DATABASE_URL);
    const schema = await readFile(new URL('../db/schema.sql', import.meta.url), 'utf8');
    await sql.query(schema);
    console.log('Banco de confirmações pronto. Registros existentes foram preservados.');
  } catch {
    console.error('Não foi possível preparar o banco. Confira a conexão DATABASE_URL e a disponibilidade do Neon.');
    process.exit(1);
  }
}
