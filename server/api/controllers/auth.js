const Auth = require('../../helpers/auth');
const mailer = require('../../helpers/mailer');
const User = require('../../core/user');


module.exports.signup = async function signup(req, res, next) {
  try {
    const user = await User.createUser(req.body);
    const token = await Auth.generateJwtToken(user._id);

    return res.json({ data: user.toJSON(), token });
  } catch (error) {
    return next(error);
  }
};


module.exports.login = async function login(req, res, next) {
  try {
    const user = await User.getUserByEmailAndPasswordHash(req.body.email, req.body.password);
    const token = await Auth.generateJwtToken(user._id);

    return res.json({ data: user.toJSON(), token });
  } catch (error) {
    return next(error);
  }
};


module.exports.forgotPassword = async function forgotPassword(req, res, next) {
  try {
    let user = await User.getUserByEmail(req.body.email);
    if (!user) throw new Error("This email doesn't belong to any user");

    const passwordResetToken = await Auth.generatePasswordResetToken(user.password);
    user = await User.updateUserById(user._id, { passwordResetToken, passwordResetExpires: Date.now() + 3600000 });

    const params = {
      toEmail: user.email,
      fromEmail: 'rrankin8801@gmail.com',
      subject: 'Reset your password on Hackathon Starter',
      message: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        http://${req.headers.host}/api/reset/${passwordResetToken}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`
    };
    await mailer.sendEmail(params);
    return res.json({ data: `An e-mail has been sent to ${user.email} with further instructions.` });
  } catch (error) {
    return next(error);
  }
};


module.exports.resetPassword = async function resetPassword(req, res, next) {
  try {
    let user = await User.getUserByPasswordResetToken(req.params.token);
    if (!user) throw new Error('Password reset token is invalid or has expired.');

    user = await User.updateUserById(user._id, {
      password: req.body.password,
      passwordResetToken: undefined,
      passwordResetExpires: undefined,
    });

    const params = {
      toEmail: user.email,
      fromEmail: 'rrankin8801@gmail.com',
      subject: 'Your Hackathon Starter password has been changed',
      message: `Hello,\n\nThis is a confirmation that the password for your account ${user.email} has just been changed.\n`
    };
    await mailer.sendEmail(params);
    return res.json({ data: 'Success! Your password has been changed.' });
  } catch (error) {
    return next(error);
  }
};
