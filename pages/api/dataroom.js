
import nodemailer from "nodemailer";

// Simple in-memory cooldown per IP
const RATE_WINDOW_MS = 30_000; // 30s
const ipCache = new Map();

function ok(res, extra={}) { return res.status(200).json({ ok: true, ...extra }); }
function bad(res, msg, extra={}) { return res.status(400).json({ ok: false, error: msg, ...extra }); }

export default async function handler(req, res) {
  if (req.method !== "POST") return bad(res, "Invalid method");
  const ip = (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "").toString();
  const now = Date.now();
  const last = ipCache.get(ip) || 0;
  if (now - last < RATE_WINDOW_MS) return bad(res, "Please wait before submitting again.");
  ipCache.set(ip, now);

  const { name="", email="", company="", message="", honey="" } = req.body || {};
  if (honey) return ok(res, { ignored: true }); // bot

  if (!name || !email || !message) return bad(res, "Missing required fields");

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE, CONTACT_TO } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !CONTACT_TO) {
    // Graceful fallback: tell client to use mailto
    return bad(res, "Email service not configured", { mailto: true });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: SMTP_SECURE === "true",
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    const subject = "Buswell Biochar — Data Room Request";
    const html = `<p><b>Data room request</b></p><p><b>Name:</b> ${name}<br/><b>Email:</b> ${email}<br/><b>Company:</b> ${company || '-'}<br/><b>Use case:</b><br/>${message.replace(/\n/g,'<br/>')}</p>`;

    await transporter.sendMail({
      from: SMTP_USER,
      to: CONTACT_TO,
      replyTo: email,
      subject,
      html,
    });

    return ok(res);
  } catch (e) {
    return bad(res, e?.message || "Mailer error");
  }
}
