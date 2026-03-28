import express from 'express';
import slugify from 'slugify';
import supabase from '../utils/supabase.js';
import { upload, cloudinary } from '../utils/cloudinary.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Create vendor profile (onboarding)
router.post('/onboard', authMiddleware, upload.single('logo'), async (req, res) => {
  try {
    const { business_name, bio, palette, whatsapp_number } = req.body;
    const userId = req.user.id;

    if (!business_name) return res.status(400).json({ error: 'Business name is required' });

    // Generate unique slug
    let baseSlug = slugify(business_name, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;
    while (true) {
      const { data: existing } = await supabase.from('vendors').select('slug').eq('slug', slug).single();
      if (!existing) break;
      slug = `${baseSlug}-${counter++}`;
    }

    let logo_url = null;
    if (req.file) {
      logo_url = req.file.path;
    }

    const { data, error } = await supabase.from('vendors').upsert({
      id: userId,
      business_name,
      bio: bio || '',
      palette: palette || 'warm',
      whatsapp_number: whatsapp_number || '',
      logo_url,
      slug
    }).select().single();

    if (error) throw error;
    res.json({ success: true, vendor: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get vendor profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('vendors')
      .select('*')
      .eq('id', req.user.id)
      .single();

    if (error) return res.status(404).json({ error: 'Vendor not found' });
    res.json({ vendor: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update vendor profile
router.put('/profile', authMiddleware, upload.single('logo'), async (req, res) => {
  try {
    const { business_name, bio, palette, whatsapp_number } = req.body;
    const updates = { business_name, bio, palette, whatsapp_number };

    if (req.file) {
      updates.logo_url = req.file.path;
    }

    const { data, error } = await supabase
      .from('vendors')
      .update(updates)
      .eq('id', req.user.id)
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, vendor: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
