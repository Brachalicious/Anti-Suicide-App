# 🚀 MVP Testing Checklist for MysticMinded

## Before Public Launch - Test Everything!

### 🔐 Authentication & User Flow
- [ ] Sign up with new email works
- [ ] Sign in with existing account works
- [ ] Password reset email is received
- [ ] User stays logged in after refresh
- [ ] Sign out works properly

### 📊 Core Features
- [ ] **Mood Tracking**
  - [ ] Can select feelings/emotions
  - [ ] Mood scale works (1-10)
  - [ ] Diary entry saves
  - [ ] Mood log displays historical entries
  - [ ] Graph/chart shows mood trends

- [ ] **Safety Plan**
  - [ ] All 6 steps are visible and editable
  - [ ] Can add warning signs
  - [ ] Can add coping strategies
  - [ ] Can add contact information
  - [ ] Save button works and shows confirmation
  - [ ] Data persists after page reload

- [ ] **Crisis Tools**
  - [ ] STOP sign button opens overlay
  - [ ] Breathing exercises play audio
  - [ ] Breathing timer works correctly
  - [ ] **Scream Circle** (Chrome/Edge only):
    - [ ] Opens overlay
    - [ ] Browser asks for microphone permission
    - [ ] Shows live transcription of speech
    - [ ] Circle animates while speaking
    - [ ] Supportive responses appear
    - [ ] Stop button works and shows green circle
    - [ ] Close button resets everything

- [ ] **Virtual Parent**
  - [ ] Opens chat interface
  - [ ] Can type messages
  - [ ] AI responds with supportive messages
  - [ ] Gemini API is working
  - [ ] Responses are appropriate and safe
  - [ ] Chat history is saved

- [ ] **Affirmations**
  - [ ] "Today's Affirmation" displays random affirmation
  - [ ] Can click to see new affirmation
  - [ ] Can save affirmation to book
  - [ ] Affirmation book shows saved affirmations
  - [ ] New affirmations (Gam Ze Yavor, Psalm 139) appear

### 📞 Crisis Resources
- [ ] **Phone Numbers & Hotlines**
  - [ ] 988 Suicide Lifeline link works
  - [ ] Crisis Text Line link works
  - [ ] the.helpline (929-801-2301) is visible
  - [ ] Neshamos Helpline (646-580-9842) is visible
  - [ ] All phone numbers are clickable (tel: links)

- [ ] **Frum Community Support**
  - [ ] Hatzoloh numbers are correct
  - [ ] Amudim (646-517-0222) is listed
  - [ ] Lebainu is listed
  - [ ] All community resources are visible

### 🎨 Visual & UX
- [ ] Logo displays correctly (green colors)
- [ ] Favicon shows in browser tab (💚)
- [ ] All buttons are clickable
- [ ] Navigation works between sections
- [ ] Colors are soothing (greens)
- [ ] No broken images or missing assets
- [ ] Scrolling is smooth

### 📱 Mobile Responsiveness
- [ ] Test on iPhone/iOS Safari
- [ ] Test on Android Chrome
- [ ] All buttons are tappable
- [ ] Text is readable (not too small)
- [ ] No horizontal scrolling
- [ ] Modals/overlays work on mobile
- [ ] Phone number links work (tap to call)

### 🌐 Browser Compatibility
- [ ] Chrome (primary) - All features work
- [ ] Safari - Core features work (Scream Circle won't work)
- [ ] Edge - All features work
- [ ] Firefox - Core features work (Scream Circle shows warning)

### 🔒 Legal & Privacy
- [ ] Privacy Policy opens and is readable
- [ ] Terms of Service opens and is readable
- [ ] Footer is visible at bottom of page
- [ ] Copyright notice is present
- [ ] Disclaimer about professional help is visible

### ⚡ Performance
- [ ] Page loads in under 3 seconds
- [ ] No console errors (check developer tools)
- [ ] Firebase connection works
- [ ] Images load quickly
- [ ] No lag when clicking buttons

### 🐛 Known Issues to Check
- [ ] Feature Policy warnings in console (harmless, can ignore)
- [ ] Scream Circle only works in Chrome/Edge (expected)
- [ ] Audio files load properly for breathing exercises

---

## 📝 Post-Testing Actions

### If Everything Works:
✅ Announce MVP launch!
✅ Share link: https://fightsuicideproject.netlify.app
✅ Monitor for user feedback
✅ Check Firebase usage/costs

### If Issues Found:
🔧 Document the issue
🔧 Fix in code
🔧 Test locally
🔧 Commit and push
🔧 Re-test on Netlify

---

## 🎯 Critical Pre-Launch Checks

**MUST TEST BEFORE PUBLIC RELEASE:**
1. ✅ 988 and crisis hotline numbers work
2. ✅ Safety Plan saves data
3. ✅ User authentication works
4. ✅ Mobile version is usable
5. ✅ No inappropriate AI responses from Virtual Parent
6. ✅ Privacy Policy and Terms are accessible

---

**Live Site:** https://fightsuicideproject.netlify.app
**GitHub Repo:** https://github.com/Brachalicious/Anti-Suicide-App

**Last Updated:** March 24, 2026
