# Parrilla El Toro — Landing Page

Landing page estática para **Parrilla El Toro** (Tradición y Fuego).

## Stack
- HTML estático autocontenido (`index.html`, `carta.html`, `reservas.html`)
- [Tailwind CSS](https://tailwindcss.com/) vía CDN
- Google Fonts: Bebas Neue + Hanken Grotesk
- Una Serverless Function de Vercel (`api/reservar.js`, runtime Node, sin dependencias)
  para el envío del correo de reservas

## Reservas por correo (`/api/reservar`)
Al enviar el formulario de `/reservas`, el frontend hace `POST /api/reservar`. La función:
1. Registra el timestamp de la reserva en **Upstash Redis** (sorted set) y calcula un
   número de reserva correlativo = reservas de las últimas 12 h.
2. Envía un correo con **Resend** (asunto `Reserva a Confirmar`) con los datos y un link
   de confirmación por WhatsApp.

El envío es *best-effort*: si falla, el usuario igual ve la confirmación en pantalla y el
error se registra con `console.error` (visible en Vercel → Deployment → Functions logs).

### Configuración requerida (variables de entorno)
Ver [`.env.example`](./.env.example). En Vercel → Project → Settings → Environment Variables:

| Variable | Servicio | Obligatoria |
|---|---|---|
| `RESEND_API_KEY` | [Resend](https://resend.com) | Sí (para el correo) |
| `UPSTASH_REDIS_REST_URL` | [Upstash](https://upstash.com) / Vercel KV | Sí (para el número) |
| `UPSTASH_REDIS_REST_TOKEN` | [Upstash](https://upstash.com) / Vercel KV | Sí (para el número) |
| `RESERVAS_TO` | destinatario (default `hamerfelipe7@gmail.com`) | No |
| `RESERVAS_FROM` | remitente (default `onboarding@resend.dev`) | No |

> Con el remitente de prueba `onboarding@resend.dev`, Resend sólo permite enviar a la
> casilla con la que te registraste hasta que verifiques un dominio propio.

## Desarrollo local
No requiere build. Con Node instalado:

```bash
npx serve .
```

O con el servidor incluido en PowerShell (Windows, sin dependencias):

```powershell
powershell -ExecutionPolicy Bypass -File .\serve.ps1 -Port 8125
# luego abrir http://localhost:8125
```

## Despliegue
Desplegada en [Vercel](https://vercel.com/) como sitio estático. Cada push a `main`
dispara un nuevo deploy automáticamente.

## Diseño
Ver [`DESIGN.md`](./DESIGN.md) para el sistema de diseño (paleta, tipografía, componentes).
