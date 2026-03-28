# Eazee MVP

WhatsApp-native vendor storefronts for African business owners.

## Project Structure

```
eazee/
├── frontend/     # React + Tailwind (deploy to Vercel)
└── backend/      # Node.js + Express (deploy to Railway)
```

## Local Setup

### 1. Backend

```bash
cd backend
npm install
# Edit .env with your actual keys
npm run dev
```

### 2. Frontend

```bash
cd frontend
npm install
# Edit .env with your actual keys
npm start
```

Frontend runs on http://localhost:3000
Backend runs on http://localhost:4000

## Environment Variables

### Backend (.env)
- `SUPABASE_URL` — your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role key (secret)
- `GEMINI_API_KEY` — Google Gemini API key
- `CLOUDINARY_CLOUD_NAME` — Cloudinary cloud name
- `CLOUDINARY_API_KEY` — Cloudinary API key
- `CLOUDINARY_API_SECRET` — Cloudinary API secret
- `FRONTEND_URL` — frontend URL (localhost or Vercel URL)
- `PORT` — backend port (default 4000)

### Frontend (.env)
- `REACT_APP_SUPABASE_URL` — your Supabase project URL
- `REACT_APP_SUPABASE_ANON_KEY` — Supabase anon key
- `REACT_APP_API_URL` — backend URL (localhost or Railway URL)

## Deploy

### Backend → Railway
1. Push backend folder to GitHub
2. Create new project on railway.app
3. Connect your GitHub repo
4. Add all env variables in Railway dashboard
5. Deploy — Railway auto-detects Node.js

### Frontend → Vercel
1. Push frontend folder to GitHub
2. Import project on vercel.com
3. Add env variables in Vercel dashboard
4. Set `REACT_APP_API_URL` to your Railway backend URL
5. Deploy

## Features
- Vendor signup + onboarding (name, logo, bio, palette)
- Product listing with photo/video upload
- AI product description (Gemini)
- Public storefront — shareable link, no login needed
- WhatsApp deep link — pre-filled order message
- AI caption generator for WhatsApp posts
