'use strict';

const User = require('../models/user');
const UNPROCESSABLE_ENTITY = 422;

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
      res.json(user);
    });
  })
};

