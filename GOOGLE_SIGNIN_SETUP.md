Google Sign-In setup for this project

This project uses Firebase Auth (Google provider) via the Firebase Web SDK. The in-page code attempts sign-in with a popup and falls back to a redirect when the popup is blocked (mobile browsers or popup blockers).

Quick setup

1. Firebase project
   - Go to https://console.firebase.google.com and open the `antisuicideapp` project (or create your own and update the firebase config in `index.html`).
   - In "Authentication" > "Sign-in method" enable Google sign-in.

2. OAuth consent & client ID (for localhost testing)
   - If you need a custom OAuth consent screen, configure it in Google Cloud Console (APIs & Services > OAuth consent screen).
   - Create an OAuth 2.0 Client ID (Web application). Add authorized origins and redirect URIs used during testing, for example:
     - Origin: http://localhost:5500
     - Redirect URI: http://localhost:5500

3. Local testing
   - This repo includes a simple debug server script. From the workspace root run (macOS / zsh):

```bash
# serve from repo root on port 5500
python3 -m http.server 5500 --directory "."
```

   - Open http://localhost:5500 in your browser and click "Sign in" in the top-right to test.

Notes and troubleshooting

- Popup blocked: the code tries a popup first and then automatically uses sign-in redirect as a fallback.
- If sign-in doesn't return to your page, make sure your OAuth client redirect URI matches exactly (including port).
- If you want to use the newer Google Identity Services (GSI) button instead of Firebase's popup/redirect flow, that's possible but requires different wiring. Let me know and I can add that.
