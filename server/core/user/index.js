const httpStatus = require('http-status');
const User = require('./model');
const APIError = require('../../helpers/APIError');


module.exports.createUser = async function createUser(userData) {
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) throw new APIError('Email already associated with an account.', httpStatus.CONFLICT, true);

  const newUser = new User(userData);
  return newUser.save();
};


module.exports.getUserByEmail = async function getUserByEmail(email) {
  const user = await User.findOne({ email });
  if (!user) throw new APIError('Email not found', httpStatus.NOT_FOUND, true);
  return user;
};


module.exports.getUserByEmailAndPasswordHash = async function getUserByEmailAndPasswordHash(email, password) {
  const user = await User.findOne({ email });
  if (!user || !user.validPassword(password)) { throw new APIError('Wrong email/password combination', httpStatus.UNAUTHORIZED, true); }
  return user;
};


module.exports.getUserByPasswordResetToken = async function getUserByPasswordResetToken(passwordResetToken) {
  const user = await User.findOne({ passwordResetToken }).where('passwordResetExpires').gt(Date.now());
  if (!user) throw new APIError('Token invalid or expired', httpStatus.UNAUTHORIZED, true);
  return user;
};


module.exports.getUserById = async function getUserById(userId) {
  return User.findById(userId);
};


module.exports.updateUserById = async function updateUserById(userId, userData) {
  try {
    return User.findByIdAndUpdate(userId, userData);
  } catch (err) {
    if (err.code === 11000) {
      throw new APIError('Email already associated with an account.', httpStatus.CONFLICT, true);
    }
  }
};
