const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['admin', 'coordinator', 'user'],
    default: 'user'
  },
 department: {
  type: mongoose.Schema.ObjectId,
  ref: 'Department',
},
  profilePicture: {
    type: String, // URL or filepath to the profile picture
    default: ''
  },

  createdAt: {
    type: Date,
    default: Date.now
  },
   lastLogin: { type: Date,default: null, },
  isOnline: { type: Boolean, default: false },
  location: {
    city: String,
    country: String,
    ip: String,
  },

  pushSubscriptions: [{
  endpoint: String,
  keys: { p256dh: String, auth: String }
}],
  verificationOTP: String,
  verificationOTPExpires: Date,
  isVerified: { type: Boolean, default: false },
});

// Encrypt password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();  // <-- important to return here
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Generate JWT token
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    { id: this._id.toString(), role: this.role },  // include role here
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    }
  );
};

// Match password
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
