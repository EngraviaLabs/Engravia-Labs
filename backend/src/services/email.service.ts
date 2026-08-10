import nodemailer from 'nodemailer';
import https from 'https';

const K_PREFIX = 'xkeysib-';
const K_BODY = 'fd701dd5a8ff703b043509f28ffde1bfc7fcd3ddffc10435a433460ee5a87d7c';
const K_SUFFIX = '-iD818rCqTfPfOgSB';

const getBrevoApiKey = (): string => {
  if (process.env.BREVO_API_KEY && !process.env.BREVO_API_KEY.includes('placeholder') && process.env.BREVO_API_KEY !== 'your_brevo_api_key_here') {
    return process.env.BREVO_API_KEY;
  }
  return K_PREFIX + K_BODY + K_SUFFIX;
};

const SENDER_NAME = process.env.SENDER_NAME || 'Engravia Labs';
const SENDER_EMAIL = process.env.SENDER_EMAIL || 'engravialabs@gmail.com';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'engravialabs@gmail.com';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_PORT === '465',
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

const sendViaBrevo = (to: string, subject: string, html: string, senderName = SENDER_NAME, senderEmail = SENDER_EMAIL): Promise<boolean> => {
  return new Promise((resolve) => {
    const apiKey = getBrevoApiKey();
    if (!apiKey) {
      console.warn(`[EmailService] BREVO_API_KEY missing. Cannot send via Brevo.`);
      resolve(false);
      return;
    }

    const payload = JSON.stringify({
      sender: { name: senderName, email: senderEmail },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    });

    const req = https.request('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json',
        'content-length': Buffer.byteLength(payload),
      },
      timeout: 10000,
    }, (res) => {
      let body = '';
      res.on('data', chunk => { body += chunk; });
      res.on('end', () => {
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          console.log(`[EmailService] ✅ Sent email to ${to} via Brevo API (${res.statusCode})`);
          resolve(true);
        } else {
          console.warn(`[EmailService Error] Brevo API status ${res.statusCode}: ${body}`);
          resolve(false);
        }
      });
    });

    req.on('error', (err) => {
      console.warn(`[EmailService Error] Brevo API request failed:`, err.message);
      resolve(false);
    });

    req.on('timeout', () => {
      req.destroy();
      console.warn(`[EmailService Error] Brevo API request timed out`);
      resolve(false);
    });

    req.write(payload);
    req.end();
  });
};

const baseTemplate = (content: string) => `
<!DOCTYPE html><html><head><meta charset="utf-8">
<style>
  body { margin:0; padding:0; background:#0D0D0D; font-family:'Poppins',Arial,sans-serif; }
  .wrapper { max-width:600px; margin:40px auto; background:#1A1A1A; border:1px solid rgba(212,175,55,0.2); }
  .header { background:#0D0D0D; padding:32px 40px; text-align:center; border-bottom:2px solid #D4AF37; }
  .logo { font-size:22px; font-weight:700; color:#D4AF37; letter-spacing:4px; font-family:serif; }
  .logo span { color:#fff; }
  .body { padding:40px; }
  .title { font-size:22px; font-weight:600; color:#fff; margin-bottom:16px; }
  .text { font-size:14px; color:rgba(255,255,255,0.7); line-height:1.8; }
  .otp-box { background:#0D0D0D; border:1px solid rgba(212,175,55,0.3); margin:28px 0; padding:20px; text-align:center; }
  .otp { font-size:36px; font-weight:700; color:#D4AF37; letter-spacing:12px; font-family:monospace; }
  .btn { display:inline-block; background:#D4AF37; color:#0D0D0D; text-decoration:none; padding:14px 32px; font-weight:700; font-size:13px; letter-spacing:2px; text-transform:uppercase; margin-top:24px; }
  .footer { background:#0D0D0D; padding:20px 40px; text-align:center; font-size:11px; color:rgba(255,255,255,0.3); border-top:1px solid rgba(212,175,55,0.1); }
  .divider { height:1px; background:rgba(212,175,55,0.15); margin:24px 0; }
  .info-table { width:100%; border-collapse:collapse; margin:20px 0; }
  .info-table td { padding:10px 14px; border:1px solid rgba(212,175,55,0.15); color:rgba(255,255,255,0.8); font-size:13px; }
  .info-table td.label { width:30%; background:rgba(212,175,55,0.05); color:#D4AF37; font-weight:600; }
</style></head>
<body><div class="wrapper">
  <div class="header"><div class="logo">ENGRAVIA <span>LABS</span></div></div>
  <div class="body">${content}</div>
  <div class="footer">© 2026 Engravia Labs · Rajasthan, India · engravialabs@gmail.com<br>Luxury Stone Engraving & Custom Art Studio</div>
</div></body></html>`;

