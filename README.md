# Helena Ferreira • 35 anos

Landing page pronta para Next.js na Vercel, com confirmação de presença, WhatsApp e painel da anfitriã sem e-mail.

- Festa: **07/11/2026, às 12h30**, Espaço Celebrar (Brogodó).
- WhatsApp: **(73) 98167-8981**.
- Cores: amarelo manteiga e branco.
- Sugestões de presente incluídas conforme o convite.

## Publicar na Vercel

1. Importe este repositório em **Add New → Project**. Framework: **Next.js**. Diretório raiz: padrão. Build: **npm run build**. Não configure exportação estática.
2. Conecte um banco **Neon Postgres** pelo **Storage / Marketplace** da Vercel. A integração deve adicionar a variável **DATABASE_URL** ao projeto. Também é possível criar o banco no Neon e cadastrar a URL de conexão manualmente nas variáveis da Vercel.
3. Em **Settings → Environment Variables**, defina **ADMIN_PASSWORD** com uma senha particular de pelo menos 12 caracteres. Marque Production (e Preview se quiser testar nessa modalidade). Não use prefixo NEXT_PUBLIC_ para nenhuma dessas variáveis.
4. Faça o deploy/redeploy após conectar o banco e definir a senha. O build cria a tabela automaticamente e preserva as confirmações existentes. Se iniciar o projeto antes de conectar o banco, o build exibirá a configuração que falta; conecte Neon e execute Redeploy.
5. Abra a URL da Vercel e faça uma confirmação de teste. Abra **/anfitria**, digite a senha e confirme que o nome aparece. O link público do convite pode então ser enviado aos convidados. A senha fica só com a anfitriã.

**Variáveis obrigatórias:**

| Nome | Valor |
| --- | --- |
| DATABASE_URL | URL Postgres do Neon, fornecida pela integração |
| ADMIN_PASSWORD | Sua senha privada com pelo menos 12 caracteres |

Não há credenciais nem dados de teste neste repositório. A implantação e a conexão com o banco da sua conta são feitas na Vercel; adicionar o código ao GitHub não publica o site.

Documentação oficial: [Neon na Vercel](https://vercel.com/marketplace/neon) e [Postgres na Vercel](https://vercel.com/docs/postgres).

## Como funciona

O convidado informa o nome e confirma. O servidor salva a presença no Postgres antes de mostrar o botão de WhatsApp com a mensagem pronta. A mensagem só é enviada quando o convidado toca em **Enviar** dentro do WhatsApp. O site não verifica o envio da mensagem.

A lista em **/anfitria** exige senha, mostra o total de pessoas, atualiza automaticamente a cada 5 segundos enquanto a página permanece aberta e permite baixar CSV. A senha não é incluída no código do navegador nem gravada no armazenamento do navegador. Sair encerra a sessão da página.

O mesmo navegador reutiliza seu identificador para evitar duplicação em reenvios. Navegadores diferentes, limpeza do armazenamento ou aparelhos diferentes podem criar registros distintos. Cada confirmação corresponde a uma pessoa; acompanhantes não são coletados. Para confirmar mais de uma pessoa, cada convidado deve usar seu próprio navegador/aparelho.

## Desenvolvimento local

Requer Node.js >=22.13 e npm.

```powershell
npm ci
Copy-Item .env.example .env.local
# Preencha DATABASE_URL e ADMIN_PASSWORD em .env.local.
npm run db:setup
npm run dev
```

O comando `npm run build` gera o build de produção. Sem banco configurado, o build local pode servir para revisar o visual, mas não salva confirmações. Na Vercel, o build exige banco e senha configurados.

```powershell
npm test
npm run build
```

Os testes usam Postgres embarcado (PGlite), sem dados reais, para verificar a persistência, preservação de registros na preparação do banco, reenvio sem duplicação e consultas com nomes especiais. Também verificam validação, proteção da lista e exportação CSV. A conexão real com o Neon precisa ser conferida na URL publicada após o deploy.
