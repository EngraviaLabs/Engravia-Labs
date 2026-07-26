import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_PORT === '465',
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

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
</style></head>
<body><div class="wrapper">
  <div class="header"><div class="logo">ENGRAVIA <span>LABS</span></div></div>
  <div class="body">${content}</div>
  <div class="footer">© 2025 Engravia Labs · Rajasthan, India · hello@engravialabs.com<br>You are receiving this because you have an account with us.</div>
</div></body></html>`;

const sendMail = async (to: string, subject: string, html: string) => {
  await transporter.sendMail({ from: `"Engravia Labs" <${process.env.SMTP_USER}>`, to, subject, html });
};

const emailService = {
  async sendOTP(email: string, name: string, otp: string) {
    const html = baseTemplate(`
      <div class="title">Verify Your Account</div>
      <div class="text">Hello <strong>${name}</strong>,<br><br>Welcome to Engravia Labs. Use the OTP below to verify your account:</div>
      <div class="otp-box"><div class="otp">${otp}</div></div>
      <div class="text">This OTP expires in <strong>10 minutes</strong>. Do not share it with anyone.</div>
    `);
    await sendMail(email, 'Verify Your Engravia Labs Account', html);
  },

  async sendPasswordResetOTP(email: string, name: string, otp: string) {
    const html = baseTemplate(`
      <div class="title">Password Reset Request</div>
      <div class="text">Hello <strong>${name}</strong>,<br><br>We received a request to reset your password. Use this OTP:</div>
      <div class="otp-box"><div class="otp">${otp}</div></div>
      <div class="text">This OTP expires in <strong>15 minutes</strong>. If you didn't request this, ignore this email.</div>
    `);
    await sendMail(email, 'Password Reset OTP – Engravia Labs', html);
  },

  async sendPasswordChangedNotification(email: string, name: string) {
    const html = baseTemplate(`
      <div class="title">Password Changed Successfully</div>
      <div class="text">Hello <strong>${name}</strong>,<br><br>Your password has been updated successfully. If you didn't make this change, please contact us immediately at <a href="mailto:hello@engravialabs.com" style="color:#D4AF37;">hello@engravialabs.com</a></div>
    `);
    await sendMail(email, 'Password Changed – Engravia Labs', html);
  },

  async sendOrderConfirmation(email: string, name: string, order: any) {
    const itemRows = order.items.map((i: any) => `
      <tr>
        <td style="padding:10px;color:rgba(255,255,255,0.8);border-bottom:1px solid rgba(255,255,255,0.06)">${i.name}</td>
        <td style="padding:10px;color:rgba(255,255,255,0.8);border-bottom:1px solid rgba(255,255,255,0.06);text-align:center">${i.quantity}</td>
        <td style="padding:10px;color:#D4AF37;border-bottom:1px solid rgba(255,255,255,0.06);text-align:right">₹${i.price.toLocaleString()}</td>
      </tr>`).join('');
    const html = baseTemplate(`
      <div class="title">Order Confirmed! 🎉</div>
      <div class="text">Hello <strong>${name}</strong>,<br><br>Your order <strong style="color:#D4AF37">#${order.orderNumber}</strong> has been placed successfully. Our artisans will begin crafting your pieces shortly.</div>
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
        <div style="color:rgba(255,255,255,0.5);font-size:13px;margin-bottom:6px">Total: <span style="color:#D4AF37;font-size:18px;font-weight:700">₹${order.total.toLocaleString()}</span></div>
        <div style="color:rgba(255,255,255,0.4);font-size:12px">Payment: ${order.paymentMethod.toUpperCase()}</div>
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
      <div class="text">Hello <strong>${name}</strong>,<br><br>We have received your custom order request. Our design team will review it and get back to you with a quotation within <strong style="color:#D4AF37">24–48 hours</strong>.</div>
      <div class="divider"></div>
      <div class="text">In the meantime, feel free to reach out to us on WhatsApp or email if you have any questions.</div>
    `);
    await sendMail(email, 'Custom Order Request Received – Engravia Labs', html);
  },
};

export default emailService;
