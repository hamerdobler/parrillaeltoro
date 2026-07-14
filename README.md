# Parrilla El Toro — Landing Page

Landing page estática para **Parrilla El Toro** (Tradición y Fuego).

## Stack
- HTML estático autocontenido (`index.html`)
- [Tailwind CSS](https://tailwindcss.com/) vía CDN
- Google Fonts: Bebas Neue + Hanken Grotesk

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
