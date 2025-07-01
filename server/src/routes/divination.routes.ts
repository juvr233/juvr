import { Router, Request, Response } from 'express';

const router = Router();

// Placeholder for divination data
router.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to the divination data API' });
});

export default router;
