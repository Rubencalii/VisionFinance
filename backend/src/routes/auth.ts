import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

router.post('/sync', async (req: Request, res: Response) => {
  const { uid, email, name } = req.body;

  try {
    const user = await prisma.user.upsert({
      where: { id: uid },
      update: { email, name },
      create: {
        id: uid,
        email,
        name,
      },
    });

    res.json({ success: true, user });
  } catch (error: any) {
    console.error('Sync error:', error);
    res.status(500).json({ error: 'Failed to synchronize user', details: error.message });
  }
});

export default router;
