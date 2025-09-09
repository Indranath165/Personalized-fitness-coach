# 📱 SMS Provider Setup Guide for International Numbers (Including India)

## 🚨 Current Issue
You're getting "Unsupported phone provider" because Supabase doesn't have any SMS provider configured. For international numbers like India (+91), you need to set up an SMS service that supports global messaging.

## 🌍 Recommended SMS Providers for India & Global Support

### 1. **Twilio** (Recommended - Best Global Coverage)
- ✅ **India Support**: Excellent
- ✅ **Global Coverage**: 180+ countries
- ✅ **Reliability**: Industry standard
- 💰 **Cost**: ~$0.0075 per SMS in India

#### Setup Steps:
1. Go to [Twilio Console](https://console.twilio.com/)
2. Create account and verify your identity
3. Buy a phone number (you can get a US number for $1/month)
4. Get your credentials:
   - Account SID: `ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - Auth Token: `your_auth_token`
   - Phone Number: `+1xxxxxxxxxx`

### 2. **MessageBird** (Good Alternative)
- ✅ **India Support**: Good
- ✅ **Global Coverage**: 200+ countries
- 💰 **Cost**: Competitive pricing

### 3. **AWS SNS** (Enterprise Option)
- ✅ **India Support**: Excellent
- ✅ **Scalability**: Very high
- 💰 **Cost**: Pay as you go

## 🔧 Supabase Configuration

### Step 1: Enable Phone Auth in Supabase
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Authentication** → **Settings**
4. Under **Auth Providers**, enable **Phone**

### Step 2: Configure SMS Provider (Twilio Example)
1. In Supabase Dashboard → **Authentication** → **Settings**
2. Scroll to **Phone Auth Settings**
3. Configure:
   ```
   Provider: Twilio
   Account SID: ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   Auth Token: your_twilio_auth_token
   Phone Number: +1234567890
   ```

### Step 3: Set Rate Limits & Security
- **OTP Length**: 6 digits
- **OTP Expiry**: 60 seconds
- **Rate Limiting**: 5 attempts per hour per phone number

## 📞 Phone Number Format for India

Your number `+911234567890` should work perfectly once SMS is configured. The component now handles:

```typescript
// Supported formats:
"+911234567890"     // ✅ Full international format
"911234567890"      // ✅ Will be converted to +911234567890
"1234567890"        // ❌ Needs country code

// US examples:
"+15551234567"      // ✅ Full international format
"15551234567"       // ✅ Will be converted to +15551234567
"5551234567"        // ✅ Will be converted to +15551234567
```

## 🧪 Testing Your Setup

### Test with Twilio:
1. Configure Twilio in Supabase
2. Try your number: `+911234567890`
3. You should receive SMS within 30 seconds

### Verify Countries Supported:
- India: ✅ `+91`
- USA: ✅ `+1`
- UK: ✅ `+44`
- Canada: ✅ `+1`
- Australia: ✅ `+61`

## 💰 Cost Estimation

### Twilio Pricing (as of 2024):
- **India SMS**: ~$0.0075 per message
- **US SMS**: ~$0.0075 per message
- **Phone Number**: $1/month (US number works globally)
- **100 SMS/month**: ~$0.75

### Free Trial:
- Twilio gives $15 credit for testing
- That's ~2000 SMS messages for free testing

## 🔐 Security Best Practices

### Rate Limiting:
```javascript
// Supabase automatically handles:
- 5 SMS per phone number per hour
- 10 SMS per IP address per hour
- Exponential backoff for repeated attempts
```

### Phone Verification:
- OTP expires after 60 seconds
- Maximum 3 verification attempts
- Phone number is verified before allowing signup

## 🛠️ Environment Variables

Add to your `.env.local`:
```env
# SMS Provider (Optional - configured in Supabase Dashboard)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

## 🚀 Enable Phone Auth in Your App

Once configured, update the PhoneAuth component:

```typescript
// Uncomment these lines in PhoneAuth.tsx:
const { error } = await supabase.auth.signInWithOtp({
  phone: formattedPhone,
});
```

## 🔄 Current App Behavior

Right now, the app shows:
- ⚠️ "Phone authentication is not yet configured"
- 💡 Helpful error messages
- 📱 Proper international number formatting
- 🔄 Ready to work once SMS provider is set up

## 📋 Quick Setup Checklist

- [ ] Sign up for Twilio account
- [ ] Buy a phone number
- [ ] Get Account SID and Auth Token
- [ ] Configure in Supabase Dashboard
- [ ] Enable Phone Auth in Supabase
- [ ] Test with your Indian number
- [ ] Uncomment phone auth code in component

## 🆘 Troubleshooting

### "Unsupported phone provider":
- No SMS provider configured in Supabase
- **Solution**: Set up Twilio/MessageBird

### "SMS not delivered to India":
- Provider doesn't support India
- **Solution**: Use Twilio (supports India)

### "Invalid phone number format":
- Number format issue
- **Solution**: Use +911234567890 format

---

**Next Step**: Set up Twilio account and configure it in Supabase to enable SMS for your Indian number!
