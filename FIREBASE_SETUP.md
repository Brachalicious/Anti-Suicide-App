# Firebase Setup Guide for Anti-Suicide App

## 🔥 Step-by-Step Firebase Configuration

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `anti-suicide-app` (or your choice)
4. Disable Google Analytics (optional)
5. Click "Create project"

### Step 2: Add Web App to Firebase Project

1. In your Firebase project, click the **Web icon** (</>) to add a web app
2. Register app nickname: `Mental Health Support App`
3. Check "Also set up Firebase Hosting" (optional)
4. Click "Register app"
5. **COPY the Firebase config object** - you'll need this!

It looks like this:
```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### Step 3: Enable Google Authentication

1. In Firebase Console, go to **Authentication** (left sidebar)
2. Click "Get started"
3. Click on **"Sign-in method"** tab
4. Click on **Google** provider
5. Toggle "Enable"
6. Select a support email (your email)
7. Click "Save"

### Step 4: Enable Firestore Database

1. In Firebase Console, go to **Firestore Database** (left sidebar)
2. Click "Create database"
3. Select **"Start in production mode"** (we'll add rules next)
4. Choose a Cloud Firestore location (closest to your users)
5. Click "Enable"

### Step 5: Set Up Firestore Security Rules

1. In Firestore Database, go to **"Rules"** tab
2. Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Click "Publish"

### Step 6: Configure Your App

Open `/Users/bracha/Desktop/Anti Suicide App/index.html` and find this section (around line 3932):

```javascript
// TODO: Replace with your Firebase config from Firebase Console
const firebaseConfig = {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

**Replace with YOUR config from Step 2!**

### Step 7: Add Authorized Domain (for Netlify)

1. In Firebase Console → **Authentication** → **Settings** tab
2. Scroll to "Authorized domains"
3. Click "Add domain"
4. Add your Netlify domain: `your-app-name.netlify.app`
5. Click "Add"

## 🎯 What Firebase Does for Your App

### Google Sign-In
- Users click "Sign in with Google" button
- One-click authentication with their Google account
- No password management needed

### Data Sync Across Devices
- **Diary entries** saved to cloud
- **Mood tracking** preserved
- **Safety plans** backed up
- **Adopted pets** synced
- Access from any device after signing in

### Real-Time Updates
- Changes sync instantly across all devices
- No data loss

### Secure Storage
- Each user can only access their own data
- Firebase handles all security
- Data encrypted in transit and at rest

## 🚀 Testing Locally

1. **Update Firebase config** in `index.html` with your credentials
2. **Start your server:**
   ```bash
   npm run dev
   ```
3. **Open:** http://localhost:3000
4. **Click "Sign in with Google"**
5. **Test:** Add diary entry, mood, etc. - should save to Firebase!

## 📋 Netlify Deployment

**No environment variables needed!** Firebase config is in the HTML file since it's designed to be public (it's protected by security rules).

Just push to GitHub and Netlify will deploy:
```bash
git add .
git commit -m "Add Firebase authentication and cloud sync"
git push origin main
```

## 🔒 Security Notes

- **Firebase API Key is PUBLIC** - this is normal and safe
- Security comes from Firestore rules (users can only access their own data)
- Never commit private keys or secrets
- The current setup is secure by default

## 🐛 Troubleshooting

### "auth/unauthorized-domain" error
**Solution:** Add your domain to Firebase → Authentication → Settings → Authorized domains

### "permission-denied" in Firestore
**Solution:** Check that Firestore rules are set correctly (see Step 5)

### Sign-in popup blocked
**Solution:** Allow popups for your site in browser settings

### Data not saving
**Solution:**
1. Check browser console for errors
2. Verify Firebase config is correct
3. Ensure user is signed in
4. Check Firestore rules allow write access

## 📊 Monitoring

View your app's usage in Firebase Console:
- **Authentication:** See who signed in
- **Firestore:** View stored data
- **Usage:** Monitor reads/writes (free tier: 50K reads/day, 20K writes/day)

## ✅ Verification Checklist

- [ ] Firebase project created
- [ ] Web app added to project
- [ ] Google authentication enabled
- [ ] Firestore database created
- [ ] Security rules configured
- [ ] Firebase config added to index.html
- [ ] Tested sign-in locally
- [ ] Netlify domain added to authorized domains
- [ ] Deployed to Netlify
- [ ] Tested sign-in on live site

## 🎉 You're Done!

Users can now:
1. Click "Sign in with Google"
2. Use the app as normal
3. Their data automatically saves to cloud
4. Access from any device by signing in again

All data persists forever (unless they sign out and clear localStorage without syncing).
