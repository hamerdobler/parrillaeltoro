// Vercel Serverless Function (Node runtime).
// Recibe una reserva desde /reservas, calcula un número correlativo de reserva
// (reservas de las últimas 12h) usando Upstash Redis (REST) y envía un correo con
// Resend (REST). Sin dependencias: usa el fetch nativo del runtime de Node.
//
// Variables de entorno necesarias (configurar en Vercel → Settings → Environment Variables):
//   RESEND_API_KEY            (obligatoria para el envío de correo)
//   UPSTASH_REDIS_REST_URL    (obligatoria para el número de reserva)
//   UPSTASH_REDIS_REST_TOKEN  (obligatoria para el número de reserva)
// Opcionales:
//   RESERVAS_TO    destinatario   (default: hamerfelipe7@gmail.com)
//   RESERVAS_FROM  remitente      (default: PARRILLA EL TORO <onboarding@resend.dev>)

module.exports = async (req, res) => {
    // Health check: GET informa qué credenciales están presentes (sólo booleanos,
    // nunca los valores). Útil para verificar la configuración sin acceder al panel.
    if (req.method === 'GET') {
        res.status(200).json({
            ok: true,
            env: {
                resend: !!process.env.RESEND_API_KEY,
                redisUrl: !!(process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL),
                redisToken: !!(process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN)
            }
        });
        return;
    }

    if (req.method !== 'POST') {
        res.status(405).json({ ok: false, error: 'method_not_allowed' });
        return;
    }

    // Vercel parsea el body JSON automáticamente; por las dudas contemplamos string.
    let body = req.body;
    if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch (e) { body = {}; }
    }
    const { nombre, telefono, fecha, horario } = body || {};

    if (!nombre || !telefono || !fecha || !horario) {
        res.status(400).json({ ok: false, error: 'campos_incompletos' });
        return;
    }

    // 1) Número de reserva correlativo (reservas en las últimas 12h). Best-effort.
    let numeroReserva = 1;
    try {
        numeroReserva = await calcularNumeroReserva();
    } catch (err) {
        console.error('[reservar] Error al calcular el número de reserva:', err);
        // Seguimos con el fallback (numeroReserva = 1) para no bloquear el correo.
    }

    // 2) Armar datos del correo
    const fechaFmt = formatearFecha(fecha);
    const telefonoWa = normalizarTelefono(telefono);
    const waMsg = `Hola, cómo estás? Te hablamos de Parrilla El Toro. Confirmás tu reserva del día ${fechaFmt} a las ${horario} hs?`;
    const waLink = `https://wa.me/${telefonoWa}?text=${encodeURIComponent(waMsg)}`;

    // 3) Enviar correo con Resend. Si falla, registramos y respondemos ok igual (no bloquea la UX).
    try {
        await enviarCorreo({ numeroReserva, nombre, fechaFmt, horario, telefono, waLink });
        res.status(200).json({ ok: true, numeroReserva });
    } catch (err) {
        console.error('[reservar] Error al enviar el correo:', err);
        res.status(200).json({ ok: false, numeroReserva, error: 'mail_failed' });
    }
};

