# LACHINE IMPORTS - Loja de Perfumes Arabes

Landing page premium para vitrine de perfumes arabes, com catalogo interativo, filtros e fluxo de compra via WhatsApp.

## Tecnologias

- HTML5
- CSS3
- JavaScript (vanilla)

## Funcionalidades

- Hero com video de fundo
- Catalogo com busca, filtros e ordenacao
- Cards de produtos com modal acessivel
- CTA de compra com mensagem pronta no WhatsApp
- Layout responsivo para desktop e mobile

## Estrutura

```text
.
|-- index.html
|-- style.css
|-- app.js
`-- img/
    |-- logo.png
    `-- luxury_spray.mp4
```

## Execucao local

Por ser um projeto estatico, basta abrir o `index.html` no navegador.

Para uma experiencia melhor durante desenvolvimento, rode com servidor local, por exemplo:

```bash
npx serve .
```

## Personalizacao rapida

- Atualize o numero de WhatsApp em `app.js` na constante `WHATSAPP_PHONE`.
- Edite os dados de produtos e colecoes no proprio `app.js`.
- Ajuste cores e variaveis visuais em `style.css`.

## Proximos passos recomendados

- Migrar catalogo para JSON externo ou CMS
- Adicionar imagens reais dos produtos
- Integrar analytics e monitoramento de conversao

