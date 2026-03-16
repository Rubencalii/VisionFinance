import express, { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();
const router = express.Router();

// 1. Get stats for Dashboard
router.get('/stats', authMiddleware, async (req: AuthRequest, res: Response) => {
  const userId = req.user.id;

  try {
    const tickets = await prisma.ticket.findMany({
      where: { userId },
      include: { category: true }
    });

    const totalSpent = tickets.reduce((sum, t) => sum + Number(t.total), 0);
    const count = tickets.length;
    
    // Group by category
    const byCategory = tickets.reduce((acc: any, t) => {
      const catName = t.category.name;
      acc[catName] = (acc[catName] || 0) + Number(t.total);
      return acc;
    }, {});

    res.json({
      totalSpent,
      count,
      byCategory,
      recentTickets: tickets.slice(-5).reverse()
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// 2. List all tickets (History)
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  const userId = req.user.id;

  try {
    const tickets = await prisma.ticket.findMany({
      where: { userId },
      include: { category: true },
      orderBy: { date: 'desc' }
    });
    res.json(tickets);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

// 3. Save a new ticket
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  const userId = req.user.id;
  const { merchant, date, total, subtotal, vat, categoryName, imageUrl, notes } = req.body;

  try {
    // Ensure category exists or create it
    const category = await prisma.category.upsert({
      where: { name: categoryName },
      update: {},
      create: { name: categoryName }
    });

    const ticket = await prisma.ticket.create({
      data: {
        userId,
        merchant,
        date: new Date(date),
        total,
        subtotal: subtotal || 0,
        vat: vat || 0,
        imageUrl,
        categoryId: category.id,
        notes
      }
    });

    res.json({ success: true, ticket });
  } catch (error: any) {
    console.error('Save ticket error:', error);
    res.status(500).json({ error: 'Failed to save ticket', details: error.message });
  }
});

export default router;
