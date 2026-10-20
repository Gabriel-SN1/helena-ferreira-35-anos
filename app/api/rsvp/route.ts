import { getDb } from '../../../db';
import { authorized, validateGuest } from '../../../lib/rsvp.mjs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const privateHeaders = { 'Cache-Control': 'private, no-store, max-age=0' };

export async function POST(request: Request) {
  // Next.js can use an internal hostname in request.url behind a hosting proxy.
  let sameOrigin = false;
  try {
    const origin = new URL(request.headers.get('origin') || '');
    const protocol = request.headers.get('x-forwarded-proto')?.split(',')[0].trim()
      || new URL(request.url).protocol.replace(':', '');
    sameOrigin = ['http:', 'https:'].includes(origin.protocol)
      && origin.host === request.headers.get('host')
      && origin.protocol === `${protocol}:`;
  } catch { /* Missing or malformed origins are rejected. */ }
  if (!sameOrigin) {
    return Response.json({ error: 'Origem inválida.' }, { status: 403 });
  }
  if (!request.headers.get('content-type')?.includes('application/json')) {
    return Response.json({ error: 'Formato inválido.' }, { status: 415 });
  }
  let body: unknown;
  try {
    const text = await request.text();
    if (text.length > 4096) return Response.json({ error: 'Dados muito longos.' }, { status: 413 });
    body = JSON.parse(text);
  } catch {
    return Response.json({ error: 'Dados inválidos.' }, { status: 400 });
  }
  const guest = validateGuest(body);
  if (!guest) return Response.json({ error: 'Informe seu nome completo (3 a 100 caracteres).' }, { status: 400 });
  if (!process.env.DATABASE_URL) {
    return Response.json({ error: 'As confirmações ainda não estão disponíveis. Tente novamente mais tarde.' }, { status: 503 });
  }
  try {
    await getDb().save(guest);
    return Response.json({ ok: true }, { headers: privateHeaders });
  } catch {
    return Response.json({ error: 'Não foi possível salvar. Tente novamente em instantes.' }, { status: 503 });
  }
}

export async function GET(request: Request) {
  if (!authorized(request.headers.get('authorization'), process.env.ADMIN_PASSWORD)) {
    return Response.json({ error: 'Senha incorreta ou acesso não configurado.' }, { status: 401, headers: privateHeaders });
  }
  try {
    return Response.json(await getDb().list(), { headers: privateHeaders });
  } catch {
    return Response.json({ error: 'A lista está indisponível. Confira a conexão do banco e tente novamente.' }, { status: 503, headers: privateHeaders });
  }
}
