import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { encrypt } from '../services/encryption';

const prisma = new PrismaClient();
const router = express.Router();

// Update user settings (including API Key)
router.post('/settings', authMiddleware, async (req: AuthRequest, res: Response) => {
  const { apiKey, name } = req.body;
  const userId = req.user.id;

  try {
    const data: any = {};
    if (name) data.name = name;
    if (apiKey) {
      data.api_key_enc = encrypt(apiKey);
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data,
    });

    res.json({ success: true, message: 'Settings updated successfully' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update settings', details: error.message });
  }
});

// Get user settings status (checks if API key exists without returning it)
router.get('/settings/status', authMiddleware, async (req: AuthRequest, res: Response) => {
  const userId = req.user.id;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { api_key_enc: true, name: true },
    });

    res.json({
      hasApiKey: !!user?.api_key_enc,
      name: user?.name,
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to get settings status' });
  }
});

export default router;
