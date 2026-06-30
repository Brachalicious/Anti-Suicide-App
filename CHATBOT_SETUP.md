# Chatbot Setup — Bring Your Own Key (free) by default

The chatbots (Virtual Mommy/Daddy/Friend, MysticMinded³³, Help Guide) call
Google's Gemini API. To keep this app free to host, **every user brings
their own free Gemini API key**. Gemini's free tier is generous, so there's
no real cost to end users either.

## How a normal user turns on AI (the only path that's on by default)

1. Visit <https://aistudio.google.com/apikey> and sign in with any Google account.
2. Click **"Create API key"** → copy the key (starts with `AIzaSy…`).
3. In the app, open **⚙️ Account Settings → 🤖 Turn on AI Replies**.
4. Paste the key, hit **💾 Save**. Done — every chatbot now uses real AI.

Their key is stored in their browser's localStorage and is only ever sent
directly to Google. It never touches our servers.

## What works WITHOUT a key

Almost everything:
- Wall of Hope, diary, safety plan, breathing exercises, guided meditation,
  Scream Circle, Tehillim, Chizuk videos, daily check-ins, all 988 / Crisis
  Text Line hotlines, all coping tools, GIF search, etc.
- The Help Guide modal still routes you to the right tool based on keywords
  (e.g. typing "panic" still offers the Breathing exercise).

Only the **AI conversation** part of the chatbots needs a key.

## The hosted "Premium" path (off by default — DO NOT enable for the public)

There IS a Netlify Function at `/.netlify/functions/chat` that proxies to
Gemini using a `GEMINI_API_KEY` env var. **It is gated** — the browser code
will only call it when `localStorage.useHostedAI === '1'`.

- Default state for every visitor: **OFF** → they see the BYOK invite.
- For yourself, in DevTools console: `localStorage.setItem('useHostedAI','1')` to test.
- For a future paid tier, after a successful checkout, set that flag for
  the customer and they instantly get hosted AI.

### Why not just let everyone use the hosted key?
Because then the site owner pays Google for every visitor's chat. Even
though the free tier is generous, a viral spike could bill real money.
BYOK eliminates that risk entirely.

### Should I remove the `GEMINI_API_KEY` Netlify env var?

It's safe to leave it set — the public-facing code will not call the
function unless `useHostedAI` is flipped on. If you want belt-and-suspenders,
you can remove it from Netlify env vars and the function will simply return
a 500 instead of leaking quota.

## Verifying

- Open the live site without a key in Account Settings → any chatbot →
  send "hi" → you should see:
  > Hi *Name* 💕 …fallback persona message…
  > 💡 To turn on AI replies, paste a free Google Gemini key in ⚙️ Account
  > Settings — [get one free here] (takes 2 min, costs $0).

- Paste a real key in Account Settings → reload → send "hi" → you should
  see a personalized AI reply that addresses you by name.

## Free tier limits

Per-user free tier on a personal Google account is more than enough for
normal chat use. If a power user hits a limit, they just wait 24h or
upgrade to a paid Google AI tier — that's between them and Google, not us.
