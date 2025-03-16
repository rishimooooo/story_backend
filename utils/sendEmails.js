import nodemailer from "nodemailer";

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // 🔹 Your email
        pass: process.env.EMAIL_PASS, // 🔹 Your email password or App Password
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    });

    console.log("📧 Email sent successfully");
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};

export default sendEmail;