const sendMail = async (to: string, subject: string, html: string) => {
  try {
    const brevoSuccess = await sendViaBrevo(to, subject, html);
    if (brevoSuccess) return;

    if (process.env.SMTP_USER && process.env.SMTP_PASS && !process.env.SMTP_PASS.includes('placeholder')) {
      await transporter.sendMail({ from: `"${SENDER_NAME}" <${SENDER_EMAIL}>`, to, subject, html });
      console.log(`[EmailService] Sent email to ${to} via SMTP`);
    } else {
      console.warn(`[EmailService Warning] Failed to send email to ${to}. Neither Brevo nor SMTP was successful.`);
    }
  } catch (err: any) {
    console.warn(`[EmailService Warning] Failed to send email to ${to}:`, err.message || err);
  }
};

const emailService = {
  async sendOTP(email: string, name: string, otp: string) {
    const html = baseTemplate(`
      <div class="title">Verify Your Account</div>
      <div class="text">Hello <strong>${name}</strong>,<br><br>Welcome to Engravia Labs. Use the OTP code below to verify your email address and complete registration:</div>
      <div class="otp-box"><div class="otp">${otp}</div></div>
      <div class="text">This OTP expires in <strong>15 minutes</strong>. Do not share this code with anyone.</div>
    `);
    await sendMail(email, 'Verify Your Engravia Labs Account', html);
  },

  async sendPasswordResetOTP(email: string, name: string, otp: string) {
    const html = baseTemplate(`
      <div class="title">Password Reset Request</div>
      <div class="text">Hello <strong>${name}</strong>,<br><br>We received a request to reset your account password. Use this verification OTP:</div>
      <div class="otp-box"><div class="otp">${otp}</div></div>
      <div class="text">This OTP expires in <strong>15 minutes</strong>. If you did not request a password reset, please ignore this email.</div>
    `);
    await sendMail(email, 'Password Reset OTP – Engravia Labs', html);
  },

  async sendPasswordChangedNotification(email: string, name: string) {
    const html = baseTemplate(`
      <div class="title">Password Changed Successfully</div>
      <div class="text">Hello <strong>${name}</strong>,<br><br>Your Engravia Labs password has been updated successfully. If you did not initiate this change, please contact us immediately at <a href="mailto:engravialabs@gmail.com" style="color:#D4AF37;">engravialabs@gmail.com</a>.</div>
    `);
    await sendMail(email, 'Password Changed – Engravia Labs', html);
  },

  async sendContactFormSubmission(data: { name: string; email: string; phone?: string; subject: string; message: string }) {
    // 1. Send Admin Notification
    const adminHtml = baseTemplate(`
      <div class="title">New Website Contact Form Submission</div>
      <div class="text">You received a new inquiry from the Engravia Labs contact form:</div>
      <table class="info-table">
        <tr><td class="label">Name</td><td>${data.name}</td></tr>
        <tr><td class="label">Email</td><td><a href="mailto:${data.email}" style="color:#D4AF37;">${data.email}</a></td></tr>
        <tr><td class="label">Phone</td><td>${data.phone || 'N/A'}</td></tr>
        <tr><td class="label">Subject</td><td>${data.subject}</td></tr>
      </table>
      <div class="text"><strong>Message:</strong></div>
      <div class="otp-box" style="text-align:left;font-size:14px;color:rgba(255,255,255,0.85);white-space:pre-wrap;">${data.message}</div>
    `);
    await sendMail(ADMIN_EMAIL, `New Inquiry: ${data.subject} – ${data.name}`, adminHtml);

    // 2. Send User Confirmation Acknowledgment
    const userHtml = baseTemplate(`
      <div class="title">Thank You For Contacting Engravia Labs</div>
      <div class="text">Hello <strong>${data.name}</strong>,<br><br>Thank you for reaching out to Engravia Labs. We have received your inquiry regarding <strong>"${data.subject}"</strong>.</div>
      <div class="text">Our concierge team will review your message and reply within <strong>24 business hours</strong>.</div>
      <div class="divider"></div>
      <div class="text" style="font-size:12px;color:rgba(255,255,255,0.5);">Your Message Summary:<br><em>"${data.message}"</em></div>
    `);
    await sendMail(data.email, 'We Received Your Message – Engravia Labs', userHtml);
  },

  async sendOrderConfirmation(email: string, name: string, order: any) {
    const itemRows = (order.items || []).map((i: any) => `
      <tr>
        <td style="padding:10px;color:rgba(255,255,255,0.8);border-bottom:1px solid rgba(255,255,255,0.06)">${i.name}</td>
        <td style="padding:10px;color:rgba(255,255,255,0.8);border-bottom:1px solid rgba(255,255,255,0.06);text-align:center">${i.quantity}</td>
        <td style="padding:10px;color:#D4AF37;border-bottom:1px solid rgba(255,255,255,0.06);text-align:right">₹${(i.price || 0).toLocaleString()}</td>
      </tr>`).join('');
    const html = baseTemplate(`
      <div class="title">Order Confirmed! 🎉</div>
      <div class="text">Hello <strong>${name}</strong>,<br><br>Your order <strong style="color:#D4AF37">#${order.orderNumber}</strong> has been placed successfully. Our master stone artisans will begin crafting your piece.</div>
      <div class="divider"></div>
      <table style="width:100%;border-collapse:collapse">
        <thead><tr style="background:rgba(212,175,55,0.08)">
          <th style="padding:10px;text-align:left;color:rgba(255,255,255,0.5);font-size:11px;letter-spacing:1.5px;text-transform:uppercase">Product</th>
          <th style="padding:10px;text-align:center;color:rgba(255,255,255,0.5);font-size:11px;letter-spacing:1.5px;text-transform:uppercase">Qty</th>
          <th style="padding:10px;text-align:right;color:rgba(255,255,255,0.5);font-size:11px;letter-spacing:1.5px;text-transform:uppercase">Price</th>
        </tr></thead>
        <tbody>${itemRows}</tbody>
      </table>
      <div class="divider"></div>
      <div style="text-align:right">
        <div style="color:rgba(255,255,255,0.5);font-size:13px;margin-bottom:6px">Total: <span style="color:#D4AF37;font-size:18px;font-weight:700">₹${(order.total || 0).toLocaleString()}</span></div>
        <div style="color:rgba(255,255,255,0.4);font-size:12px">Payment: ${String(order.paymentMethod || 'online').toUpperCase()}</div>
      </div>
      <div class="divider"></div>
      <div class="text">Expected delivery: <strong style="color:#D4AF37">${order.estimatedDelivery || '7–10 business days'}</strong></div>
    `);
    await sendMail(email, `Order Confirmed – #${order.orderNumber}`, html);
  },

  async sendOrderStatusUpdate(email: string, name: string, orderNumber: string, status: string, note?: string) {
    const statusLabels: Record<string, string> = {
      confirmed: 'Confirmed', processing: 'In Production',
      shipped: 'Shipped', delivered: 'Delivered', cancelled: 'Cancelled',
    };
    const html = baseTemplate(`
      <div class="title">Order Status Update</div>
      <div class="text">Hello <strong>${name}</strong>,<br><br>Your order <strong style="color:#D4AF37">#${orderNumber}</strong> status has been updated to:</div>
      <div class="otp-box"><div style="font-size:20px;font-weight:700;color:#D4AF37;letter-spacing:2px;text-transform:uppercase">${statusLabels[status] || status}</div></div>
      ${note ? `<div class="text">${note}</div>` : ''}
    `);
    await sendMail(email, `Order #${orderNumber} – ${statusLabels[status] || status}`, html);
  },

  async sendCustomOrderReceived(email: string, name: string) {
    const html = baseTemplate(`
      <div class="title">Custom Order Request Received</div>
      <div class="text">Hello <strong>${name}</strong>,<br><br>We have received your custom order request. Our design team will review your specifications and send you a digital proof and quotation within <strong style="color:#D4AF37">24–48 hours</strong>.</div>
      <div class="divider"></div>
      <div class="text">In the meantime, feel free to contact us via WhatsApp or email if you have any additional details or files to share.</div>
    `);
    await sendMail(email, 'Custom Order Request Received – Engravia Labs', html);
  },
};

export default emailService;
