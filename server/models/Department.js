// models/Department.js
const mongoose = require('mongoose');

const DepartmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  parent: { type: mongoose.Schema.ObjectId, ref: 'Department', default: null },
  leads: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],

  location: {
  latitude: { type: Number },
  longitude: { type: Number },
  address: { type: String }
},
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });


   



module.exports = mongoose.model('Department', DepartmentSchema);
