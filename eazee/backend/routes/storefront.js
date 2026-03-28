import express from 'express';
import supabase from '../utils/supabase.js';

const router = express.Router();

// Public storefront by slug - no auth required
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const { data: vendor, error: vendorError } = await supabase
      .from('vendors')
      .select('*')
      .eq('slug', slug)
      .single();

    if (vendorError || !vendor) {
      return res.status(404).json({ error: 'Store not found' });
    }

    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .eq('vendor_id', vendor.id)
      .eq('is_available', true)
      .order('created_at', { ascending: false });

    if (productsError) throw productsError;

    res.json({ vendor, products });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
