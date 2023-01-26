const sgMail = require("@sendgrid/mail");
const dotenv = require("dotenv");
dotenv.config({ path: "../config.env" });

sgMail.setApiKey(process.env.SG_KEY);

const sendSGMail = async ({
  recipient,
  sender,
  subject,
  html,
  attachments,
}) => {
  try {
    const from = sender || "contact@codingmonk.in";

    const msg = {
      to: recipient, // Change to your recipient
      from: from, // Change to your verified sender
      subject: subject,
      html: html,
      attachments,
    };
    return sgMail.send(msg);
  } catch (error) {
    console.log(error);
  }
};

exports.sendEmail = async (args) => {
  if (process.env.NODE_ENV === "development") {
    return new Promise.resolve();
  } else {
    return sendSGMail(args);
  }
};
