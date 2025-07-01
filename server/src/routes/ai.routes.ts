import { Router, Request, Response } from 'express';

const router = Router();

// Placeholder for AI data
router.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to the AI services API' });
});

export default router;
