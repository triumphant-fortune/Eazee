import express from 'express';
import slugify from 'slugify';
import supabase from '../utils/supabase.js';
import { upload } from '../utils/cloudinary.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.post('/onboard', authMiddleware, upload.single('logo'), async (req, res) => {
  try {
    const { business_name, bio, palette, whatsapp_number, is_inactive } = req.body;
    const userId = req.user.id;

    if (!business_name) return res.status(400).json({ error: 'Business name is required' });

    // Check if vendor already exists to preserve slug
    const { data: existing } = await supabase.from('vendors').select('slug').eq('id', userId).single();

    let slug = existing?.slug;
    if (!slug) {
      let baseSlug = slugify(business_name, { lower: true, strict: true });
      slug = baseSlug;
      let counter = 1;
      while (true) {
        const { data: taken } = await supabase.from('vendors').select('slug').eq('slug', slug).neq('id', userId).single();
        if (!taken) break;
        slug = `${baseSlug}-${counter++}`;
      }
    }

    let logo_url = null;
    if (req.file) logo_url = req.file.path;

    const updateData = {
      id: userId,
      business_name,
      bio: bio || '',
      palette: palette || 'warm',
      whatsapp_number: whatsapp_number || '',
      slug,
      is_inactive: is_inactive === 'true' || is_inactive === true
    };
    if (logo_url) updateData.logo_url = logo_url;

    const { data, error } = await supabase.from('vendors').upsert(updateData).select().single();
    if (error) throw error;
    res.json({ success: true, vendor: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase.from('vendors').select('*').eq('id', req.user.id).single();
    if (error) return res.status(404).json({ error: 'Vendor not found' });
    res.json({ vendor: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/profile', authMiddleware, upload.single('logo'), async (req, res) => {
  try {
    const { business_name, bio, palette, whatsapp_number, is_inactive } = req.body;
    const updates = {
      business_name, bio, palette, whatsapp_number,
      is_inactive: is_inactive === 'true' || is_inactive === true
    };
    if (req.file) updates.logo_url = req.file.path;

    const { data, error } = await supabase.from('vendors').update(updates).eq('id', req.user.id).select().single();
    if (error) throw error;
    res.json({ success: true, vendor: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
