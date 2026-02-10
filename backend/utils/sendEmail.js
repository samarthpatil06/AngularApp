const emailjs = require('@emailjs/nodejs');

// Initialize EmailJS
emailjs.init({
  publicKey: process.env.EMAILJS_PUBLIC_KEY,
  privateKey: process.env.EMAILJS_PRIVATE_KEY
});

const sendCredentialsEmail = async (email, firstName, tempPassword) => {
  try {
    const response = await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_TEMPLATE_ID,
      {
        to_email: email,
        user_name: firstName || email.split('@')[0],
        user_email: email,
        temp_password: tempPassword
      }
    );

    console.log('Email sent successfully:', response.status);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

module.exports = { sendCredentialsEmail };
