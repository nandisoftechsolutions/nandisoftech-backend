require('dotenv').config();
const pool = require('../config/db');
const Razorpay = require('razorpay');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const path = require('path');

// ✅ Razorpay setup
const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ Create payment order
async function initPayment(req, res) {
  try {
    const { courseId, username, email } = req.body;

    if (!courseId || !email || !username) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const courseRes = await pool.query('SELECT * FROM courses WHERE id = $1', [courseId]);
    if (courseRes.rows.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const course = courseRes.rows[0];

    const order = await instance.orders.create({
      amount: course.price * 100,
      currency: 'INR',
      receipt: `receipt_course_${courseId}_${Date.now()}`,
      payment_capture: 1,
    });

    res.json({ orderId: order.id, amount: order.amount, course });
  } catch (err) {
    console.error('❌ Error in initPayment:', err.message);
    res.status(500).json({ error: 'Payment initialization failed' });
  }
}

// ✅ Verify Razorpay payment
async function verifyPayment(req, res) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courseId,
      email,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !email || !courseId) {
      return res.status(400).send('Invalid input');
    }

    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).send('Invalid Signature');
    }

    await pool.query(
      `INSERT INTO subscriptions (user_email, course_id, payment_id)
       VALUES ($1, $2, $3)`,
      [email, courseId, razorpay_payment_id]
    );

    const courseRes = await pool.query('SELECT title FROM courses WHERE id = $1', [courseId]);
    const courseTitle = courseRes.rows[0]?.title || 'Course';

    // ✅ Send email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `🎉 Purchase Confirmation - ${courseTitle}`,
      text: `Hi,\n\nYou have successfully purchased the course "${courseTitle}".\n\nThank you for choosing Nandi Softech Solutions!\n\nRegards,\nNandi Team`,
    });

    res.json({ success: true });
  } catch (err) {
    console.error('❌ Error in verifyPayment:', err.message);
    res.status(500).json({ error: 'Payment verification failed' });
  }
}

// ✅ Check if user enrolled
async function isEnrolled(req, res) {
  try {
    const { courseId } = req.params;
    const userEmail = req.query.userEmail;

    if (!userEmail || !courseId) {
      return res.status(400).json({ error: 'Missing email or courseId' });
    }

    const result = await pool.query(
      'SELECT 1 FROM subscriptions WHERE course_id = $1 AND user_email = $2',
      [courseId, userEmail]
    );

    res.json({ enrolled: result.rows.length > 0 });
  } catch (err) {
    console.error('❌ Error checking enrollment:', err.message);
    res.status(500).json({ error: 'Internal error' });
  }
}

// 🔤 Convert slug to title
function slugToTitle(slug) {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// ✅ Get all courses
async function getAllCourses(req, res) {
  try {
    const result = await pool.query('SELECT * FROM courses ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error fetching courses:', err.message);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
}

// ✅ Get course by slug
async function getCourseBySlug(req, res) {
  try {
    const slug = req.params.slug;
    const title = slugToTitle(slug);

    const result = await pool.query('SELECT * FROM courses WHERE title = $1', [title]);

    if (!result.rows.length) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('❌ Error fetching course by slug:', err.message);
    res.status(500).json({ message: 'Error fetching course' });
  }
}

// ✅ Add course (with file upload)
async function addCourse(req, res) {
  try {
    const { title, description, price, offer, duration } = req.body;
    const thumbnail = req.file ? req.file.filename : null;

    if (!title || !description || !price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await pool.query(
      `INSERT INTO courses (title, description, price, offer, duration, thumbnail)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [title, description, price, offer, duration, thumbnail]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('❌ Error adding course:', err.message);
    res.status(500).json({ error: 'Failed to add course' });
  }
}

// ✅ Update course (with optional file)
async function updateCourse(req, res) {
  try {
    const id = req.params.id;
    const { title, description, price, offer, duration } = req.body;
    const thumbnail = req.file ? req.file.filename : null;

    const courseCheck = await pool.query('SELECT * FROM courses WHERE id = $1', [id]);
    if (!courseCheck.rows.length) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const updatedCourse = await pool.query(
      `UPDATE courses SET
         title = $1, description = $2, price = $3, offer = $4,
         duration = $5, thumbnail = COALESCE($6, thumbnail)
       WHERE id = $7
       RETURNING *`,
      [title, description, price, offer, duration, thumbnail, id]
    );

    res.json(updatedCourse.rows[0]);
  } catch (err) {
    console.error('❌ Error updating course:', err.message);
    res.status(500).json({ error: 'Failed to update course' });
  }
}

// ✅ Get course by ID
async function getCourseById(req, res) {
  try {
    const id = req.params.id;
    const result = await pool.query('SELECT * FROM courses WHERE id = $1', [id]);

    if (!result.rows.length) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('❌ Error fetching course by ID:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
}

// ✅ Delete course
async function deleteCourse(req, res) {
  try {
    const id = req.params.id;

    const check = await pool.query('SELECT * FROM courses WHERE id = $1', [id]);
    if (!check.rows.length) {
      return res.status(404).json({ message: 'Course not found' });
    }

    await pool.query('DELETE FROM courses WHERE id = $1', [id]);
    res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting course:', err.message);
    res.status(500).json({ error: 'Failed to delete course' });
  }
}

// 🔁 Export
module.exports = {
  getAllCourses,
  getCourseBySlug,
  addCourse,
  updateCourse,
  getCourseById,
  deleteCourse,
  initPayment,
  verifyPayment,
  isEnrolled,
};