// --- Número de reserva: sorted set en Upstash Redis vía REST ---
async function calcularNumeroReserva() {
    // Aceptamos ambas convenciones de nombres: la integración Upstash del Marketplace
    // (UPSTASH_REDIS_REST_*) y la de Vercel KV nativa (KV_REST_API_*).
    const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
    if (!url || !token) {
        throw new Error('Faltan credenciales de Redis (UPSTASH_REDIS_REST_URL/TOKEN o KV_REST_API_URL/TOKEN)');
    }

    const now = Date.now();
    const cutoff12h = now - 12 * 60 * 60 * 1000;   // ventana de conteo
    const cutoffPurga = now - 24 * 60 * 60 * 1000; // limpiamos lo más viejo que 24h
    const member = `${now}-${Math.random().toString(36).slice(2, 8)}`;

    // Pipeline: agrega la reserva actual, purga viejas y cuenta las de las últimas 12h.
    const commands = [
        ['ZADD', 'reservas', now, member],
        ['ZREMRANGEBYSCORE', 'reservas', '-inf', cutoffPurga],
        ['ZCOUNT', 'reservas', cutoff12h, '+inf']
    ];

    const resp = await fetch(`${url}/pipeline`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(commands)
    });

    if (!resp.ok) {
        throw new Error(`Upstash respondió ${resp.status}: ${await resp.text()}`);
    }

    const data = await resp.json();
    // data: [{result:...}, {result:...}, {result: <count>}]
    const count = Number(data && data[2] && data[2].result);
    // El ZCOUNT ya incluye la reserva recién agregada => equivale a (previas + 1).
    return Number.isFinite(count) && count > 0 ? count : 1;
}

// --- Envío de correo con Resend vía REST ---
async function enviarCorreo({ numeroReserva, nombre, fechaFmt, horario, telefono, waLink }) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        throw new Error('Falta RESEND_API_KEY');
    }
    const from = process.env.RESERVAS_FROM || 'PARRILLA EL TORO <onboarding@resend.dev>';
    const to = process.env.RESERVAS_TO || 'hamerfelipe7@gmail.com';

    const text = [
        `Reserva #${numeroReserva}`,
        `Nombre: ${nombre}`,
        `Fecha: ${fechaFmt}`,
        `Horario: ${horario}`,
        `Teléfono: ${telefono}`,
        ``,
        `Confirmar por WhatsApp: ${waLink}`
    ].join('\n');

    const html = `
    <div style="font-family: Arial, Helvetica, sans-serif; background:#13140f; color:#e4e3d9; padding:32px; max-width:560px; margin:0 auto;">
      <h1 style="font-size:22px; letter-spacing:2px; color:#ffb59b; margin:0 0 24px;">PARRILLA EL TORO</h1>
      <h2 style="font-size:18px; margin:0 0 16px; color:#e4e3d9;">Reserva #${numeroReserva}</h2>
      <table style="font-size:15px; line-height:1.8; border-collapse:collapse;">
        <tr><td style="color:#8e9192; padding-right:16px;">Nombre</td><td>${escapeHtml(nombre)}</td></tr>
        <tr><td style="color:#8e9192; padding-right:16px;">Fecha</td><td>${escapeHtml(fechaFmt)}</td></tr>
        <tr><td style="color:#8e9192; padding-right:16px;">Horario</td><td>${escapeHtml(horario)} hs</td></tr>
        <tr><td style="color:#8e9192; padding-right:16px;">Teléfono</td><td>${escapeHtml(telefono)}</td></tr>
      </table>
      <p style="margin:28px 0 0;">
        <a href="${waLink}" style="display:inline-block; background:#ffb59b; color:#5b1a00; text-decoration:none; padding:12px 24px; font-weight:bold; letter-spacing:1px;">Confirmar por WhatsApp</a>
      </p>
    </div>`;

    const resp = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            from,
            to,
            subject: 'Reserva a Confirmar',
            text,
            html
        })
    });

    if (!resp.ok) {
        throw new Error(`Resend respondió ${resp.status}: ${await resp.text()}`);
    }
    return resp.json();
}

// --- Helpers ---

// 'YYYY-MM-DD' -> 'DD/MM/YYYY'
function formatearFecha(fecha) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(fecha));
    return m ? `${m[3]}/${m[2]}/${m[1]}` : String(fecha);
}

// Deja solo dígitos y agrega el código de país de Argentina (54) si no está.
function normalizarTelefono(telefono) {
    let digits = String(telefono).replace(/\D/g, '');
    if (digits.startsWith('00')) digits = digits.slice(2); // prefijo internacional 00
    if (!digits.startsWith('54')) digits = '54' + digits;
    return digits;
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}
