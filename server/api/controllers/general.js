const mailer = require('../../helpers/mailer');


module.exports.postContactForm = async function postContactForm(req, res, next) {
  try {
    const emailOpts = {
      fromName: req.body.name,
      fromEmail: req.body.email,
      toEmail: 'your@email.com',
      subject: 'Contact Form | Hackathon Starter',
      message: req.body.message
    };
    await mailer.sendEmail(emailOpts);

    return res.json({ message: 'Email sent successfully.' });
  } catch (error) {
    return next(error);
  }
};
