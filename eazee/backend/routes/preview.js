import express from 'express';
import supabase from '../utils/supabase.js';

const router = express.Router();

const PALETTE_COLORS = {
  warm:  { primary: '#f97316', bg: '#fff7ed', text: '#9a3412' },
  fresh: { primary: '#16a34a', bg: '#f0fdf4', text: '#14532d' },
  royal: { primary: '#7c3aed', bg: '#faf5ff', text: '#4c1d95' },
  ocean: { primary: '#0284c7', bg: '#f0f9ff', text: '#0c4a6e' },
  rose:  { primary: '#e11d48', bg: '#fff1f2', text: '#881337' },
  earth: { primary: '#92400e', bg: '#fef3c7', text: '#451a03' },
};

router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const frontendUrl = process.env.FRONTEND_URL || 'https://eazee-lac.vercel.app';

    const { data: vendor, error } = await supabase
      .from('vendors')
      .select('business_name, bio, logo_url, palette, slug, whatsapp_number')
      .eq('slug', slug)
      .single();

    if (error || !vendor) {
      return res.redirect(`${frontendUrl}/store/${slug}`);
    }

    const { data: products } = await supabase
      .from('products')
      .select('media_url, media_type, name')
      .eq('vendor_id', (await supabase.from('vendors').select('id').eq('slug', slug).single()).data?.id)
      .eq('is_available', true)
      .eq('media_type', 'image')
      .not('media_url', 'is', null)
      .order('created_at', { ascending: false })
      .limit(1);

    const palette = PALETTE_COLORS[vendor.palette] || PALETTE_COLORS.warm;
    const storeUrl = `${frontendUrl}/store/${slug}`;

    const ogImage = vendor.logo_url
      || (products && products[0]?.media_url)
      || `${frontendUrl}/og-image.png`;

    const title = `${vendor.business_name} | Eazee Store`;
    const description = vendor.bio
      ? `${vendor.bio} — Browse and order on WhatsApp.`
      : `Shop ${vendor.business_name} on Eazee. Browse products and order directly on WhatsApp.`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');

    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>

  <!-- Open Graph -->
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${ogImage}" />
  <meta property="og:image:width" content="800" />
  <meta property="og:image:height" content="800" />
  <meta property="og:url" content="${storeUrl}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Eazee" />

  <!-- Twitter / WhatsApp -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${ogImage}" />

  <!-- WhatsApp specific -->
  <meta name="description" content="${description}" />

  <!-- Redirect to actual React app immediately -->
  <meta http-equiv="refresh" content="0; url=${storeUrl}" />
  <script>window.location.replace("${storeUrl}");</script>
</head>
<body style="background:${palette.bg};display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;font-family:sans-serif;">
  <div style="text-align:center;padding:24px;">
    ${vendor.logo_url ? `<img src="${vendor.logo_url}" style="width:80px;height:80px;border-radius:16px;object-fit:cover;margin-bottom:16px;" />` : `<div style="width:80px;height:80px;border-radius:16px;background:${palette.primary};display:flex;align-items:center;justify-content:center;color:white;font-size:32px;font-weight:800;margin:0 auto 16px;">${vendor.business_name[0]}</div>`}
    <h1 style="font-size:24px;font-weight:800;color:#0f172a;margin:0 0 8px;">${vendor.business_name}</h1>
    <p style="font-size:14px;color:#6b7280;margin:0 0 20px;">${vendor.bio || ''}</p>
    <a href="${storeUrl}" style="background:${palette.primary};color:white;padding:12px 28px;border-radius:50px;text-decoration:none;font-weight:700;font-size:15px;">Visit Store</a>
  </div>
</body>
</html>`);

  } catch (err) {
    console.error('Preview route error:', err);
    res.redirect(`${process.env.FRONTEND_URL || 'https://eazee-lac.vercel.app'}/store/${req.params.slug}`);
  }
});

export default router;
