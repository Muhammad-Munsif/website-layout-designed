const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: [true, 'Client name is required'],
    trim: true
  },
  clientRole: {
    type: String,
    required: [true, 'Client role is required'],
    trim: true
  },
  clientCompany: String,
  clientAvatar: String,
  testimonial: {
    type: String,
    required: [true, 'Testimonial is required'],
    trim: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

testimonialSchema.index({ isApproved: 1, isFeatured: 1, order: 1 });

module.exports = mongoose.model('Testimonial', testimonialSchema);