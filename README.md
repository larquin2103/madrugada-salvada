# 🌙 Madrugada Salvada - Quiz Diagnóstico 3AM

Quiz de diagnóstico interactivo para identificar la causa específica de los despertares a las 3AM.

## 📋 Características

- ✅ Quiz interactivo de 5 preguntas
- ✅ 4 perfiles de diagnóstico personalizados
- ✅ Sistema de leads con seguimiento de secuencia
- ✅ Envío de emails con diagnóstico
- ✅ Integración con Make (webhooks)
- ✅ Redirección automática para usuarios recurrentes

## 🚀 Despliegue en Netlify

### 1. Configurar Base de Datos

**Opción A: Turso (SQLite en la nube - Recomendado)**
```bash
# Instalar turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# Crear base de datos
turso db create madrugada-salvada

# Obtener URL de conexión
turso db show madrugada-salvada
```

**Opción B: Supabase (PostgreSQL gratuito)**
1. Ve a [supabase.com](https://supabase.com)
2. Crea un nuevo proyecto
3. Copia la URL de conexión desde Settings > Database

**Opción C: PlanetScale (MySQL serverless)**
1. Ve a [planetscale.com](https://planetscale.com)
2. Crea una base de datos
3. Copia las credenciales

### 2. Variables de Entorno en Netlify

Ve a Site Settings > Environment Variables y agrega:

```
DATABASE_URL=tu-url-de-base-de-datos
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-app-password-de-gmail
EMAIL_FROM=noreply@madrugadasalvada.com
MAKE_WEBHOOK_URL=https://hook.us2.make.com/tu-webhook
NEXT_PUBLIC_APP_URL=https://tu-sitio.netlify.app
```

### 3. Configurar Gmail SMTP

1. Ve a tu cuenta de Google
2. Activa la verificación en 2 pasos
3. Ve a Security > App passwords
4. Genera una nueva contraseña de aplicación
5. Usa esa contraseña en `SMTP_PASS`

## 📦 Instalación Local

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/madrugada-salvada.git
cd madrugada-salvada

# Instalar dependencias
bun install

# Configurar variables de entorno
cp .env.example .env
# Edita .env con tus valores

# Inicializar base de datos
bun run db:push

# Ejecutar en desarrollo
bun run dev
```

## 🔧 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `bun run dev` | Inicia servidor de desarrollo |
| `bun run build` | Construye para producción |
| `bun run start` | Inicia servidor de producción |
| `bun run db:push` | Sincroniza schema con base de datos |
| `bun run db:generate` | Genera cliente de Prisma |

## 📊 Flujo del Quiz

1. **Primera visita** → Quiz → Email → Secuencia=1, Estado="nuevo"
2. **Segunda visita** → Quiz → Email → Secuencia=2, Estado="activo"
3. **Tercera visita** → Redirección directa a página de ventas

## 📧 Webhook de Make

El sistema envía datos a Make cuando un usuario completa el quiz:

```json
{
  "email": "usuario@email.com",
  "profile": "A",
  "profileName": "🧠 La Mente Que No Para",
  "answers": {
    "1": "3_4",
    "2": "pensamientos",
    "3": "no",
    "4": "si_bucle",
    "5": "40_49"
  },
  "diagnosisId": "cm123abc",
  "secuencia": 1,
  "estado": "nuevo",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## 🔐 Seguridad

- Las variables de entorno sensibles no se incluyen en el repositorio
- Los emails se validan antes de procesar
- Los webhooks usan HTTPS

## 📱 Soporte

Para soporte técnico, contacta al equipo de desarrollo.

---

Desarrollado con ❤️ para ayudar a las personas a dormir mejor.
