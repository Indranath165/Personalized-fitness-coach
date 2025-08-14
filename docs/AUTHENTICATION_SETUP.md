# 🚀 Multi-Authentication Setup Guide for FitGenie

This guide will help you configure Google OAuth and Phone authentication in your Supabase project.

## 📱 Phone Authentication Setup

### 1. Enable Phone Authentication in Supabase Dashboard

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Authentication** → **Settings**
4. Under **Auth Providers**, enable **Phone**

### 2. Configure SMS Provider

Supabase supports multiple SMS providers. Choose one:

#### Option A: Twilio (Recommended)
1. Go to [Twilio Console](https://console.twilio.com/)
2. Create an account or sign in
3. Get your **Account SID** and **Auth Token**
4. Purchase a phone number
5. In Supabase Dashboard → **Authentication** → **Settings** → **Phone Auth**:
   - Provider: Twilio
   - Account SID: `your_twilio_account_sid`
   - Auth Token: `your_twilio_auth_token`
   - Phone Number: `your_twilio_phone_number`

#### Option B: MessageBird
1. Create a MessageBird account
2. Get your API key
3. Configure in Supabase with MessageBird credentials

#### Option C: Textlocal
1. Create a Textlocal account
2. Get your API key
3. Configure in Supabase with Textlocal credentials

### 3. Configure Phone Number Validation

In Supabase Dashboard → **Authentication** → **Settings**:
- Set **Phone Number Validation Rules** (optional)
- Configure **OTP Length** (default: 6 digits)
- Set **OTP Expiry** (default: 60 seconds)

## 🔐 Google OAuth Setup

### 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Google+ API** (if not already enabled)
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client IDs**
5. Configure OAuth consent screen:
   - Application type: Web application
   - Add your domain to authorized domains

### 2. Configure OAuth Client

1. **Application type**: Web application
2. **Name**: FitGenie (or your app name)
3. **Authorized JavaScript origins**:
   ```
   http://localhost:3000
   https://your-domain.com
   ```
4. **Authorized redirect URIs**:
   ```
   http://localhost:3000/auth/callback
   https://your-domain.com/auth/callback
   https://your-project-ref.supabase.co/auth/v1/callback
   ```

### 3. Configure in Supabase

1. Go to Supabase Dashboard → **Authentication** → **Settings**
2. Under **Auth Providers**, enable **Google**
3. Add your Google OAuth credentials:
   - **Client ID**: `your_google_client_id.googleusercontent.com`
   - **Client Secret**: `your_google_client_secret`

## 🛠️ Environment Variables

Create a `.env.local` file in your project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google OAuth (Optional - only if you need server-side access)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Twilio (Optional - only if you need server-side SMS)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

## 🧪 Testing Authentication

### Test Phone Authentication:
1. Click "Phone" button on login/signup
2. Enter a valid phone number
3. Check your phone for SMS verification code
4. Enter the 6-digit code

### Test Google OAuth:
1. Click "Google" button on login/signup
2. Complete Google OAuth flow
3. Should redirect back to app after success

## 🔧 Troubleshooting

### Phone Authentication Issues:
- **"Phone provider not configured"**: Check SMS provider setup in Supabase
- **"SMS not received"**: Verify phone number format and SMS provider balance
- **"Invalid OTP"**: Check code expiry and ensure correct entry

### Google OAuth Issues:
- **"OAuth provider not enabled"**: Enable Google provider in Supabase Dashboard
- **"Redirect URI mismatch"**: Ensure redirect URIs match exactly in Google Console
- **"Client ID not found"**: Verify Client ID is correctly copied from Google Console

### General Issues:
- **"User not confirmed"**: For email signup, check email for confirmation link
- **"Invalid credentials"**: Check email/password combination
- **"Rate limit exceeded"**: Too many attempts, wait before retrying

## 📱 Phone Number Formats

The app automatically formats phone numbers, but ensure they follow E.164 format:
- US: +1XXXXXXXXXX (e.g., +15551234567)
- UK: +44XXXXXXXXX (e.g., +447911123456)
- International: +[country code][number]

## 🚀 Production Deployment

Before deploying to production:

1. **Update redirect URIs** in Google Cloud Console with production domain
2. **Configure production SMS settings** in Supabase
3. **Set environment variables** in your hosting platform
4. **Test all authentication flows** in production environment
5. **Monitor authentication logs** in Supabase Dashboard

## 📋 Checklist

- [ ] Supabase project created
- [ ] Phone authentication enabled in Supabase
- [ ] SMS provider (Twilio/MessageBird/Textlocal) configured
- [ ] Google Cloud project created
- [ ] Google OAuth client configured
- [ ] Google provider enabled in Supabase
- [ ] Environment variables set
- [ ] Redirect URIs configured correctly
- [ ] Authentication flows tested locally
- [ ] Production deployment configured

## 🆘 Support

If you need help:
1. Check [Supabase Documentation](https://supabase.com/docs/guides/auth)
2. Visit [Supabase Discord](https://discord.supabase.com/)
3. Check authentication logs in Supabase Dashboard
4. Review browser console for client-side errors

---

**Note**: The PhoneAuth component in your app handles the complete phone authentication flow, including OTP verification. The Google OAuth flow is handled by Supabase's built-in OAuth system.
