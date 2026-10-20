# Helena Ferreira — 35 anos

Convite de aniversário com confirmação de presença e lista da anfitriã.

Dados: 07/11/2026, 12h30, Espaço Celebrar (Brogodó). WhatsApp: 5573981678981.

## Estado da entrega
Código e build verificados. Fluxo de confirmação, mensagem pronta, lista protegida por senha, atualização automática em 5 segundos e prevenção de reenvio pelo mesmo navegador testados localmente. Banco de produção ainda não publicado. Nenhum link público está ativo. O envio ao repositório Sites foi bloqueado pela política de aprovação do ambiente.

## Desenvolvimento
Requer Node 22.13+ e dependências de package-lock.json. Instale com npm ci. Configure ADMIN_PASSWORD em .dev.vars para a prévia local, sem versionar o arquivo. A senha de produção deve ser configurada como segredo na hospedagem. Execute npm run build e aplique drizzle/0000_unknown_mysterio.sql ao D1 local usando os comandos do starter. Execute npm run dev.

## Hospedagem
O projeto Sites está identificado em .openai/hosting.json. Reutilize esse projeto. O binding D1 é DB e a migração está em drizzle/. A publicação e o controle de acesso devem seguir a skill Sites. A área /anfitria e o GET /api/rsvp exigem ADMIN_PASSWORD no servidor. O convite precisa de acesso público por link para uso pelos convidados; a lista continua protegida pela senha.

## Comportamento
A confirmação é gravada ANTES de oferecer o link wa.me. O convidado precisa tocar em Enviar no WhatsApp. O site não verifica se a mensagem foi enviada. Cada navegador guarda um identificador para evitar duplicação ao reenviar; aparelhos e navegadores diferentes podem gerar confirmações distintas para a mesma pessoa. Não há confirmação de acompanhantes.

O ZIP não contém dependências, banco local, dados de teste ou senhas. Não use a senha local de teste em produção.
