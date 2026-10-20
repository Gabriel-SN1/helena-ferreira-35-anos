"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import { csvCell } from '../../lib/csv.mjs';

type Row = { id: string; name: string; createdAt: string };
export default function Admin() {
  const [password, setPassword] = useState('');
  const [active, setActive] = useState('');
  const [rows, setRows] = useState<Row[]>([]);
  const [error, setError] = useState('');
  const [updated, setUpdated] = useState('');
  const [busy, setBusy] = useState(false);
  const session = useRef(0);

  const refresh = useCallback(async (secret: string, generation: number) => {
    try {
      const response = await fetch('/api/rsvp', {
        headers: { Authorization: `Bearer ${secret}` },
        cache: 'no-store',
      });
      const body = await response.json();
      if (generation !== session.current) return;
      if (!response.ok) throw new Error(body.error || 'Não foi possível atualizar a lista.');
      setRows(body);
      setActive(secret);
      setPassword('');
      setError('');
      setUpdated(new Date().toLocaleTimeString('pt-BR', { timeZone: 'America/Bahia' }));
    } catch (cause) {
      if (generation === session.current) setError(cause instanceof Error ? cause.message : 'Sem conexão. Tentando atualizar novamente.');
    }
  }, []);

  useEffect(() => {
    if (!active) return;
    let stopped = false;
    let timer: ReturnType<typeof setTimeout>;
    const generation = session.current;
    async function tick() {
      await refresh(active, generation);
      if (!stopped) timer = setTimeout(tick, 5000);
    }
    timer = setTimeout(tick, 5000);
    return () => { stopped = true; clearTimeout(timer); };
  }, [active, refresh]);

  function logout() {
    session.current++;
    setActive(''); setRows([]); setPassword(''); setError('');
  }

  function csv() {
    const content = '\uFEFFNome;Confirmação\r\n' + rows.map(row => [
      row.name,
      new Date(row.createdAt).toLocaleString('pt-BR', { timeZone: 'America/Bahia' }),
    ].map(csvCell).join(';')).join('\r\n');
    const url = URL.createObjectURL(new Blob([content], { type: 'text/csv;charset=utf-8' }));
    const anchor = document.createElement('a');
    anchor.href = url; anchor.download = 'confirmados-helena.csv'; anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return <main className="admin">
    <a href="/">← Voltar ao convite</a>
    <p className="eyebrow">ÁREA DA ANFITRIÃ</p>
    <h1>Quem vem celebrar</h1>
    {!active ? <form onSubmit={async event => {
      event.preventDefault(); setBusy(true);
      await refresh(password, session.current);
      setBusy(false);
    }}>
      <p>Entre com sua senha para acompanhar as confirmações.</p>
      <label htmlFor="password">Senha de acesso</label>
      <input id="password" type="password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} required />
      <button className="button" disabled={busy}>{busy ? 'Acessando…' : 'Acessar lista ↗'}</button>
    </form> : <>
      <div className="stats" aria-live="polite">{rows.length} <small>{rows.length === 1 ? 'presença confirmada' : 'presenças confirmadas'}</small></div>
      <p className="note">Atualização automática a cada 5 segundos · Última atualização: {updated}</p>
      <div className="admin-actions"><button className="button" onClick={csv}>Baixar lista CSV ↓</button><button className="button" onClick={logout}>Sair</button></div>
      <div className="table-scroll"><table><thead><tr><th>Convidado</th><th>Confirmou em</th></tr></thead><tbody>
        {rows.map(row => <tr key={row.id}><td>{row.name}</td><td>{new Date(row.createdAt).toLocaleString('pt-BR', { timeZone: 'America/Bahia' })}</td></tr>)}
      </tbody></table></div>
      {rows.length === 0 && <p>Nenhuma confirmação ainda. A lista aparecerá aqui assim que os convidados confirmarem.</p>}
    </>}
    {error && <p role="alert">{error}</p>}
  </main>;
}
