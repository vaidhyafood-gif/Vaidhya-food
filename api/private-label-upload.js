// Vercel Serverless Function: /api/private-label-upload
// Receives a base64-encoded packaging design file (<=5MB) from the Private
// Label page and emails it to vaidhyafood@gmail.com as an attachment.
//
// IMPORTANT — WHATSAPP LIMITATION:
// A plain wa.me link can only pre-fill TEXT, not attach a file — WhatsApp
// does not support that via URL. The frontend already opens a WhatsApp chat
// with a text message referencing the upload so your team knows to expect it.
// To have the FILE ITSELF land directly in WhatsApp automatically, you need
// the WhatsApp Business Cloud API (Meta) with a verified business number —
// that's a bigger setup step (Meta Business verification + access token).
// Ask Claude to wire that in once you're ready to set it up; for now, email
// delivery below is fully automatic and reliable.
//
// SETUP REQUIRED (same as /api/enquiry):
//   GMAIL_USER, GMAIL_APP_PASSWORD environment variables in Vercel.

const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  try {
    const { filename = 'design-upload', mimeType = 'application/octet-stream', dataBase64 = '', business = '', phone = '' } = req.body || {};

    if (!dataBase64) {
      res.status(400).json({ ok: false, error: 'No file data received' });
      return;
    }

    // 5MB guard (base64 is ~1.37x binary size)
    const approxBytes = (dataBase64.length * 3) / 4;
    if (approxBytes > 5 * 1024 * 1024) {
      res.status(400).json({ ok: false, error: 'File exceeds 5MB limit' });
      return;
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });

    await transporter.sendMail({
      from: `"Vaidhya Foods Website" <${process.env.GMAIL_USER}>`,
      to: 'vaidhyafood@gmail.com',
      subject: `New Private Label Packaging Upload — ${business || 'Website Visitor'}`,
      html: `<p><b>Business:</b> ${business}</p><p><b>Phone:</b> ${phone}</p><p>Packaging design attached.</p>`,
      attachments: [
        { filename, content: dataBase64, encoding: 'base64', contentType: mimeType }
      ]
    });

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Private label upload failed:', err);
    res.status(500).json({ ok: false, error: 'Upload failed' });
  }
};
