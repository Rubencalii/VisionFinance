# VisionFinance 💰

**VisionFinance** es una aplicación inteligente de gestión de gastos diseñada para autónomos y pequeñas empresas. Utiliza Inteligencia Artificial (Claude Vision API) para automatizar el registro de tickets y facturas mediante OCR, eliminando la necesidad de introducir datos manualmente.

## 🚀 Características Clave

- **Escaneo OCR con IA**: Sube una foto de tu ticket y la IA extraerá automáticamente el comercio, la fecha, la base imponible, el IVA y el total.
- **Categorización Inteligente**: Los gastos se clasifican automáticamente según palabras clave y el contexto del comercio.
- **Dashboard Visual**: Analiza tus finanzas con gráficos detallados de gastos por categoría y tiempo.
- **Gestión de Presupuestos**: Establece límites por categoría y recibe alertas cuando te acerques a ellos.
- **Exportación para Contabilidad**: Genera informes en CSV y PDF listos para enviar a tu gestoría.
- **Privacidad "Bring Your Own Key"**: Tú controlas tu presupuesto de IA usando tu propia clave de Anthropic de forma segura y cifrada.

## 🛠️ Stack Tecnológico

- **Frontend**: React + Vite, TailwindCSS, shadcn/ui, Recharts.
- **Backend**: Node.js + Express.
- **Base de Datos**: PostgreSQL + Prisma ORM.
- **Infraestructura**: Supabase (Auth & Storage), Vercel/Railway.
- **IA**: Anthropic Claude Vision API.

## 🏗️ Arquitectura del Proyecto

El proyecto sigue una estructura de monorepo (o carpetas separadas) que facilita el despliegue y mantenimiento:

- `/frontend`: Aplicación cliente en React.
- `/backend`: Servidor API y lógica de negocio.
- `/docs`: Documentación detallada del diseño y especificaciones.

## 🔒 Seguridad

La seguridad es nuestra prioridad. Las API Keys de Anthropic se cifran mediante **AES-256** antes de ser almacenadas en la base de datos y nunca se exponen al cliente.

## 📝 Roadmap

1. **Fase 1 (MVP)**: Core funcional, OCR y Dashboard básico.
2. **Fase 2 (Producto)**: Presupuestos, alertas y exportación profesional.
3. **Fase 3 (Lanzamiento)**: Modelo freemium, Stripe e internacionalización.

---
*Desarrollado con ❤️ para mejorar la salud financiera.*
