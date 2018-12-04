const bcrypt = require('bcrypt-nodejs');
const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  passwordResetToken: String,
  passwordResetExpires: Date,
  profile: {
    firstName: String,
    lastName: String,
    gender: String,
    location: String,
    picture: String,
    role: { type: String, enum: ['view', 'user', 'admin'], required: true, default: 'view' }
  }
}, { timestamps: true });


userSchema.options.toJSON = {
  transform(doc, ret, options) { // eslint-disable-line no-unused-vars
    delete ret.password;
    delete ret.passwordResetExpires;
    delete ret.passwordResetToken;
    return ret;
  }
};


/**
 * Password hash middleware.
 */
userSchema.pre('save', function save(next) {
  const user = this;
  if (!user.isModified('password')) return next();
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, null, (error, hash) => {
      if (error) return next(error);
      user.password = hash;
      next();
    });
  });
});

/**
 * Virtual for generating user's full name.
 */
userSchema.virtual('fullName').get(function getFullName() {
  return `${this.profile.firstName} ${this.profile.lastName}`;
});

/**
 * Helper method for validating user's password.
 */
userSchema.methods.validPassword = function isPasswordValid(password) {
  return bcrypt.compareSync(password, this.password);
};


module.exports = mongoose.model('User', userSchema);
