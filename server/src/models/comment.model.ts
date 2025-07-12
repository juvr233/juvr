import mongoose, { Document, Schema } from 'mongoose';

export interface IComment extends Document {
  user: mongoose.Schema.Types.ObjectId;
  post: mongoose.Schema.Types.ObjectId;
  content: string;
  likes: mongoose.Schema.Types.ObjectId[];
  createdAt: Date;
}

const CommentSchema: Schema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SharedPost',
    required: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
}, {
  timestamps: true,
});

const Comment = mongoose.model<IComment>('Comment', CommentSchema);

export default Comment;
