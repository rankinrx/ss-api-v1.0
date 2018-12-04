const nodemailer = require('nodemailer');
const config = require('../../config/config');


async function sendNodemailerEmail(mailOptions, rejectUnauthorized = true) {
  const transporterOpts = {
    service: 'SendGrid',
    auth: {
      user: config.sendGrid.user,
      pass: config.sendGrid.password,
    }
  };
  if (!rejectUnauthorized) transporterOpts.tls = { rejectUnauthorized: false };

  const transporter = nodemailer.createTransport(transporterOpts);
  return transporter.sendMail(mailOptions);
}


/**
 *
 *
 * @export
 * @param {object} params
 * @param {string} params.fromName
 * @param {string} params.fromEmail
 * @param {string} params.toEmail
 * @param {string} params.subject
 * @param {string} params.message
 * @returns
 */
module.exports.sendEmail = async function sendEmail(params) {
  const mailOptions = {
    to: params.toEmail,
    from: `${params.fromName} <${params.fromEmail}>`,
    subject: params.subject,
    text: params.message
  };

  return sendNodemailerEmail(mailOptions)
    .then(() => true)
    .catch((err) => {
      if (err.message === 'self signed certificate in certificate chain') {
        console.log('WARNING: Self signed certificate in certificate chain. Retrying with the self signed certificate. Use a valid certificate if in production.');
        return sendNodemailerEmail(mailOptions, false);
      }
      console.log('ERROR: Could not send contact email after security downgrade.\n', err);
      throw new Error();
    })
    .then((result) => {
      if (result) { return true; }
    })
    .catch((err) => {
      console.log('ERROR: Could not send contact email.\n', err);
      return false;
    });
};
