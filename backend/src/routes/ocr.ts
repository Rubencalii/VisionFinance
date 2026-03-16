import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { decrypt } from '../services/encryption';
import Anthropic from '@anthropic-ai/sdk';

const prisma = new PrismaClient();
const router = express.Router();

router.post('/process', authMiddleware, async (req: AuthRequest, res: Response) => {
  const { imageUrl, ticketId } = req.body;
  const userId = req.user.id;

  try {
    // 1. Get user's encrypted API Key
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { api_key_enc: true },
    });

    if (!user?.api_key_enc) {
      return res.status(400).json({ error: 'Anthropic API Key not configured. Please add it in settings.' });
    }

    // 2. Decrypt the key
    const apiKey = decrypt(user.api_key_enc);

    // 3. Initialize Anthropic
    const anthropic = new Anthropic({ apiKey });

    // 4. Call Claude Vision API
    // Note: Claude expects a base64 or URL for the image. 
    // For this implementation, we assume the frontend provides a public Supabase URL or we fetch it.
    
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Extract data from this receipt. Return ONLY a JSON object with: merchant, date (YYYY-MM-DD), subtotal (number), vat (number), total (number), and category (one of: Food, Transport, Housing, Health, Entertainment, Others)."
            },
            {
              type: "image",
              source: {
                type: "url",
                url: imageUrl,
              }
            }
          ],
        }
      ],
    });

    // 5. Parse Claude's response
    const content = response.content[0];
    if (content.type === 'text') {
      try {
        const jsonResponse = JSON.parse(content.text);
        res.json({ success: true, data: jsonResponse });
      } catch (parseError) {
        res.status(500).json({ error: 'Failed to parse AI response', raw: content.text });
      }
    } else {
      res.status(500).json({ error: 'Unexpected response from AI' });
    }

  } catch (error: any) {
    console.error('OCR Error:', error);
    res.status(500).json({ error: 'OCR processing failed', details: error.message });
  }
});

export default router;
