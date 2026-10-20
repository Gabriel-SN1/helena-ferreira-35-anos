"use client";
import { useRef, useState } from 'react';
export default function Page(){
 const [busy,setBusy]=useState(false),[error,setError]=useState(''),[link,setLink]=useState('');
 const memoryKey = useRef('');
 async function confirm(e: React.FormEvent<HTMLFormElement>) {
   e.preventDefault();
   if (busy) return;
   setBusy(true); setError('');
   const form = new FormData(e.currentTarget);
   try {
     let key = memoryKey.current;
     try { key = localStorage.getItem('helena-rsvp') || key; } catch { /* Browser may disable storage. */ }
     if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(key)) key = crypto.randomUUID();
     memoryKey.current = key;
     try { localStorage.setItem('helena-rsvp', key); } catch { /* Keep the current session working. */ }
     const name = String(form.get('name')).trim().replace(/\s+/g, ' ');
     const response = await fetch('/api/rsvp', {
       method: 'POST', headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ name, key }),
     });
     const result = await response.json();
     if (!response.ok) throw new Error(result.error || 'Não foi possível salvar. Tente novamente.');
     setLink('https://wa.me/5573981678981?text=' + encodeURIComponent(`Olá, Helena! Sou ${name} e confirmo minha presença na sua festa de 35 anos, dia 07/11 às 12h30, no Espaço Celebrar (Brogodó). 💛`));
   } catch (cause) {
     setError(cause instanceof Error ? cause.message : 'Não foi possível conectar. Tente novamente.');
   } finally { setBusy(false); }
 }
 return <><nav><a href="#">HF<span>35 ANOS</span></a><div className="nav-actions"><a href="#confirmar" className="navcta navcta-primary">Confirmar presença ↗</a><a href="/anfitria" className="navcta">Área da anfitriã ↗</a></div></nav><main><section className="hero"><div className="bloom b1">✿</div><div className="bloom b2">✿</div><div className="spark">✧</div><p className="eyebrow">UM NOVO CICLO. MUITOS MOTIVOS PARA CELEBRAR.</p><p className="script">Será uma alegria celebrar com você!</p><h1>Helena<br/><em>Ferreira</em></h1><div className="age">35 <span>anos</span></div><p className="intro">A vida fica mais bonita quando a gente celebra junto.<br/>Venha brindar esse momento comigo!</p><a className="button" href="#confirmar">Eu vou celebrar com você ↗</a><div className="details"><div><small>QUANDO SERÁ</small><strong><time dateTime="2026-11-07">07 de novembro</time></strong><span>Sábado, 2026</span></div><div><small>HORÁRIO</small><strong><time dateTime="12:30">12h30</time></strong><span>Te espero para comemorar!</span></div><div><small>LOCAL DA FESTA</small><strong>Espaço Celebrar</strong><span>Brogodó</span></div></div></section><section className="gifts"><div><p className="eyebrow">SUGESTÕES DE PRESENTES</p><h2>Seu abraço é<br/>o melhor <em>presente.</em></h2><p>Sua presença já me deixa feliz! Mas, se quiser me mimar, aqui vão algumas ideias.</p></div><ul>{['Roupa de academia · tamanho G','T-shirt','Sandália · número 38','Havaiana','Perfume doce'].map((x,i)=><li key={x}><span>0{i+1}</span>{x}<span>✧</span></li>)}</ul></section><section id="confirmar" className="rsvp"><p className="eyebrow">TEM UM LUGAR ESPECIAL PARA VOCÊ</p><h2>Vamos <em>celebrar?</em></h2><p>Deixe seu nome e confirme sua presença.</p>{link?<div className="success" role="status"><h3>Presença confirmada! 💛</h3><p>Seu nome já está na lista. Agora, envie a mensagem para Helena.</p><a className="button" href={link} target="_blank" rel="noopener noreferrer">Enviar mensagem no WhatsApp ↗</a><p className="note">A mensagem só será enviada quando você tocar em Enviar no WhatsApp.</p></div>:<form onSubmit={confirm}><label htmlFor="name">Seu nome completo</label><input id="name" name="name" placeholder="Como podemos te chamar?" autoComplete="name" minLength={3} maxLength={100} required/><button className="button" disabled={busy}>{busy?'Salvando sua confirmação…':'Confirmar minha presença ↗'}</button><p className="note">Sua confirmação será salva na lista da anfitriã. Depois, você poderá enviar a mensagem pelo WhatsApp.</p>{error&&<p role="alert">{error}</p>}</form>}</section></main><footer><span>Helena Ferreira · 35 anos</span><span>Feito para celebrar momentos felizes ♡</span></footer></>;
}
