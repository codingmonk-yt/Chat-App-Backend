const sgMail = require("@sendgrid/mail");

console.log(process.env.SG_KEY);

sgMail.setApiKey(process.env.SG_KEY);

const sendSGMail = async ({
  to,
  sender,
  subject,
  html,
  attachments,
  text,
}) => {
  try {
    const from = "shreyanshshah242@gmail.com";

    const msg = {
      to: to, // Change to your recipient
      from: from, // Change to your verified sender
      subject: subject,
      html: html,
      // text: text,
      attachments,
    };

    console.log(msg);
    
    return sgMail.send(msg);
  } catch (error) {
    console.log(error);
  }
};

exports.sendEmail = async (args) => {
  if (!process.env.NODE_ENV === "development") {
    return Promise.resolve();
  } else {
    return sendSGMail(args);
  }
};
