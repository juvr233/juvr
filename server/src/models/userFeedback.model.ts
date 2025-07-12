import mongoose from 'mongoose';
import { logger } from '../config/logger';

const userFeedbackSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  readingId: { 
    type: String, 
    required: true 
  },
  readingType: { 
    type: String, 
    enum: ['tarot', 'iching', 'bazi', 'numerology', 'compatibility', 'holistic'], 
    required: true 
  },
  rating: { 
    type: Number, 
    min: 1, 
    max: 5, 
    required: true 
  },
  comment: { 
    type: String,
    maxlength: 1000
  },
  helpful: {
    type: Boolean,
    default: null
  },
  accurate: {
    type: Boolean,
    default: null
  },
  usedForTraining: {
    type: Boolean,
    default: false
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

// Ensure a user can only provide one feedback per reading
userFeedbackSchema.index({ userId: 1, readingId: 1 }, { unique: true });

// Index for querying feedback by reading type and rating
userFeedbackSchema.index({ readingType: 1, rating: 1 });

// Index for finding feedback that can be used for training
userFeedbackSchema.index({ usedForTraining: 1, rating: 1 });

// Pre-save hook to update the updatedAt field
userFeedbackSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Static method to get average rating by reading type
userFeedbackSchema.statics.getAverageRatingByType = async function(readingType: string): Promise<number> {
  try {
    const result = await this.aggregate([
      { $match: { readingType } },
      { $group: { _id: null, averageRating: { $avg: "$rating" } } }
    ]);
    
    return result.length > 0 ? result[0].averageRating : 0;
  } catch (error) {
    logger.error(`Failed to get average rating for ${readingType}: ${error}`);
    return 0;
  }
};

// Static method to get feedback for training
userFeedbackSchema.statics.getFeedbackForTraining = async function(limit: number = 100): Promise<any[]> {
  return this.find({ 
    usedForTraining: false,
    rating: { $gte: 4 } // Only use high quality feedback for training
  })
  .limit(limit)
  .sort({ createdAt: -1 })
  .populate('userId', 'username')
  .exec();
};

export const UserFeedback = mongoose.model('UserFeedback', userFeedbackSchema); 