# Onix Segurança e Tecnologia — site

Landing page estática (HTML + CSS + JS, sem build). Para ver localmente:

```bash
python3 -m http.server 8080   # abra http://localhost:8080
```

## Onde editar os dados

- **WhatsApp**: em `script.js`, no topo, preencha `CONFIG.whatsapp` com DDI+DDD+número, só dígitos (ex.: `"5534999999999"`). Todos os botões, o flutuante e os "Orçar ..." de cada serviço passam a usar esse número. Enquanto estiver vazio, o link abre o WhatsApp com a mensagem pronta para escolher o contato.
- **Demais dados** (endereço, horário, cidades, diferenciais, telefone, e-mail): procure por `TODO` no `index.html`. Os trechos visíveis no site aparecem com uma etiqueta amarela "TODO".
- **Fotos**: coloque em `assets/fotos/` (de preferência `.webp`) e troque os blocos `.shot--ph` da galeria pelo modelo que está no comentário acima da seção.

## Trocar o ID do Formspree

1. Crie uma conta em <https://formspree.io>, clique em **New Form** e copie o ID (ex.: `xayzbcde`).
2. No `index.html`, troque `SEU_ID_AQUI` em `action="https://formspree.io/f/SEU_ID_AQUI"` pelo ID.
3. Faça um envio de teste e confirme o e-mail de ativação que o Formspree mandar.

## Deploy

**Netlify**: entre em <https://app.netlify.com/drop> e arraste a pasta do projeto. Pronto.

**Vercel**: em <https://vercel.com/new>, importe o repositório do GitHub (Framework Preset: **Other**, sem build command), ou rode `npx vercel` dentro da pasta.

Depois do deploy, troque `https://SEU-DOMINIO.com.br/` no `index.html` (canonical, `og:url`, `og:image` e JSON-LD) pela URL final. É isso que faz a prévia do link aparecer no WhatsApp.

## Apontar um domínio .com.br

1. Registre o domínio em <https://registro.br>.
2. Adicione o domínio no painel da hospedagem (Netlify: *Domain management → Add domain*; Vercel: *Settings → Domains*).
3. No Registro.br, em **DNS**, escolha uma das opções:
   - **Usar o DNS da hospedagem** (mais simples): troque os servidores DNS pelos que a Netlify/Vercel mostrar.
   - **Manter o DNS do Registro.br**: crie os registros que o painel da hospedagem indicar. Normalmente é um `A` para o domínio raiz (Vercel: `76.76.21.21`; Netlify: `75.2.60.5`) e um `CNAME` para `www` (Vercel: `cname.vercel-dns.com`; Netlify: `SEU-SITE.netlify.app`).
4. Aguarde a propagação (de minutos até algumas horas). O HTTPS é ativado automaticamente.
