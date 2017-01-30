'use strict';

const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

// Create Local Strategy
// use email property as username
const localOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
  // Verify this username and password,
  // if it is the correct username and password,call done with the user 
  // otherwise, call done with false
  User.findOne({ email }, (err, user) => {
    // Error performing search
    if (err) {
      return done(err);
    }

    // User not found
    if (!user) {
      return done(null, false);
    }

    // compare passwords - is 'password' equal to user.password?
    // instance method from User model
    user.comparePassword(password, (err, isMatch) => {
      if (err) {
        return done(err);
      }

      if (!isMatch) {
        return done(null, false);
      }

      return done(null, user);
    });
  })
});

// Set options for JWT Strategy
const jwtOptions = {
  //'authorization' header contains JWT token
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret,
};
// Create JWT Strategy
// payload - decoded JWT token { sub, iat }
// done - callback when async operation complete, pass in user object if authenticated
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  // See if the User Id in the payload.sub exists in our database
  User.findById(payload.sub, (err, user) => {
    // Couldn't perform search
    if (err) {
      return done(err, false);
    }

    // Found User
    if (user) {
      return done(null, user);
    }

    // Couldn't find user
    return done(null, false);
  });
});

// Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);
