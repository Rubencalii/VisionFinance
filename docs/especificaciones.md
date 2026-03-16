# VisionFinance 💰
### Plan Completo del Proyecto

---

## 📌 Descripción General

**VisionFinance** es una aplicación web de gestión de gastos inteligente orientada a autónomos, pequeñas empresas y usuarios domésticos. Su diferenciador principal es el **escaneo OCR de tickets mediante IA**, que automatiza el proceso de registro de gastos eliminando la introducción manual de datos.

**Objetivo del proyecto:** Portfolio profesional + posible lanzamiento como producto real.

---

## 🎯 Público Objetivo

| Perfil | Caso de uso principal |
|---|---|
| Autónomos / Freelancers | Control de gastos deducibles, exportación para gestoría |
| Pequeñas empresas | Gestión de tickets de empleados, control presupuestario |
| Uso personal / doméstico | Control de gastos del hogar, seguimiento mensual |

---

## ✨ Funcionalidades

### Fase 1 — MVP (Portfolio)

| Funcionalidad | Descripción | Prioridad |
|---|---|---|
| **Autenticación** | Registro e inicio de sesión seguro | 🔴 Must |
| **Escaneo OCR con IA** | Subir foto de ticket → la IA extrae comercio, fecha, base imponible, IVA y total | 🔴 Must |
| **Categorización automática** | Asigna categoría por palabras clave (ej. "Gasolinera" → Transporte) | 🔴 Must |
| **Listado y búsqueda** | Buscar tickets por comercio o rango de fechas | 🔴 Must |
| **Dashboard de estadísticas** | Gráficos mensuales de gastos por categoría | 🔴 Must |
| **Configuración API Key** | El usuario introduce su propia API Key de Anthropic | 🔴 Must |

### Fase 2 — Producto Real

| Funcionalidad | Descripción | Prioridad |
|---|---|---|
| **Gestión de presupuestos** | Límite por categoría + alertas al superarlo | 🟡 Alta |
| **Exportación CSV/PDF** | Resumen trimestral para gestoría (ideal para modelo 303) | 🟡 Alta |
| **Estados del ticket** | Pendiente / Revisado / Enviado a gestoría | 🟡 Media |
| **Detección de duplicados** | Alerta si se sube el mismo ticket dos veces | 🟡 Media |
| **Multimoneda** | Soporte EUR/USD para gastos en viajes | 🟢 Nice to have |

### Fase 3 — Lanzamiento (Comercialización)

| Funcionalidad | Descripción | Prioridad |
|---|---|---|
| **Suscripciones Stripe** | Pagos para planes Pro / Business | 🟡 Alta |
| **Límites de uso** | Control de escaneos según plan | 🟡 Alta |
| **Onboarding** | Guía interactiva para nuevos usuarios | 🟢 Media |

### Fase 4 — Optimización e Inteligencia (Futuro)

| Funcionalidad | Descripción | Prioridad |
|---|---|---|
| **Smart Advisor (IA)** | Chatbot para consultas sobre finanzas personales | 🟡 Media |
| **Modelos Fiscales** | Generación de borradores de impuestos (303, 130) | 🟡 Media |
| **Conciliación Bancaria** | Matching entre extracto PDF y tickets subidos | 🟢 Baja |
| **PWA / App Móvil** | Capacidad offline y acceso a cámara directo | 🟡 Media |
| **Búsqueda Semántica** | Agrupación inteligente de gastos por contexto | 🟢 Baja |
| **Modo Privacidad** | Interfaz con datos sensibles ocultos (Blur mode) | 🟢 Baja |

---

## 🛠️ Stack Tecnológico

### Frontend
- **React + Vite** — framework principal
- **TailwindCSS + shadcn/ui** — componentes de UI profesionales
- **Recharts** — gráficos del dashboard
- **React Query** — gestión de estado del servidor

### Backend
- **Node.js + Express** — servidor de la API
- **PostgreSQL** — base de datos principal
- **Prisma** — ORM
- **Supabase** — auth + storage de imágenes + base de datos (plan gratuito)

### IA / OCR
- **Claude API (Anthropic) con visión** — extracción de datos de tickets
- La API Key la aporta el usuario (ver sección de seguridad)

### Infraestructura
- **Supabase** — autenticación, almacenamiento y base de datos
- **Vercel** — despliegue del frontend
- **Railway / Render** — despliegue del backend Node.js

---

## 🏗️ Arquitectura

```
Usuario
   │
   ▼
React (Vite)  ──────────────────────────────────────────┐
   │                                                      │
   │ REST API                                             │ Supabase Auth
   ▼                                                      │
Node.js / Express                                         │
   ├── /auth          ◄── Supabase Auth ◄─────────────────┘
   ├── /tickets        → PostgreSQL (Prisma)
   ├── /ocr            → Claude API Vision (key del usuario)
   ├── /stats          → Queries agregadas
   ├── /budgets        → PostgreSQL
   └── /export         → PDF/CSV generator
```

---

## 🗄️ Modelo de Base de Datos

