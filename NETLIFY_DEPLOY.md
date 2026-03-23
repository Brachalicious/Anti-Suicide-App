# Netlify Deployment Guide for Anti-Suicide App

## Environment Variables Needed in Netlify

Add these in: Site Settings → Environment Variables

### Required:
1. **GEMINI_API_KEY** = `[Your API key from .env file]`
   - ⚠️ **NEVER commit this to GitHub!**
   - Get your key from Google AI Studio: https://makersuite.google.com/app/apikey
   - Keep it in your `.env` file (already in .gitignore)

### For Google Authentication (To Be Added):
2. **GOOGLE_CLIENT_ID** = `your_google_client_id_here`
   - Get from: https://console.cloud.google.com/apis/credentials
   
3. **GOOGLE_CLIENT_SECRET** = `your_google_client_secret_here`
   - Get from: https://console.cloud.google.com/apis/credentials

4. **SESSION_SECRET** = `generate_a_random_32_character_string`
   - Generate with: `openssl rand -base64 32`

## Build Settings

These are already configured in `netlify.toml`:

- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Functions directory:** `netlify/functions`

## Common Deployment Issues

### Issue 1: Build Fails
**Cause:** Missing build dependencies or incorrect Node version
**Solution:** 
- Ensure Node 20 is specified (already in netlify.toml)
- Check that all dependencies are in package.json

### Issue 2: API Routes Don't Work
**Cause:** Serverless functions not properly configured
**Solution:**
- Netlify automatically converts Express routes to serverless functions
- API routes redirect to `/.netlify/functions/server` (configured in netlify.toml)

### Issue 3: Environment Variables Not Working
**Cause:** Variables not set in Netlify dashboard
**Solution:**
- Go to: Site Settings → Environment Variables
- Add all required variables listed above
- Redeploy after adding variables

## Deployment Steps

1. **Push latest code to GitHub**
   ```bash
   git add .
   git commit -m "Add Netlify configuration and build setup"
   git push origin main
   ```

2. **In Netlify Dashboard:**
   - Go to your site settings
   - Navigate to "Environment Variables"
   - Add `GEMINI_API_KEY` with your API key
   - Click "Deploy" → "Trigger deploy" → "Deploy site"

3. **After Google Auth Setup:**
   - Create OAuth credentials in Google Cloud Console
   - Add authorized redirect URI: `https://your-site.netlify.app/api/auth/callback`
   - Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to Netlify env vars
   - Redeploy

## What's Already Configured

✅ Build command and publish directory
✅ API route redirects
✅ SPA (Single Page App) fallback routing
✅ Serverless functions directory
✅ Node 20 environment
✅ Vite build configuration

## Next Steps for Google Login

To add Google authentication, you'll need to:

1. **Create Google OAuth App:**
   - Go to https://console.cloud.google.com
   - Create a new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect: `https://your-netlify-url.netlify.app/api/auth/callback`

2. **Add to Netlify:**
   - Copy Client ID and Client Secret
   - Add as environment variables in Netlify
   - Redeploy site

3. **Test:**
   - Visit your deployed site
   - Click "Login with Google"
   - Verify user data saves correctly

## Monitoring

- **Build logs:** Netlify Dashboard → Deploys → [Latest Deploy] → Deploy log
- **Function logs:** Netlify Dashboard → Functions → [Function Name] → Log
- **Real-time logs:** `netlify dev` for local testing

## Support

If deployment still fails:
1. Check the deploy log in Netlify dashboard
2. Look for specific error messages (usually in red)
3. Common errors:
   - "Command failed": Check build script in package.json
   - "Module not found": Missing dependency in package.json
   - "Environment variable undefined": Not set in Netlify dashboard
