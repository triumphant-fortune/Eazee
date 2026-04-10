import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import vendorRoutes from './routes/vendor.js';
import productRoutes from './routes/product.js';
import aiRoutes from './routes/ai.js';
import storefrontRoutes from './routes/storefront.js';
import previewRoutes from './routes/preview.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: [process.env.FRONTEND_URL || 'http://localhost:3000', 'https://*.vercel.app'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => res.json({ status: 'Eazee backend running' }));

app.use('/api/vendor', vendorRoutes);
app.use('/api/products', productRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/storefront', storefrontRoutes);
app.use('/api/preview', previewRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong', message: err.message });
});

app.listen(PORT, () => {
  console.log(`Eazee backend running on port ${PORT}`);
});
