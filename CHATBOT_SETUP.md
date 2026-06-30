# Chatbot Setup (one-time)

The chatbots (Virtual Mommy / Daddy / Friend, MysticMinded³³, etc.) call
Google's free Gemini API. There are **two ways** they can reach it — the app
picks whichever works.

## Option A — Server-side key on Netlify (recommended for end users)

This way **every user** of `fightsuicideproject.netlify.app` gets a working
chatbot without ever needing their own key.

1. Go to <https://aistudio.google.com/apikey> and click **"Create API key"**.
   It's free. Copy the key (looks like `AIzaSy...`).
2. Open <https://app.netlify.com/> → select the **fightsuicideproject** site.
3. **Site configuration → Environment variables → Add a variable**
   - Key: `GEMINI_API_KEY`
   - Value: paste your key
   - Scope: All
4. Trigger a redeploy (Deploys tab → "Trigger deploy" → "Deploy site"),
   or just push any commit to `main`.

That's it. The Netlify Function in `netlify/functions/chat.js` will use this
key for every chat request.

### Verify it worked
After redeploy, open <https://fightsuicideproject.netlify.app/api/chat> in
the browser. You should see:

```json
{"error":"Method not allowed"}
```

That's the right answer (the function only accepts POST). If you see the
homepage HTML instead, the function didn't deploy — check the Deploys log.

## Option B — Per-user key in Account Settings (optional)

Power users can paste their own Gemini key into **⚙️ Account Settings →
Google Gemini API Key**. When that's filled in, their chats go directly
from their browser to Google (skipping our server). This is useful if:

- They don't trust our shared key
- They want to use their own paid Gemini quota
- The Netlify Function is down for some reason

The app automatically prefers the per-user key when it's set, and falls
back to the Netlify Function when it isn't.

## Free tier limits

Gemini's free tier is generous (1500 requests/day on `gemini-1.5-flash`
as of late 2025). For a site of this size that's more than enough.
