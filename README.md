# 🏆 Funil de Vendas - Mentoria em Licitação

Sistema completo de captura e qualificação de leads para mentoria especializada em licitações públicas.

## 📋 Sobre o Projeto

Este é um funil de vendas profissional desenvolvido em **HTML, CSS e JavaScript puro** (sem frameworks), projetado para:

- ✅ Capturar leads vindos do Instagram e outras fontes
- ✅ Qualificar leads através de formulário inteligente
- ✅ Calcular lead scoring automaticamente
- ✅ Enviar mensagens automáticas via WhatsApp
- ✅ Liberar agendamento apenas para leads qualificados
- ✅ Design responsivo e profissional

## 🎯 Funcionalidades

### 1. Landing Page (index.html)
- Headline otimizada para conversão
- Prova social com estatísticas
- Seção de benefícios
- CTA destacado
- Design moderno e responsivo

### 2. Formulário de Qualificação (form.html)
- 8 campos estratégicos de qualificação
- Validação em tempo real
- Barra de progresso
- Formatação automática (telefone, dinheiro)
- Feedback visual imediato
- UX otimizada para mobile

### 3. Sistema de Lead Scoring
Pontuação automática baseada em:
- **Objetivo** (0-30 pontos)
- **Conhecimento prévio** (0-20 pontos)
- **Faturamento atual** (0-25 pontos)
- **Meta de faturamento** (0-25 pontos)

**Classificação:**
- 🔥 **HOT** (>70 pontos): Alta prioridade, recebe link de agendamento
- ⚡ **WARM** (40-70 pontos): Médio potencial, recebe acompanhamento
- ❄️ **COLD** (<40 pontos): Nutrição com conteúdo educativo

### 4. Automação de WhatsApp
- Mensagens personalizadas por classificação
- Integração com APIs de WhatsApp (Z-API, 360Dialog, Twilio)
- Fallback para WhatsApp Web
- Templates humanizados e persuasivos

### 5. Página de Obrigado (thanks.html)
- Conteúdo dinâmico baseado no score
- Mensagens personalizadas
- Link de agendamento para HOT leads
- Next steps claros

## 📁 Estrutura de Arquivos

```
licitacao-funil/
├── index.html          # Landing page principal
├── form.html           # Formulário de qualificação
├── thanks.html         # Página de obrigado
├── css/
│   └── style.css       # Estilos completos e responsivos
└── js/
    ├── score.js        # Lógica de lead scoring
    ├── api.js          # Integração com APIs
    └── form.js         # Controle do formulário
```

## 🚀 Como Usar

### Passo 1: Configuração Básica

1. **Faça download dos arquivos**
2. **Mantenha a estrutura de pastas**
3. **Hospede em qualquer servidor web** (GitHub Pages, Netlify, Vercel, etc.)

### Passo 2: Configurar APIs

Edite o arquivo `js/api.js` e configure seus endpoints:

```javascript
const API_CONFIG = {
    // Seu endpoint para salvar leads
    SAVE_LEAD_ENDPOINT: 'https://sua-api.com/api/leads',
    
    // Seu endpoint de WhatsApp
    WHATSAPP_ENDPOINT: 'https://sua-api-whatsapp.com/send-message',
    
    // Seus tokens de autenticação
    API_TOKEN: 'SEU_TOKEN_AQUI',
    WHATSAPP_TOKEN: 'SEU_TOKEN_WHATSAPP_AQUI'
};
```

### Passo 3: Integração com WhatsApp API

#### Opções de APIs de WhatsApp:

**1. Z-API (Recomendado para Brasil)**
```javascript
async function sendWhatsAppMessage(phoneNumber, message) {
    const response = await fetch('https://api.z-api.io/instances/SEU_INSTANCE/token/SEU_TOKEN/send-text', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            phone: phoneNumber,
            message: message
        })
    });
    return await response.json();
}
```

**2. Twilio**
```javascript
async function sendWhatsAppMessage(phoneNumber, message) {
    const response = await fetch('https://api.twilio.com/2010-04-01/Accounts/YOUR_ACCOUNT_SID/Messages.json', {
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + btoa('YOUR_ACCOUNT_SID:YOUR_AUTH_TOKEN'),
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            From: 'whatsapp:+14155238886',
            To: `whatsapp:+${phoneNumber}`,
            Body: message
        })
    });
    return await response.json();
}
```

**3. 360Dialog**
```javascript
async function sendWhatsAppMessage(phoneNumber, message) {
    const response = await fetch('https://waba.360dialog.io/v1/messages', {
        method: 'POST',
        headers: {
            'D360-API-KEY': 'YOUR_API_KEY',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            to: phoneNumber,
            type: 'text',
            text: { body: message }
        })
    });
    return await response.json();
}
```

### Passo 4: Backend para Salvar Leads

Crie um endpoint REST para salvar os leads. Exemplo em Node.js:

```javascript
// server.js (Node.js + Express)
const express = require('express');
const app = express();

app.use(express.json());

app.post('/api/leads', async (req, res) => {
    try {
        const lead = req.body;
        
        // Salvar no banco de dados (MongoDB, PostgreSQL, etc.)
        await database.leads.insert(lead);
        
        // Enviar para CRM (RD Station, HubSpot, etc.)
        await crm.createContact(lead);
        
        res.json({ success: true, message: 'Lead salvo com sucesso' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(3000);
```

### Passo 5: Personalização

