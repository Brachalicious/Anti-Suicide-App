# API Feature Audit

Date: 2026-06-14  
Branch: `cursor/test-feature-log-9296`

This file separates features that are active in the current deploy path from API-backed code that exists in the repository but is not currently wired into the Netlify/Vite app.

## Active deploy path

The current Netlify config runs:

- `npm run build`
- publishes `dist`
- routes `/api/*` to `netlify/functions/api.ts`
- mounts `server/routes.ts` through the Netlify function

## Active features and required keys

| Feature | Code path | External API/key required? | Notes |
| --- | --- | --- | --- |
| Crisis hotlines/resources | `client/src/pages/CrisisSupport.tsx`, `server/routes.ts` | No | Uses seeded in-memory API data. Phone/text buttons use `tel:`/`sms:` links. |
| Mood tracking | `client/src/pages/MoodTracking.tsx`, `server/routes.ts` | No | Uses same-origin `/api/mood-entries`; serverless storage is in-memory. |
| Journal / diary | `client/src/pages/Journal.tsx`, `server/routes.ts` | No | Saves through `/api/journal-entries` and mirrors to browser `localStorage` for on-device persistence. |
| Safety plan | `client/src/pages/SafetyPlan.tsx`, `server/routes.ts` | No | Uses `/api/safety-plans`; serverless storage is in-memory. |
| Wellness activities | `client/src/pages/Wellness.tsx`, `server/routes.ts` | No | Uses seeded in-memory API data. |
| Support/resources pages | React pages | No | Static content and external links. |
| Crisis read-aloud volume button | Browser `speechSynthesis` | No | Uses built-in browser speech synthesis; no server/API key. |
| Split frontend/backend hosting | `client/src/lib/apiBase.ts` | Optional `VITE_API_BASE_URL` | Leave unset on Netlify when using included function redirects. Set only if hosting API elsewhere. |

## API-backed code present but not active

| Code / feature | Required key if re-enabled | Active now? | Why not active |
| --- | --- | --- | --- |
| Legacy root `index.html` Firebase Auth/Firestore | Firebase web app config; Google Auth provider setup | No for current Netlify React deploy | Netlify publishes `dist`, not repository root. |
| Legacy root `index.html` client-side Gemini chat | User-entered Google Gemini key stored in browser `localStorage` | No for current Netlify React deploy | Netlify publishes `dist`; React app does not include this feature. |
| `firebase-config.js` | Firebase web app config | No | Placeholder file; not imported by the React app. |
| `server/replit_integrations/chat/*` | `AI_INTEGRATIONS_OPENAI_API_KEY`, optional `AI_INTEGRATIONS_OPENAI_BASE_URL` | No | Routes are not registered in `server/index.ts` or `netlify/functions/api.ts`. |
| `server/replit_integrations/audio/*` | `AI_INTEGRATIONS_OPENAI_API_KEY`, optional `AI_INTEGRATIONS_OPENAI_BASE_URL`; runtime ffmpeg for conversion helpers | No | Routes are not registered in `server/index.ts` or `netlify/functions/api.ts`. |
| `server/replit_integrations/image/*` | `AI_INTEGRATIONS_OPENAI_API_KEY`, optional `AI_INTEGRATIONS_OPENAI_BASE_URL` | No | Routes are not registered in `server/index.ts` or `netlify/functions/api.ts`. |

## Current environment variable checklist

### Required for current deploy

None.

### Optional

```txt
VITE_API_BASE_URL=https://your-api-host.example.com
```

Use only if the frontend and API are hosted on different origins.

### Not required unless you re-enable inactive features

```txt
AI_INTEGRATIONS_OPENAI_API_KEY=...
AI_INTEGRATIONS_OPENAI_BASE_URL=...
```

Firebase project settings would also be needed if Firebase Auth/Firestore is brought back into the active React app.

## Important security note

Any API key pasted into chat or committed to source should be treated as exposed and rotated. Client-side keys in a static HTML app are visible to users; project-owned secret keys should stay server-side only.
