# 🧪 Hi Self — Full Testing Checklist

**Test URL:** https://fightsuicideproject.netlify.app
**Auto-test dashboard:** https://fightsuicideproject.netlify.app/test.html
**Last updated:** July 1, 2026 (after commit `4a760b2` — store-ready pass)

---

## 📋 How to use this checklist

1. **Do P0 tests first** — anything that fails there = don't ship.
2. **Then P1** — anything that fails there = App Store / Google Play will reject you.
3. **Then P2** — the features I built in this last session; make sure I didn't break something.
4. **Then P3** — everything else.
5. **Test on both a desktop AND a phone** if you can. iOS Safari + Chrome Android + a desktop Chrome cover ~95% of your users.
6. Tap the ☐ boxes as you go. Note any bugs at the bottom.

---

## 🚨 P0 — CRISIS-CRITICAL (must work or people can't get help)

### 1. Tap-to-call & tap-to-text (just shipped)

- [ ] Dashboard → tap the **📞 Call 988** button → your phone's dialer opens with `988` pre-filled
- [ ] Dashboard → tap the **💬 Text 741741** button → SMS opens with `HOME` pre-typed
- [ ] Dashboard → tap the **🚑 Hatzoloh** button → dialer opens with `718-230-1000`
- [ ] Open the Help Guide chat bubble → type "hi" → send → **the "988" in the reply is a pink underlined link** → tap it → dialer opens
- [ ] Open Virtual Parent chat → type something → **any "988" in the reply is clickable**
- [ ] Open MysticMinded³³ chat → type something → **any "988" in the reply is clickable**
- [ ] Global footer at bottom of any screen → tap each red link (988, 741741, Hatzoloh, 911) → all work

### 2. Footer visible on every screen

- [ ] Dashboard → scroll to bottom → see 🆘 crisis banner + Privacy/Terms/Crisis/Contact links
- [ ] Talk to Hashem → scroll to bottom → same footer
- [ ] My Diary → scroll to bottom → same footer
- [ ] Chizuk → scroll to bottom → same footer
- [ ] Account Settings → scroll to bottom → same footer

### 3. Privacy Policy + Terms accessible

- [ ] Direct visit → https://fightsuicideproject.netlify.app/privacy.html → loads, looks good
- [ ] Direct visit → https://fightsuicideproject.netlify.app/terms.html → loads, looks good
- [ ] From footer → tap "Privacy Policy" → opens in new tab
- [ ] From footer → tap "Terms of Service" → opens in new tab

---

## ⚖️ P1 — STORE-BLOCKERS (Apple/Google will reject without these)

### 4. First-launch disclaimer modal (just shipped)

- [ ] **Open the site in a private/incognito window** → you should IMMEDIATELY see a full-screen 💗 "Welcome to Hi Self" modal
- [ ] Try to scroll behind the modal → the background is locked, can't interact
- [ ] Tap-to-call 988 button inside the modal → works
- [ ] Tap "I understand — let's begin" → modal disappears, you can use the app
- [ ] Refresh the page → **modal does NOT reappear** (acceptance was remembered)
- [ ] Sign in with Google → modal reappears (new account = new consent)
- [ ] Accept it, sign out, sign back in as same user → modal does NOT reappear

### 5. AI transparency notices in chatbots (just shipped)

- [ ] Open Help Guide (bubble on dashboard) → **blue "🤖 AI notice" box visible above chat input**
- [ ] Open Virtual Parent (💕 tab) → **pink "🤖 These are AI companions, not real people" box visible**
- [ ] Open MysticMinded³³ (violet section) → **purple "🤖 You're chatting with AI, not a person" box visible**
- [ ] Each notice contains a working tap-to-call 988 link

### 6. Full account deletion (just shipped)

⚠️ **Test with a THROW-AWAY account**, not your main one!

