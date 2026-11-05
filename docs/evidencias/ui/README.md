# Evidências de UI — Menu Carga

Prints gerados no Google Stitch como direção visual. Não são código-fonte: o HTML gerado pelo Stitch não entra no `frontend/`. Tokens extraídos para `frontend/src/styles.css` (`@theme`).

O que foi adotado:

- Paleta: `bg-50`, `border-200`, `text-900`, `brand-600`, `success-100/800`, `error-50/600`.
- Ritmo 8px, raios `rounded-lg` (8px) em badge/input e `rounded-2xl` (16px) em cards.
- Três telas reais: consulta, cadastro, importação. Sem listagem de concessões.

O que foi recusado do mock:

- Rotas inventadas (`/api/v1/permissoes/...`).
- Autenticação, JWT, Identity Provider, timestamp, `trace-id`.
- Botão "Simular 409", "Baixar Modelo CSV" e página "Tokens Tailwind" como rota.
- Cabeçalho CSV `pessoa,modulo,caminho,permissao` — o contrato real é `pessoa,modulo,path,direito`.
