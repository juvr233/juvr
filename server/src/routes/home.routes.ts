import { Router, Request, Response } from 'express';

const router = Router();

// Placeholder for home data
router.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to the home data API' });
});

export default router;
