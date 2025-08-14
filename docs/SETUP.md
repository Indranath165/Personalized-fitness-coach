# FitGenie Quick Setup Guide

This guide will help you get FitGenie up and running in minutes!

## Step 1: Environment Setup

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Update `.env.local` with your actual values (see below for how to get them)

## Step 2: Get Supabase Credentials

1. Go to [supabase.io](https://supabase.io) and create a free account
2. Click "New Project" 
3. Choose your organization and create a project
4. Wait for setup to complete (2-3 minutes)
5. Go to Settings → API
6. Copy your Project URL and Anon Key to `.env.local`

## Step 3: Set Up Database

1. In your Supabase project, go to the SQL Editor
2. Create a new query
3. Copy and paste the entire contents of `database/schema.sql`
4. Click "Run" to execute the SQL
5. Verify tables were created in the Table Editor

## Step 4: Get Google Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click "Get API key" → "Create API key in new project"
4. Copy the API key to `.env.local`

## Step 5: Configure Authentication (Optional)

### Enable Google OAuth:
1. In Supabase, go to Authentication → Providers
2. Enable Google provider
3. Add your OAuth credentials from Google Cloud Console

### Email Settings:
1. Go to Authentication → Settings
2. Configure email templates if desired
3. For production, configure SMTP settings

## Step 6: Run the Application

```bash
npm install
npm run dev
```

Navigate to [http://localhost:3000](http://localhost:3000)

## Step 7: Test the Application

1. Sign up for a new account
2. Complete the profile setup
3. Generate your first workout
4. Track your progress!

## Environment Variables Reference

```env
# Required for basic functionality
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
GEMINI_API_KEY=your-gemini-api-key-here

# Optional for development
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=any-random-string-here
```

## Troubleshooting

### Common Issues:

1. **"Cannot connect to Supabase"**
   - Verify your Supabase URL and anon key
   - Check if your project is running in Supabase dashboard

2. **"Failed to generate workout"**
   - Verify your Gemini API key is correct
   - Check if you have quota remaining in Google AI Studio

3. **"User profile not found"**
   - Make sure you ran the database schema SQL
   - Complete the profile setup after signing up

4. **Authentication issues**
   - Check if email confirmation is required in Supabase Auth settings
   - Verify your redirect URLs are correct

### Development Tips:

- Use Supabase's real-time database features for instant updates
- Monitor API usage in Google AI Studio
- Check Supabase logs for debugging authentication issues
- Use browser dev tools to inspect network requests

## Need Help?

- Check the main README.md for detailed documentation
- Review Supabase documentation for database issues
- Visit Google AI Studio documentation for Gemini API help
- Open an issue in the GitHub repository for bugs

Happy coding! 🏋️‍♂️💪
