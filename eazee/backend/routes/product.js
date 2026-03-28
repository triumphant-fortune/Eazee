import express from 'express';
import supabase from '../utils/supabase.js';
import { upload } from '../utils/cloudinary.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Add a product
router.post('/', authMiddleware, upload.single('media'), async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const vendorId = req.user.id;

    if (!name || !price) return res.status(400).json({ error: 'Name and price are required' });

    let media_url = null;
    let media_type = 'image';

    if (req.file) {
      media_url = req.file.path;
      media_type = req.file.mimetype.startsWith('video/') ? 'video' : 'image';
    }

    const { data, error } = await supabase.from('products').insert({
      vendor_id: vendorId,
      name,
      price: parseFloat(price),
      description: description || '',
      media_url,
      media_type,
      is_available: true
    }).select().single();

    if (error) throw error;
    res.json({ success: true, product: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all products for logged-in vendor
router.get('/mine', authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('vendor_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ products: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update product
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { name, price, description, is_available } = req.body;

    const { data, error } = await supabase
      .from('products')
      .update({ name, price: parseFloat(price), description, is_available })
      .eq('id', req.params.id)
      .eq('vendor_id', req.user.id)
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, product: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete product
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', req.params.id)
      .eq('vendor_id', req.user.id);

    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
