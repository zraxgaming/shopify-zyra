# Vercel Environment Variable Setup

## The 500 Error Issue
Your Vercel deployment is failing because the `RESEND_API_KEY` environment variable is not set in production.

## How to Fix

### 1. Go to Vercel Dashboard
1. Visit [vercel.com](https://vercel.com)
2. Log in to your account
3. Find your project (likely named `zyra-custom-craft` or similar)
4. Click on your project

### 2. Add Environment Variable
1. Go to **Settings** tab
2. Click **Environment Variables** in the sidebar
3. Click **Add New**
4. Set:
   - **Name**: `RESEND_API_KEY`
   - **Value**: your Resend API key from your Resend dashboard
   - **Environments**: Check all (Production, Preview, Development)

### 3. Redeploy
1. Go to **Deployments** tab
2. Click the **...** menu on the latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete

## Alternative: Use Vercel CLI
If you have Vercel CLI installed:
```bash
vercel env add RESEND_API_KEY
# When prompted, enter your Resend API key
# Select all environments

vercel --prod
```

## Verify the Fix
After setting the environment variable and redeploying:
1. Try the newsletter signup again
2. Check the Vercel function logs for any remaining errors
3. The email should be sent successfully

## Additional Environment Variables to Set
While you're there, also add these if not already set:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_ADMIN_EMAIL`
- `VITE_PAYPAL_CLIENT_ID`

## Note
Keep API keys out of code and documentation. If a key has been shared publicly, rotate it in Resend and update the Vercel environment variable.
