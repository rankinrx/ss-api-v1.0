const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const config = require('../../config/config');


module.exports.generateJwtToken = async function generateJwtToken(userId) {
  return jwt.sign({ id: userId }, config.jwtSecret, { expiresIn: '1d' });
};


module.exports.generatePasswordResetToken = async function generatePasswordResetToken(hashedPassword) {
  const salt = await bcrypt.genSaltSync(10);
  return bcrypt.hashSync(hashedPassword, salt);
};
