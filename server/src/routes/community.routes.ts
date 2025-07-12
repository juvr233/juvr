import { Router } from 'express';
import CommunityController from '../controllers/community.controller';
import { protect as authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// --- Public Routes ---
// Get all shared posts (paginated)
router.get('/', CommunityController.getPosts);

// Get a single shared post by ID
router.get('/:id', CommunityController.getPostById);


// --- Protected Routes (require authentication) ---
// Create a new shared post
router.post('/', authMiddleware, CommunityController.createPost);

// Add a comment to a post
router.post('/:id/comments', authMiddleware, CommunityController.addComment);

// Like/unlike a post
router.post('/:id/like', authMiddleware, CommunityController.likePost);

export default router;
