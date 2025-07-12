import { Request, Response } from 'express';
import CommunityService from '../services/community.service';
import { logger } from '../config/logger';

class CommunityController {
  async createPost(req: Request, res: Response) {
    try {
      // Assuming user ID is available from auth middleware
      const userId = (req as any).user.id;
      const postData = { ...req.body, user: userId };
      const post = await CommunityService.createPost(postData);
      res.status(201).json(post);
    } catch (error) {
      logger.error('Error creating post:', error);
      res.status(500).json({ message: 'Failed to create post' });
    }
  }

  async getPosts(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const posts = await CommunityService.getPosts(page, limit);
      res.status(200).json(posts);
    } catch (error) {
      logger.error('Error fetching posts:', error);
      res.status(500).json({ message: 'Failed to fetch posts' });
    }
  }

  async getPostById(req: Request, res: Response) {
    try {
      const post = await CommunityService.getPostById(req.params.id);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      res.status(200).json(post);
    } catch (error) {
      logger.error('Error fetching post by ID:', error);
      res.status(500).json({ message: 'Failed to fetch post' });
    }
  }

  async addComment(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { content } = req.body;
      const postId = req.params.id;
      const comment = await CommunityService.addComment(postId, userId, content);
      res.status(201).json(comment);
    } catch (error) {
      logger.error('Error adding comment:', error);
      res.status(500).json({ message: 'Failed to add comment' });
    }
  }

  async likePost(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const postId = req.params.id;
      const post = await CommunityService.likePost(postId, userId);
      res.status(200).json(post);
    } catch (error) {
      logger.error('Error liking post:', error);
      res.status(500).json({ message: 'Failed to like post' });
    }
  }
}

export default new CommunityController();