```sql
-- Usuarios
users
  id           UUID PRIMARY KEY
  email        VARCHAR UNIQUE NOT NULL
  name         VARCHAR
  api_key_enc  TEXT              -- API Key cifrada con AES-256
  created_at   TIMESTAMP

-- Tickets / Gastos
tickets
  id           UUID PRIMARY KEY
  user_id      UUID REFERENCES users(id)
  image_url    TEXT              -- URL en Supabase Storage
  merchant     VARCHAR           -- Nombre del comercio
  date         DATE              -- Fecha del ticket
  subtotal     DECIMAL(10,2)     -- Base imponible
  vat          DECIMAL(10,2)     -- IVA
  total        DECIMAL(10,2)     -- Total
  category     VARCHAR
  status       ENUM('pending', 'reviewed', 'sent')
  notes        TEXT
  created_at   TIMESTAMP

-- Categorías
categories
  id           UUID PRIMARY KEY
  name         VARCHAR
  color        VARCHAR           -- Hex color para UI
  icon         VARCHAR           -- Icono
  keywords     TEXT[]            -- Palabras clave para categorización

-- Presupuestos
budgets
  id           UUID PRIMARY KEY
  user_id      UUID REFERENCES users(id)
  category_id  UUID REFERENCES categories(id)
  amount       DECIMAL(10,2)
  period       ENUM('monthly', 'quarterly')
  start_date   DATE
```

---

## 🤖 Flujo OCR — El Momento "Wow"

Este es el flujo estrella de la aplicación:

```
1. Usuario arrastra o sube foto del ticket
        ↓
2. Frontend muestra preview + spinner "Analizando ticket..."
        ↓
3. Backend recibe imagen → llama a Claude Vision API
   usando la API Key del propio usuario
        ↓
4. Claude devuelve JSON estructurado:
   {
     merchant: "Repsol Gasolinera",
     date: "2025-03-15",
     subtotal: 45.45,
     vat: 9.55,
     total: 55.00,
     suggested_category: "Transporte"
   }
        ↓
5. Frontend muestra formulario PRE-RELLENADO
   para que el usuario confirme o corrija
        ↓
6. Usuario revisa y guarda ✅
```

> **⚠️ El paso 5 es clave** — siempre dejar que el humano confirme los datos. Genera confianza y cubre posibles errores del OCR.

---

## 🔑 Sistema de API Key — Modelo "Bring Your Own Key"

El usuario aporta su propia API Key de Anthropic. Esto significa que **los costes de la IA van a su cuenta, no a la tuya**.

### Flujo de configuración

```
1. Usuario accede a "Configuración" en la app
2. Introduce su API Key de Anthropic (sk-ant-...)
3. El backend la cifra con AES-256 y la guarda en BD
4. En cada escaneo, el backend descifra la key y la usa para llamar a Claude
5. El frontend nunca ve la key en texto plano
```

### UI de configuración

```
🔑 Tu API Key de Anthropic
[ sk-ant-••••••••••••••••••••••• ]  [Cambiar]

✅ Key válida · Conectada a tu cuenta Anthropic

→ ¿Dónde conseguir tu API Key? console.anthropic.com
```

### Reglas de seguridad (críticas)

- ✅ **Cifrado AES-256** antes de guardar en base de datos
- ✅ **Nunca se envía al frontend** — el cliente solo sabe si existe o no
- ✅ **Solo se usa en el backend** — las llamadas a Claude las hace el servidor
- ❌ **Nunca en texto plano** en base de datos, logs ni variables de entorno del cliente

---

## 💡 Lo Que Hará Destacar el Portfolio

Tres cosas concretas que impresionan a recruiters y clientes:

1. **Demo en vivo con ticket real** — que se vea el OCR funcionando en tiempo real, con el formulario pre-rellenado apareciendo automáticamente.

2. **Diseño cuidado** — shadcn/ui con paleta azul/verde estilo fintech, dark mode opcional, responsive completo.

3. **README técnico** — explicar las decisiones de arquitectura: por qué "Bring Your Own Key", por qué Supabase, cómo se cifra la API Key. Demuestra pensamiento de producto, no solo código.

---

## 📅 Hoja de Ruta Sugerida

```
Semana 1-2   Setup del proyecto, autenticación, estructura BD
Semana 3-4   Subida de tickets + integración OCR con Claude
Semana 5     Dashboard y gráficos
Semana 6     Categorización automática + búsqueda
Semana 7     Pulido de UI/UX + responsive
Semana 8     Deploy, README técnico, preparar demo
─────────────────────────────────────────
Semana 9+    Fase 2: presupuestos, exportación, duplicados
```

---

## 📁 Estructura del Proyecto

```
visionfinance/
├── frontend/                  # React + Vite
│   ├── src/
│   │   ├── components/        # Componentes reutilizables
│   │   ├── pages/             # Vistas principales
│   │   ├── hooks/             # Custom hooks (React Query)
│   │   └── lib/               # Utilidades y configuración
│   └── package.json
│
├── backend/                   # Node.js + Express
│   ├── src/
│   │   ├── routes/            # /auth /tickets /ocr /stats /export
│   │   ├── controllers/       # Lógica de negocio
│   │   ├── middleware/        # Auth, validación
│   │   ├── services/          # Claude API, cifrado, exportación
│   │   └── prisma/            # Schema y migraciones
│   └── package.json
│
└── README.md                  # Documentación técnica del proyecto
```

---

*Documento generado como referencia del proyecto VisionFinance*
*Stack: React + Node.js | IA: Claude Vision API | BD: PostgreSQL + Supabase*