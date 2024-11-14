const Redis = require("ioredis");
const { Worker, Queue } = require("bullmq");

const redis = new Redis({
  host: "localhost",
  port: 6379,
  maxRetriesPerRequest: null,
});

const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();
const emailQueue = new Queue("process-email", {
  connection: redis,
});

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: true,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

const worker = new Worker(
  "process-email",
  async (job) => {
    const { to, subject, text } = job.data;
    try {
      await transporter.sendMail({
        from: process.env.SMTP_EMAIL,
        to,
        subject,
        text,
      });
      return "Email sent";
    } catch (err) {
      console.log(err);
    }
  },
  {
    connection: redis,
  }
);

worker.on("completed", (job) => {
  console.log(`Job completed with result ${job.returnvalue}`);
});

worker.on("failed", (job, err) => {
  console.log(`Failed processing job ${job.id} with error ${err}`);
});

module.exports = { emailQueue };
