const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('./models/user.model');
const db_config_1 = require('./db.config');
const config = require('./config');

module.exports = function(passport) {
  let opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
  //opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = config.secret;
  passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    User.getUserById(jwt_payload.data._id, (err, user) => {
      if(err) {
        return done(err, false);
      }

      if(user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  }));
}
