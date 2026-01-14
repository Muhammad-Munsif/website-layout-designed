const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  category: {
    type: String,
    enum: ['web', 'mobile', 'branding', 'ecommerce', 'other'],
    required: true
  },
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required']
  },
  liveUrl: String,
  githubUrl: String,
  technologies: [String],
  features: [String],
  client: String,
  completionDate: Date,
  isFeatured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'published'
  },
  views: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
projectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

projectSchema.index({ category: 1, status: 1 });
projectSchema.index({ isFeatured: 1, createdAt: -1 });

module.exports = mongoose.model('Project', projectSchema);