- [ ] Sign in with a test Google account
- [ ] Write a diary entry, save it
- [ ] Go to ⚙️ Account Settings → scroll to red "🗑️ Delete Account" box
- [ ] Type `DELETE` in the confirmation input
- [ ] Tap "🗑️ Permanently Delete My Account"
- [ ] See two confirm dialogs (the local one, then the Firebase one) — say Yes to both
- [ ] See "✅ Your account and all data have been permanently deleted"
- [ ] Page reloads
- [ ] Try to sign in with the same Google account → **Firebase says account doesn't exist** (or creates a fresh one with zero data)
- [ ] Log into your Firebase Console → Authentication → Users → **the deleted account is GONE**
- [ ] Firestore → users → **that UID's document is GONE**

### 7. Apple sign-in button (scaffolded)

- [ ] Top-right auth bar shows both "Sign in" (with Google icon) AND "Apple" (with Apple logo)
- [ ] Tap "Apple" → **you should see a friendly "🍎 Sign in with Apple is coming soon!" alert** (because Apple provider isn't enabled in Firebase yet — this is expected until you register an Apple Developer account)
- [ ] No scary developer errors appear

### 8. PWA installable (just shipped)

**On iPhone Safari:**
- [ ] Open https://fightsuicideproject.netlify.app
- [ ] Tap the Share button (square with arrow up)
- [ ] Scroll down → tap "Add to Home Screen"
- [ ] Name shows as "Hi Self" (not the URL)
- [ ] Icon on home screen looks correct (pink heart)
- [ ] Tap the icon → app opens FULLSCREEN (no Safari address bar)
- [ ] Test: force airplane mode → open the app → **the shell loads** (this is service-worker offline support)

**On Android Chrome:**
- [ ] Open the site → Chrome menu (⋮) → "Install app" or "Add to Home Screen"
- [ ] Look for the "install" icon in the URL bar
- [ ] Installed app opens standalone (no Chrome UI)

**Desktop Chrome:**
- [ ] URL bar shows a small **⊕ install icon** on the right
- [ ] Click it → installs as a windowed app

### 9. Service worker registered

- [ ] Open DevTools (F12 on desktop) → Application tab → Service Workers
- [ ] `/service-worker.js` should be listed → status = **activated and is running**
- [ ] Application tab → Manifest → all fields populated (name, icons, shortcuts)
- [ ] Application tab → Storage → tap "Clear site data" once, then reload — SW should re-register on next visit

---

## 🎯 P2 — RECENT CHANGES (last 5 commits)

### 10. Chizuk Videos split into Awareness + Inspiration

- [ ] Chizuk → 🎬 Videos tab
- [ ] Top: purple "🎓 Awareness" heading with one video ("Understanding Suicide")
- [ ] Below: green "✨ Inspiration" heading with 8 videos
- [ ] Each video plays when tapped

### 11. Chizuk Videos — the 7 new videos added

Under 🎓 Awareness:
- [ ] Understanding Suicide (`6M5jQxrp1zs`) — plays

Under ✨ Inspiration (the 6 new ones + originals):
- [ ] All videos load thumbnails
- [ ] Each plays inline when tapped

### 12. Diary entries — timezone + note text (older fix)

- [ ] My Diary → write a new entry with a note like "hello world" → save
- [ ] Refresh the page
- [ ] The entry should:
  - Show today's date (not yesterday's, if it's late at night in your timezone)
  - Show the "hello world" text (not empty)

### 13. Personalized greetings

- [ ] ⚙️ Account Settings → Display Name → type "TestName" → Save
- [ ] Dashboard should now greet you "Hi TestName 💗"
- [ ] Virtual Parent → welcome message should say "TestName" not "sweetheart"
- [ ] Send a message to Virtual Parent → the AI's reply should call you TestName (once, at the top — not twice!)
- [ ] Reset the display name → greetings revert to your Google first name

### 14. Chatbots reply with real AI (BYOK path)

- [ ] ⚙️ Account Settings → paste your free Gemini key (starts `AIzaSy…`) → Save
- [ ] MysticMinded³³ → type "I'm feeling sad" → tap send
- [ ] Reply should be a full, thoughtful paragraph (not truncated mid-sentence)
- [ ] Reply should mention your name (if you set one)
- [ ] Any "988" in the reply is a tappable pink link

### 15. Chatbots without a key → BYOK invite

- [ ] ⚙️ Account Settings → clear your Gemini key
- [ ] MysticMinded³³ → type "hi" → send
- [ ] Reply should be: "💜 I'm here for you and I want to help… 💡 To turn on AI replies, paste a free Google Gemini key…"
- [ ] The `988` in the reply is tappable
- [ ] Try Virtual Parent → same behavior
- [ ] Try Help Guide → same behavior

---

## 🔧 P3 — CORE FEATURES (should already work, spot-check)

### 16. Sign in / Sign out

- [ ] "Sign in" (Google) button → opens Google popup → signs in
- [ ] Your name + photo appear top-right
- [ ] Refresh → still signed in
- [ ] Click your name → dropdown appears
- [ ] Click "Sign out" → back to logged-out view

### 17. Mood + Diary

- [ ] Add a mood entry → saves
- [ ] View past entries → sorted by date
- [ ] Delete an entry → confirms + removes

### 18. Safety Plan

- [ ] Fill out warning signs → save → refresh → still there
- [ ] Add coping strategies → save → refresh → still there
- [ ] Add support contacts → save → refresh → still there
- [ ] Export/print button works

### 19. Breathing overlay

- [ ] Tap the breathing button → overlay opens
- [ ] Animation cycles smoothly
- [ ] Close button works

### 20. Guided Meditation

- [ ] Open it → your microphone permission is requested (safe to say No for a quick test)
- [ ] Timer runs
- [ ] Close cleans up (no lingering timer, no mic light stuck on)

### 21. Live Mirror

- [ ] Open it → camera permission requested
- [ ] Front camera video appears
- [ ] "🔄 Flip Camera" toggles front/back (mobile only)
- [ ] Affirmation text shows
- [ ] Close button works

### 22. Resources tab

- [ ] All hotline sections expand/collapse
- [ ] Every phone button dials the number
- [ ] Every SMS button opens Messages with the pre-filled body
- [ ] Hospital listings display

### 23. Talk to Hashem / Tehillim

- [ ] Section opens without console errors
- [ ] Tehillim chapters navigate (prev/next)
- [ ] Audio plays if available

### 24. Wall of Hope

- [ ] Shared posts load
- [ ] You can add a message
- [ ] Your own posts show as "yours" with a delete option

---

## 📱 P4 — CROSS-BROWSER / CROSS-DEVICE

- [ ] Desktop Chrome — everything works
- [ ] Desktop Safari — everything works
- [ ] Desktop Firefox — everything works
- [ ] iPhone Safari — everything works (this is what iOS App Store reviewers use!)
- [ ] iPhone Chrome — everything works
- [ ] Android Chrome — everything works
- [ ] Android Samsung Internet — everything works
- [ ] iPad Safari — layout doesn't break

---

## 🎨 P5 — POLISH (nice to have before store submission)

- [ ] No JavaScript errors in browser console on ANY screen
- [ ] No 404s in the Network tab
- [ ] All images have alt text (for screen readers + App Store accessibility)
- [ ] Text is readable — no white-on-white anywhere
- [ ] No text is cut off on 320px-wide screens (smallest phone size)
- [ ] All modals close with an ✕ button
- [ ] No modal traps focus (Tab key can escape)

---

## 🐛 Bug log (add anything you find)

| # | Where you found it | What went wrong | Screenshot? |
|---|-------------------|-----------------|-------------|
| 1 |                    |                 |             |
| 2 |                    |                 |             |
| 3 |                    |                 |             |

---

## ✅ Once you've done all P0 + P1 tests

You're ready to:
1. Register Google Play developer account ($25)
2. Register Apple Developer account ($99/yr)
3. Wrap the PWA with PWABuilder.com for Android
4. Wrap the PWA with Capacitor for iOS
5. Submit to both stores

**Report back** — tell me:
- Which items ✅ passed
- Which items ❌ failed (with what browser/device)
- Any new bugs you spot

I'll fix anything red before you submit.
