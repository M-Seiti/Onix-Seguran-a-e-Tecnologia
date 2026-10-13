# Onix Segurança e Tecnologia — site

Landing page estática (HTML + CSS + JS, sem build). Para ver localmente:

```bash
python3 -m http.server 8080   # abra http://localhost:8080
```

## Onde editar os dados

- **WhatsApp**: em `script.js`, no topo, `CONFIG.whatsapp` (DDI+DDD+número, só dígitos; hoje `553438428126`). Todos os botões, o flutuante e os "Orçar ..." de cada serviço usam esse número.
- **Formulário**: não usa serviço externo. Ao enviar, ele valida os campos e abre o WhatsApp da Onix com nome, telefone, cidade, serviço e mensagem já escritos. O cliente só toca em enviar.
- **Logo**: `assets/logo.png` e `assets/logo.webp`. Uma versão em alta resolução (PNG com fundo transparente) deixaria a logo mais nítida em telas grandes.

## Deploy

**Netlify**: entre em <https://app.netlify.com/drop> e arraste a pasta do projeto. Pronto.

**Vercel**: em <https://vercel.com/new>, importe o repositório do GitHub (Framework Preset: **Other**, sem build command), ou rode `npx vercel` dentro da pasta.

O site está publicado em <https://onixseguranca.netlify.app/>. Se passar a usar um domínio próprio, troque todas as ocorrências de `https://onixseguranca.netlify.app/` no `index.html` (canonical, `og:url`, `og:image` e JSON-LD) pelo novo endereço. O WhatsApp e o Google só leem a imagem de prévia pelo endereço completo.

## Apontar um domínio .com.br

1. Registre o domínio em <https://registro.br>.
2. Adicione o domínio no painel da hospedagem (Netlify: *Domain management → Add domain*; Vercel: *Settings → Domains*).
3. No Registro.br, em **DNS**, escolha uma das opções:
   - **Usar o DNS da hospedagem** (mais simples): troque os servidores DNS pelos que a Netlify/Vercel mostrar.
   - **Manter o DNS do Registro.br**: crie os registros que o painel da hospedagem indicar. Normalmente é um `A` para o domínio raiz (Vercel: `76.76.21.21`; Netlify: `75.2.60.5`) e um `CNAME` para `www` (Vercel: `cname.vercel-dns.com`; Netlify: `SEU-SITE.netlify.app`).
4. Aguarde a propagação (de minutos até algumas horas). O HTTPS é ativado automaticamente.
