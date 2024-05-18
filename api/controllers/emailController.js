require('dotenv').config();
const nodemailer = require('nodemailer');
const Agenda = require('agenda');

const agenda = new Agenda({ db: { address: process.env.MONGO_URI } });

agenda.define('send email', async (job) => {
  const { to, subject, body } = job.attrs.data;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject,
    text: body,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
});

exports.scheduleEmail = async (req, res) => {
  const { to, subject, body, delay } = req.body;
  await agenda.start();

  const delayDuration = delay ? `${delay} seconds` : 'in 1 hour';
  await agenda.schedule(delayDuration, 'send email', { to, subject, body });

  res.status(200).json({ message: 'Email scheduled successfully' });
};
