const express = require("express");
const router = express.Router();
const sendEmail = require("../utils/sendEmail");

router.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const subject = `📬 New Contact Form Submission`;
  const text = `
You received a new message from your contact form:

👤 Name: ${name}
📧 Email: ${email}
📝 Message:
${message}
`;

  try {
    await sendEmail(process.env.EMAIL, subject, text); // Send to your email
    res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Send email failed:", error);
    res.status(500).json({ message: "Failed to send message" });
  }
});

module.exports = router;
