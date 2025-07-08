# Development Setup for API Routes

## The Problem
The error `[vite] http proxy error: /api/send-email-generic` occurs because in development mode, the Vite server cannot find the Vercel API endpoints.

## Solutions

### Option 1: Use Vercel CLI (Recommended)
1. Install Vercel CLI globally:
   ```bash
   npm install -g vercel
   ```

2. Run development with Vercel functions:
   ```bash
   vercel dev
   ```
   This will start both the frontend and API functions on the same port.

### Option 2: Continue with Current Setup
The current code is already configured to handle development mode gracefully:
- Newsletter subscriptions will work (saved to database)
- Email sending will fail in development but won't break the app
- Console logs show what would happen in production

### Option 3: Manual Setup
If you want to run the API separately:
1. Start the Vite dev server: `npm run dev`
2. Start Vercel dev server: `vercel dev --listen 3000`
3. The proxy in vite.config.ts will forward API requests to port 3000

## Production
In production (on Vercel), all API routes work automatically.

## Current Status
- ✅ Newsletter subscription works in development
- ✅ Database saves subscriptions
- ⚠️ Email sending fails gracefully in development
- ✅ Production email sending works normally
