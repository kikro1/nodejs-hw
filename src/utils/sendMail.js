import nodemailer from 'nodemailer';

let transporter;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
      // Fail fast instead of hanging (e.g. if the host blocks outbound
      // SMTP), so a broken connection surfaces as a normal rejected
      // promise rather than stalling the request indefinitely.
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 10_000,
    });
  }

  return transporter;
};

export const sendEmail = async (options) => {
  return getTransporter().sendMail({
    from: process.env.SMTP_FROM,
    ...options,
  });
};
