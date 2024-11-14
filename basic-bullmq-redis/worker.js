const { Worker } = require("bullmq");

function sendMockEmail(delayTime) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Email sent");
      resolve();
    }, delayTime);
  });
}

const worker = new Worker(
  "email-queue",
  async (job) => {
    console.log("Processing job", job.id);
    console.log("Job data", job.data);
    console.log("Sending email to", job.data.to);

    await sendMockEmail(5000);
  },
  {
    connection: {
      host: "127.0.0.1",
      port: 6379,
    },
  }
);
