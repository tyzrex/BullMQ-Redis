const express = require("express");
const { emailQueue } = require("./email-queue");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/send-email", async (req, res) => {
  const { to, subject, text } = req.body;

  await emailQueue.add("process-email", { to, subject, text });

  res.send("Email sent");
});

emailQueue.on("progress", (job, progress) => {
  console.log(`Job ${job.id} is ${progress}% done`);
});

//start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
