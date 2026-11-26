const nodemailer = require('nodemailer');

const { whatsappHref: businessWhatsappHref } = require('./whatsapp');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_APP_PASSWORD,
  },
});

const sendEnquiryNotification = async ({ name, email, phone, message }) => {
  const adminEmail = process.env.NOTIFY_EMAIL || process.env.SMTP_EMAIL;

  const mailOptions = {
    from: `"Intam Solutions Website" <${process.env.SMTP_EMAIL}>`,
    to: adminEmail,
    subject: `📩 New Enquiry from ${name} – Intam Solutions`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;">
        <!-- Header -->
        <div style="background:linear-gradient(135deg,#1e3a8a,#2563eb);padding:24px 28px;">
          <h2 style="color:#fff;margin:0;font-size:20px;">🛡️ New Customer Enquiry</h2>
          <p style="color:#bfdbfe;margin:4px 0 0;font-size:13px;">Intam Solutions – Smart Security & Automation</p>
        </div>

        <!-- Body -->
        <div style="padding:24px 28px;background:#fff;">
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <tr>
              <td style="padding:8px 0;color:#6b7280;font-weight:600;width:110px;">Name</td>
              <td style="padding:8px 0;color:#111827;font-weight:700;">${name}</td>
            </tr>
            <tr style="border-top:1px solid #f3f4f6;">
              <td style="padding:8px 0;color:#6b7280;font-weight:600;">Email</td>
              <td style="padding:8px 0;"><a href="mailto:${email}" style="color:#2563eb;">${email}</a></td>
            </tr>
            <tr style="border-top:1px solid #f3f4f6;">
              <td style="padding:8px 0;color:#6b7280;font-weight:600;">Phone</td>
              <td style="padding:8px 0;color:#111827;">${phone || '—'}</td>
            </tr>
            <tr style="border-top:1px solid #f3f4f6;">
              <td style="padding:8px 0;color:#6b7280;font-weight:600;vertical-align:top;">Message</td>
              <td style="padding:8px 0;color:#111827;line-height:1.6;">${message}</td>
            </tr>
          </table>

          <!-- CTA buttons -->
          <div style="margin-top:24px;display:flex;gap:12px;flex-wrap:wrap;">
            <a href="mailto:${email}"
               style="background:#2563eb;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:700;font-size:13px;">
              📧 Reply via Email
            </a>
            ${phone ? `<a href="https://wa.me/${phone.replace(/\D/g,'')}"
               style="background:#25d366;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:700;font-size:13px;">
              💬 WhatsApp
            </a>` : ''}
          </div>
        </div>

        <!-- Footer -->
        <div style="background:#f9fafb;padding:14px 28px;border-top:1px solid #e5e7eb;font-size:12px;color:#9ca3af;">
          This email was sent automatically from the Intam Solutions website contact form.<br/>
          Received: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
  console.log(`📧 Enquiry notification sent to ${adminEmail}`);
};

const sendCustomerAutoReply = async ({ name, email }) => {
  const mailOptions = {
    from: `"Intam Solutions" <${process.env.SMTP_EMAIL}>`,
    to: email,
    subject: `Thank you for contacting Intam Solutions, ${name}!`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#1e3a8a,#2563eb);padding:24px 28px;">
          <h2 style="color:#fff;margin:0;font-size:20px;">🛡️ Thank You, ${name}!</h2>
          <p style="color:#bfdbfe;margin:4px 0 0;font-size:13px;">Intam Solutions – Smart Security & Automation</p>
        </div>

        <div style="padding:28px;background:#fff;line-height:1.7;color:#374151;font-size:14px;">
          <p>Hi <strong>${name}</strong>,</p>
          <p>
            Thank you for reaching out to <strong>Intam Solutions</strong>. We have received your enquiry
            and our team will get back to you within <strong>24 hours</strong>.
          </p>
          <p>
            In the meantime, feel free to reach us directly:
          </p>
          <ul style="padding-left:18px;">
            <li>📞 <a href="tel:+919845012345" style="color:#2563eb;">+91 98450 12345</a></li>
            ${businessWhatsappHref ? `<li>💬 <a href="${businessWhatsappHref}" style="color:#2563eb;">WhatsApp Us</a></li>` : ''}
            <li>🌐 <a href="https://intamsolutions.com" style="color:#2563eb;">www.intamsolutions.com</a></li>
          </ul>
          <p style="margin-top:24px;">
            Warm regards,<br/>
            <strong>Team Intam Solutions</strong><br/>
            <em style="color:#6b7280;font-size:12px;">Smart Security. Intelligent Automation.</em>
          </p>
        </div>

        <div style="background:#f9fafb;padding:14px 28px;border-top:1px solid #e5e7eb;font-size:11px;color:#9ca3af;">
          Coimbatore, Tamil Nadu, India &bull; info@intamsolutions.com
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
  console.log(`📧 Auto-reply sent to ${email}`);
};

module.exports = { sendEnquiryNotification, sendCustomerAutoReply };
