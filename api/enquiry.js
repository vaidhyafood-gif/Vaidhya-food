// Vercel Serverless Function: /api/enquiry
// Sends website enquiry form submissions to vaidhyafood@gmail.com via Gmail SMTP.
//
// SETUP REQUIRED BEFORE THIS WORKS:
// 1. Turn on 2-Step Verification for vaidhyafood@gmail.com
// 2. Generate an App Password: myaccount.google.com/apppasswords
// 3. In the Vercel project dashboard -> Settings -> Environment Variables, add:
//      GMAIL_USER = vaidhyafood@gmail.com
//      GMAIL_APP_PASSWORD = <the 16-character app password>
// 4. Run `npm install nodemailer` in this project before deploying.

const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const {
      business = '',
      contact = '',
      phone = '',
      location = '',
      businessType = '',
      product = '',
      quantity = '',
      message = ''
    } = req.body || {};

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });

    const html = `
      <h2>New Website Enquiry — Vaidhya Foods</h2>
      <table cellpadding="6" style="border-collapse:collapse">
        <tr><td><b>Business Name</b></td><td>${business}</td></tr>
        <tr><td><b>Contact Person</b></td><td>${contact}</td></tr>
        <tr><td><b>Phone</b></td><td>${phone}</td></tr>
        <tr><td><b>Location</b></td><td>${location}</td></tr>
        <tr><td><b>Business Type</b></td><td>${businessType}</td></tr>
        <tr><td><b>Product Interested In</b></td><td>${product}</td></tr>
        <tr><td><b>Quantity Required</b></td><td>${quantity}</td></tr>
        <tr><td><b>Message</b></td><td>${message}</td></tr>
      </table>
    `;

    await transporter.sendMail({
      from: `"Vaidhya Foods Website" <${process.env.GMAIL_USER}>`,
      to: 'vaidhyafood@gmail.com',
      replyTo: undefined,
      subject: `New Enquiry: ${business || 'Website Visitor'} (${businessType || 'General'})`,
      html
    });

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Enquiry email failed:', err);
    res.status(500).json({ ok: false, error: 'Failed to send enquiry email' });
  }
};
