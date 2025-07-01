import { Router, Request, Response } from 'express';

const router = Router();

// Placeholder for history data
router.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to the history data API' });
});

export default router;
