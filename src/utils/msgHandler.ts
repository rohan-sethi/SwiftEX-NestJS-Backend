import twilio from 'twilio';

export const sendMessage = async ({ body, from, to }) => {
  const client = twilio(
    process.env.TWILIO_ACC_SID,
    process.env.TWILIO_AUTH_TOKEN,
  );

  const sentMsg = await client.messages.create({ body, from, to });

  return sentMsg;
};
