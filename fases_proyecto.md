# VisionFinance — Plan de Fases 🚀

> **Stack:** React + Node.js | **IA:** Claude Vision API (BYOK) | **BD:** PostgreSQL + Supabase
> **Duración total estimada:** ~17 semanas a ritmo cómodo

---

## Fase 1 — MVP (6–8 semanas)
**Objetivo:** App funcional y presentable en portfolio

### Semana 1–2 · Setup y fundamentos
- Monorepo (frontend + backend)
- Supabase: BD, auth, storage
- Prisma schema + migraciones
- Auth completo: registro, login, JWT

### Semana 3–4 · Core: tickets + OCR
- Subida de imagen a Supabase Storage
- Endpoint `/ocr` → Claude Vision API
- Guardado seguro de API Key (AES-256)
- Formulario pre-rellenado con datos del OCR

### Semana 5 · Categorización + búsqueda
- Motor de categorización por keywords
- Endpoint de búsqueda por comercio y fecha
- CRUD completo de tickets

### Semana 6–7 · Dashboard + UI
- Gráficos mensuales con Recharts
- Resumen por categoría
- UI pulida con shadcn/ui
- Responsive completo

### Semana 8 · Deploy + portfolio
- Deploy: Vercel + Railway
- Variables de entorno en producción
- README técnico con decisiones de arquitectura
- Demo en vivo con ticket real

---

## Fase 2 — Producto real (4–5 semanas)
**Objetivo:** Funcionalidades que convierten la app en un producto usable

### Semana 9–10 · Presupuestos + alertas
- CRUD de presupuestos por categoría
- Lógica de control: gasto vs límite
- Notificaciones in-app al superar el límite
- Indicador visual en dashboard

### Semana 11–12 · Exportación para gestoría
- Generación de CSV trimestral
- Generación de PDF con logo y tabla
- Filtro por trimestre y año
- Botón de descarga desde la UI

### Semana 13 · Calidad y robustez
- Detección de tickets duplicados
- Estados del ticket: pendiente / revisado / enviado
- Validaciones y manejo de errores
- Tests de integración de los endpoints clave

---

## Fase 3 — Lanzamiento (3–4 semanas)
**Objetivo:** Preparar el producto para usuarios reales

### Semana 14–15 · Modelo freemium
- Plan gratuito: 10 escaneos/mes
- Plan Pro: ilimitado
- Integración con Stripe
- Lógica de límites por plan

### Semana 16 · Onboarding + UX
- Flujo de bienvenida para nuevos usuarios
- Página de pricing
- Gestión de cuenta y suscripción
- Soporte multimoneda (EUR/USD)

### Semana 17 · Go live
- Dominio propio + SSL
- Monitorización (Sentry + logs)
- Landing page pública
- Beta con usuarios reales

---

## Fase 4 — Optimización e Inteligencia (4–5 semanas)
**Objetivo:** Diferenciación competitiva mediante IA avanzada

### Semana 18–19 · Smart Advisor
- Lógica de embedding para búsqueda semántica en tickets
- Chatbot integrado con Claude para consultas financieras
- Notificaciones inteligentes de ahorro

### Semana 20–21 · Fiscalidad y PWA
- Lógica de cálculo de IVA/IRPF trimestral
- Generación de informes fiscales sugerido
- Optimización PWA para móviles (cámara y offline)

### Semana 22 · Conciliación y Pulido
- Parser de extractos bancarios (PDF/CSV)
- Algoritmo de matching de gastos
- Modo privacidad (UI Blur)

---

## Resumen

| Fase | Objetivo | Duración |
|---|---|---|
| Fase 1 — MVP | App funcional en portfolio | 6–8 semanas |
| Fase 2 — Producto real | Funcionalidades de pago | 4–5 semanas |
| Fase 3 — Lanzamiento | Usuarios reales + Stripe | 3–4 semanas |

> La Fase 3 solo tiene sentido atacarla si tras la Fase 2 decides seguir adelante con el lanzamiento.