1. **Edite os textos** em `index.html`, `form.html` e `thanks.html`
2. **Ajuste as cores** em `css/style.css` (variáveis CSS no topo)
3. **Modifique o scoring** em `js/score.js` conforme sua estratégia
4. **Personalize mensagens** de WhatsApp em `js/score.js`

## 🎨 Personalização de Design

### Trocar Cores

Edite as variáveis CSS em `css/style.css`:

```css
:root {
    --primary-color: #1a365d;      /* Azul principal */
    --accent-color: #d4af37;       /* Dourado */
    --success-color: #28a745;      /* Verde */
    /* ... */
}
```

### Trocar Fontes

```css
:root {
    --font-primary: 'Sua Fonte', sans-serif;
    --font-heading: 'Sua Fonte Heading', serif;
}
```

## 📊 Lead Scoring - Detalhamento

| Critério | Frio (0-39) | Morno (40-70) | Quente (71-100) |
|----------|-------------|---------------|-----------------|
| Objetivo | Renda Extra | Viver disso | Já vive + quer mais |
| Conhecimento | Não | Sim | Sim |
| Faturamento | R$ 0-10k | R$ 10k-50k | R$ 50k+ |
| Meta | < R$ 20k | R$ 20k-100k | R$ 100k+ |

## 📱 Mensagens de WhatsApp

### Lead HOT (Score > 70)
```
🔥 LEAD QUENTE 🔥

Olá [NOME]!

Analisamos seu perfil e você tem TUDO para DOMINAR 
o mercado de licitações!

🎯 Agende agora uma reunião exclusiva:
https://calendar.app.google/TYFCiuD2D4dy9dWy5
```

### Lead WARM (Score 40-70)
```
👋 Olá [NOME]!

Você tem potencial! Nossa equipe vai entrar em contato 
nas próximas 24h.

Se quiser acelerar, agende aqui:
https://calendar.app.google/TYFCiuD2D4dy9dWy5
```

### Lead COLD (Score < 40)
```
Olá [NOME]!

Obrigado pelo interesse! Vamos enviar materiais 
educativos sobre licitações.

Abraço! 😊
```

## 🔒 Segurança

### Boas Práticas Implementadas:

- ✅ Sanitização de inputs do usuário
- ✅ Validação de e-mail e telefone
- ✅ Limitação de tamanho de campos
- ✅ Proteção contra XSS básica
- ✅ HTTPS obrigatório para produção

### Recomendações Adicionais:

- Use variáveis de ambiente para tokens
- Implemente rate limiting no backend
- Configure CORS adequadamente
- Use HTTPS sempre
- Valide dados no backend também

## 📈 Integrações Recomendadas

### 1. Google Analytics
```html
<!-- Adicione no <head> de todas as páginas -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### 2. Facebook Pixel
```html
<!-- Adicione no <head> de todas as páginas -->
<script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', 'YOUR_PIXEL_ID');
  fbq('track', 'PageView');
</script>
```

### 3. Google Tag Manager
```html
<!-- Adicione no <head> -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXXXX');</script>
```

## 🌐 Hospedagem

### Opções Gratuitas:

**1. GitHub Pages**
```bash
# 1. Crie repositório no GitHub
# 2. Faça upload dos arquivos
# 3. Vá em Settings > Pages
# 4. Selecione branch main
# 5. Seu site estará em: https://seu-usuario.github.io/licitacao-funil
```

**2. Netlify**
```bash
# 1. Arraste a pasta para netlify.com/drop
# 2. Site publicado instantaneamente
# 3. Customize domínio em Domain Settings
```

**3. Vercel**
```bash
# 1. Instale Vercel CLI: npm i -g vercel
# 2. Execute: vercel
# 3. Siga as instruções
```

## 📞 Suporte e Contato

Para dúvidas ou suporte:
- WhatsApp: (86) 9 9544-3162
- E-mail: contato@seuemail.com

## 📝 Checklist de Implementação

- [ ] Baixar e hospedar arquivos
- [ ] Configurar endpoints da API
- [ ] Configurar WhatsApp API
- [ ] Testar formulário completo
- [ ] Verificar lead scoring
- [ ] Testar em dispositivos móveis
- [ ] Configurar Google Analytics
- [ ] Configurar Facebook Pixel
- [ ] Adicionar domínio personalizado
- [ ] Testar fluxo completo de ponta a ponta

## 🎓 Como Funciona o Fluxo

1. **Usuário acessa** landing page (index.html)
2. **Clica em CTA** e vai para formulário (form.html)
3. **Preenche formulário** com 8 campos estratégicos
4. **JavaScript calcula score** automaticamente
5. **Dados são enviados** para API REST
6. **Mensagem WhatsApp** é enviada automaticamente
7. **Usuário é redirecionado** para thanks.html
8. **Conteúdo dinâmico** é exibido baseado no score
9. **Leads HOT** recebem link de agendamento
10. **Leads WARM/COLD** entram em nutrição

## 🏗️ Próximas Melhorias Sugeridas

- [ ] Adicionar chat ao vivo (Tawk.to, Zendesk)
- [ ] Implementar remarketing pixel
- [ ] Criar dashboard de analytics
- [ ] Adicionar A/B testing
- [ ] Implementar webhook para Zapier
- [ ] Criar versão AMP para mobile
- [ ] Adicionar Progressive Web App (PWA)

## 📄 Licença

Este projeto é de uso livre para fins comerciais e educacionais.

---

**Desenvolvido com ❤️ para transformar negócios através das licitações**

Última atualização: Janeiro 2026
