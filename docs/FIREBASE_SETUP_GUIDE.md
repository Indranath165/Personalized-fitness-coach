# Firebase Phone Authentication Setup Guide

## Overview
This guide will help you set up Firebase Phone Authentication for your app, which provides:
- ✅ **10,000 free verifications per month**
- ✅ **Excellent support for Indian numbers**
- ✅ **Reliable SMS delivery worldwide**
- ✅ **Google's infrastructure**

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `personalized-fitness-coach`
4. Enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Phone Authentication

1. In your Firebase project, go to **Authentication** → **Sign-in method**
2. Click on **Phone** provider
3. Toggle **Enable** to ON
4. Click **Save**

## Step 3: Get Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll down to "Your apps"
3. Click **Web app** icon (`</>`)
4. Register app name: `fitness-coach-web`
5. Copy the Firebase configuration object

## Step 4: Update Firebase Config

Replace the placeholder values in `src/lib/firebase/config.ts`:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

## Step 5: Add Authorized Domains

1. In Firebase Console → **Authentication** → **Settings** → **Authorized domains**
2. Add your domains:
   - `localhost` (for development)
   - `your-production-domain.com` (for production)

## Step 6: Configure Supabase Integration (Optional)

If you want to sync Firebase users with Supabase:

1. In Supabase Dashboard → **Authentication** → **Settings**
2. Add Firebase as a custom provider
3. Use Firebase ID tokens for Supabase authentication

## Step 7: Test Phone Authentication

1. Start your development server: `npm run dev`
2. Go to login/signup page
3. Click "Continue with Phone"
4. Test with your number: `+919932626488`

## Important Notes for Indian Numbers

### Supported Formats:
- ✅ `+919932626488` (recommended)
- ✅ `+91 9932626488`
- ✅ `919932626488` (auto-formatted)

### Testing:
- Use your real phone number for testing
- Firebase provides excellent delivery to Indian numbers
- SMS typically arrives within 30 seconds

## Pricing Information

### Free Tier:
- **10,000 verifications/month** - completely free
- Perfect for small to medium apps
- No credit card required for free tier

### Paid Tier (if you exceed free tier):
- **$0.006 per verification** (~₹0.50 per SMS)
- Much cheaper than most SMS providers
- Automatic scaling

## Troubleshooting

### Common Issues:

1. **"Invalid phone number"**
   - Ensure number includes country code (+91 for India)
   - Format: +91XXXXXXXXXX

2. **"reCAPTCHA error"**
   - Add your domain to authorized domains
   - Disable ad blockers during testing

3. **SMS not received**
   - Check number format
   - Verify phone provider allows SMS
   - Try with different number

4. **Quota exceeded**
   - You've used 10,000 free verifications
   - Upgrade to paid plan or wait for next month

## Security Best Practices

1. **Never expose Firebase config secrets** (they're safe to be public)
2. **Set up Firebase Security Rules** for database access
3. **Enable App Check** for production (optional)
4. **Monitor usage** in Firebase Console

## Cost Comparison

| Provider | Free Tier | Cost per SMS (India) | Monthly Limit |
|----------|-----------|---------------------|---------------|
| Firebase | 10,000/month | $0.006 (~₹0.50) | 10,000 |
| Twilio | $15 credit | $0.0075 (~₹0.62) | ~2,000 |
| MessageBird | €20 credit | €0.05 (~₹4.50) | ~400 |

**Firebase is the clear winner for Indian numbers!**

## Next Steps

1. Complete the Firebase setup using this guide
2. Test phone authentication with your number
3. Your app will have reliable phone auth with 10,000 free verifications/month!

Need help? The Firebase console provides excellent documentation and the setup is straightforward.
