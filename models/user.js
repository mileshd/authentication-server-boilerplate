const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define our model
const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
  },
  password: String,
});

// Create the model class
const User = mongoose.model('user', UserSchema);

// Export the model
module.exports = User;
