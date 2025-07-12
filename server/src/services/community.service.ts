import SharedPost, { ISharedPost } from '../models/sharedPost.model';
import Comment, { IComment } from '../models/comment.model';
import mongoose from 'mongoose';

class CommunityService {
  // Create a new shared post
  async createPost(postData: Partial<ISharedPost>): Promise<ISharedPost> {
    const post = new SharedPost(postData);
    await post.save();
    return post;
  }

  // Get all shared posts with pagination
  async getPosts(page: number = 1, limit: number = 10): Promise<ISharedPost[]> {
    return SharedPost.find()
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
  }

  // Get a single post by ID
  async getPostById(postId: string): Promise<ISharedPost | null> {
    return SharedPost.findById(postId)
      .populate('user', 'name avatar')
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
          select: 'name avatar',
        },
      });
  }

  // Add a comment to a post
  async addComment(postId: string, userId: string, content: string): Promise<IComment> {
    const comment = new Comment({
      post: postId,
      user: userId,
      content,
    });
    await comment.save();

    // Add comment to post's comments array
    await SharedPost.findByIdAndUpdate(postId, { $push: { comments: comment._id } });

    return comment;
  }

  // Like a post
  async likePost(postId: string, userId: string): Promise<ISharedPost | null> {
    const post = await SharedPost.findById(postId);
    if (!post) {
      throw new Error('Post not found');
    }

    // Convert likes to an array of strings for easy comparison
    const likesAsString = post.likes.map(id => id.toString());
    const userIndex = likesAsString.indexOf(userId);

    if (userIndex > -1) {
      // User has liked, so unlike
      post.likes.splice(userIndex, 1);
    } else {
      // User has not liked, so like
      post.likes.push(new mongoose.Types.ObjectId(userId) as any);
    }

    await post.save();
    return post;
  }
}

export default new CommunityService();
