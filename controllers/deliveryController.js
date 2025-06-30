const pool = require('../config/db');
const nodemailer = require('nodemailer');

exports.createDelivery = async (req, res) => {
  const { order_id, website_link, final_price } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO deliveries (order_id, website_link, final_price) VALUES ($1, $2, $3) RETURNING *',
      [order_id, website_link, final_price]
    );

    // Get client details
    const orderRes = await pool.query('SELECT name, email, project_name FROM orders WHERE id = $1', [order_id]);
    const order = orderRes.rows[0];

    // Send email
    await sendDeliveryEmail(order.email, order.name, order.project_name, website_link, final_price);

    res.json({ message: 'Delivery created & email sent', delivery: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.markAsPaid = async (req, res) => {
  const deliveryId = req.params.id;
  try {
    await pool.query('UPDATE deliveries SET is_paid = TRUE WHERE id = $1', [deliveryId]);
    res.json({ message: 'Payment marked as complete' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

async function sendDeliveryEmail(to, name, project, link, price) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_ID,
      pass: process.env.EMAIL_PASS
    }
  });

  const paymentLink = `https://yourdomain.com/payment?project=${encodeURIComponent(project)}&amount=${encodeURIComponent(price)}&delivery_id=123`;

  await transporter.sendMail({
    from: '"Nandi Softech Solutions" <no-reply@nandisofttech.com>',
    to,
    subject: `Your Project ${project} is Delivered`,
    html: `
      <p>Hi ${name},</p>
      <p>Your project <strong>${project}</strong> is delivered!</p>
      <p><a href="${link}">${link}</a></p>
      <p><strong>Pending Amount:</strong> ${price}</p>
      <p><a href="${paymentLink}">Click here to pay</a></p>
      <br/>
      <p>Thanks for trusting us!</p>
    `
  });
}
