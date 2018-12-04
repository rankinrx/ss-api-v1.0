const passport = require('passport');
const passportJWT = require('passport-jwt');
const config = require('./config');
const User = require('../server/core/user');


passport.use(new passportJWT.Strategy({
  jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwtSecret,
  jsonWebTokenOptions: {
    maxAge: '1d',
  }
},
    (jwtPayload, cb) => User.getUserById(jwtPayload.id)
            .then(user => cb(null, user))
            .catch(err => cb(err))
));
