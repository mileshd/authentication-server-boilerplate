'use strict';

const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config');
const UNPROCESSABLE_ENTITY = 422;

function tokenForUser(user) {
  // JWT standard: 
  // sub subject - who this token is about
  // iat - issued at time
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user._id, iat: timestamp }, config.secret);
}

exports.signup = function signup(req, res, next) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(UNPROCESSABLE_ENTITY).send({
      error: 'You must provide an email and password',
    });
  }

  User.findOne({ email }, (err, existingUser) => {
    if (err) {
      return next(err);
    }

    // If a user with email does exist, return an error.
    if (existingUser) {
      return res.status(UNPROCESSABLE_ENTITY).send({ error: 'Email is in use' });
    }

    // If a user with email does NOT exist, create and save user record
    const user = new User({
      email,
      password,
    });

    user.save((err) => {
      if (err) {
        return next(err);
      }

      // Respond to request indicating the user was created
      res.json({ token: tokenForUser(user) });
    });
  })
};

exports.signin = function signin(req, res, next) {
  // User has already had their email and password auth'd
  // We just need to give them a token
  // passport populates 'req.user' with user object of signed in user
  res.send({ token: tokenForUser(req.user) });
}
