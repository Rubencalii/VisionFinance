import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import ocrRoutes from './routes/ocr';
import ticketRoutes from './routes/ticket';
import { authMiddleware } from './middleware/auth';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Public routes
app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/user', userRoutes);
app.use('/api/ocr', ocrRoutes);
app.use('/api/tickets', ticketRoutes);

// Mock Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'VisionFinance API is running' });
});

// Protected routes (example)
app.get('/api/protected', authMiddleware, (req: Request, res: Response) => {
  res.json({ message: 'This is a protected route', user: (req as any).user });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
