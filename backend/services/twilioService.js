const twilio = require('twilio');

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const sendOTP = async (phone) => {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  
  try {
    await client.messages.create({
      body: `Your NEWS App verification code is: ${code}. Valid for 5 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+91${phone}`
    });
    return code;
  } catch (error) {
    console.error('Twilio error:', error);
    throw error;
  }
};

module.exports = { sendOTP };
