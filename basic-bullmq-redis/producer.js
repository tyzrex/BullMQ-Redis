const { Queue } = require("bullmq");

const notificationQueue = new Queue("email-queue");

async function init() {
  const res = await notificationQueue.add("send-email", {
    to: "sulavbaral58@gmail.com",
    subject: "Hello",
    message: "Hello World",
  });
  console.log("Job added for email sending", res.id);
  return;
}

init().then(() => {
  console.log("Job added");
  process.exit(0);
});
