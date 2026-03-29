import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import authMiddleware from '../middleware/auth.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

// Generate product description
router.post('/description', authMiddleware, async (req, res) => {
  try {
    const { product_name, price } = req.body;
    if (!product_name) return res.status(400).json({ error: 'Product name is required' });

    const prompt = `You are a copywriter for African small businesses. Write a short, punchy, warm product description for a WhatsApp storefront.

Product: ${product_name}
Price: ${price ? `₦${price}` : 'not specified'}

Rules:
- Maximum 2 sentences
- Warm, human, conversational tone
- No hashtags
- No emojis
- Focus on why someone should buy it
- Write like a friendly market vendor, not a corporate brand

Return ONLY the description, nothing else.`;

    const result = await model.generateContent(prompt);
    const description = result.response.text().trim();
    res.json({ description });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Generate WhatsApp caption
router.post('/caption', authMiddleware, async (req, res) => {
  try {
    const { product_name, price, tone } = req.body;
    if (!product_name) return res.status(400).json({ error: 'Product name is required' });

    const toneMap = {
      excited: 'very excited, energetic, hype — like you just got fresh stock',
      professional: 'professional but warm — like a trusted local brand',
      funny: 'playful and funny — light humour that makes people smile',
      urgent: 'urgency — limited stock, buy now energy without being pushy'
    };

    const selectedTone = toneMap[tone] || toneMap.excited;

    const prompt = `You are a social media expert for African small businesses. Write a WhatsApp status or group chat caption to promote a product.

Product: ${product_name}
Price: ${price ? `₦${price}` : 'ask for price'}
Tone: ${selectedTone}

Rules:
- 3-5 lines maximum
- Include a call to action at the end (e.g. "DM me to order", "Click the link in bio", "Send me a message")
- Use 1-2 relevant emojis tastefully
- No more than 2 hashtags, or none at all
- Sound like a real Nigerian/African business owner, not a robot
- Make it copy-paste ready

Return ONLY the caption, nothing else.`;

    const result = await model.generateContent(prompt);
    const caption = result.response.text().trim();
    res.json({ caption });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
