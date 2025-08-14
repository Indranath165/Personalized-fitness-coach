# FitGenie Deployment Guide

## Prerequisites

Before deploying, ensure you have:
- A Supabase account and project
- A Google Cloud Platform account with Gemini API access
- A Netlify account for deployment

## Step 1: Supabase Setup

### 1.1 Create Supabase Project
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Choose your organization and fill in project details
4. Wait for the project to be created

### 1.2 Configure Database Schema
1. In your Supabase dashboard, go to the SQL Editor
2. Copy and paste the contents of `supabase/schema.sql` from this project
3. Run the SQL to create all tables, functions, and security policies

### 1.3 Configure Authentication
1. In Supabase dashboard, go to Authentication > Settings
2. Enable email authentication
3. For Google OAuth (optional):
   - Go to Authentication > Providers
   - Enable Google provider
   - Add your Google OAuth credentials

### 1.4 Get API Keys
1. Go to Settings > API
2. Copy your Project URL and anon/public key
3. Save these for the environment variables

## Step 2: Google Gemini AI Setup

### 2.1 Get Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Create a new API key
3. Save the API key for environment variables

## Step 3: Environment Configuration

### 3.1 Create Environment File
1. Copy `.env.example` to `.env.local`
2. Fill in your actual values:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Google Gemini AI Configuration  
GEMINI_API_KEY=your_gemini_api_key_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 4: Local Development

### 4.1 Install Dependencies
```bash
npm install
```

### 4.2 Run Development Server
```bash
npm run dev
```

### 4.3 Test the Application
1. Open http://localhost:3000 (or the port shown in terminal)
2. Create a new account
3. Complete profile setup
4. Test workout generation
5. Test workout tracking
6. Check progress charts

## Step 5: Netlify Deployment

### 5.1 Build Configuration
The project includes a `netlify.toml` file with the following configuration:
- Build command: `npm run build`
- Publish directory: `.next`
- Node.js version: 18.x
- Next.js runtime for serverless functions

### 5.2 Deploy to Netlify

#### Option A: Git Deployment (Recommended)
1. Push your code to GitHub/GitLab
2. Connect your repository to Netlify
3. Configure environment variables in Netlify dashboard:
   - Go to Site settings > Environment variables
   - Add all the variables from your `.env.local` file
4. Deploy automatically

#### Option B: Manual Deployment
1. Build the project locally:
   ```bash
   npm run build
   ```
2. Deploy the `.next` folder to Netlify

### 5.3 Configure Environment Variables in Netlify
1. In Netlify dashboard, go to Site settings > Environment variables
2. Add these variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `GEMINI_API_KEY`
   - `NEXT_PUBLIC_APP_URL` (set to your Netlify domain)

### 5.4 Update Supabase URL Configuration
1. In your Supabase dashboard, go to Authentication > URL Configuration
2. Add your Netlify domain to the allowed redirect URLs
3. Format: `https://your-site.netlify.app/auth/callback`

## Step 6: Post-Deployment Configuration

### 6.1 Test Production Build
1. Verify all pages load correctly
2. Test user registration and login
3. Test workout generation with Gemini AI
4. Test workout tracking functionality
5. Verify progress charts display data

### 6.2 Monitor and Debug
- Check Netlify function logs for API issues
- Monitor Supabase logs for database errors
- Use browser dev tools to debug frontend issues

## Troubleshooting

### Common Issues

1. **Supabase Connection Error**
   - Verify environment variables are correct
   - Check that Supabase project is active
   - Ensure RLS policies are properly configured

2. **Gemini API Error**
   - Verify API key is correct and active
   - Check API quota and billing
   - Ensure the API key has Gemini access

3. **Build Failures**
   - Clear `.next` folder and rebuild
   - Check all dependencies are installed
   - Verify TypeScript types are correct

4. **Authentication Issues**
   - Check redirect URLs in Supabase
   - Verify environment variables match
   - Test in incognito mode to clear cache

### Performance Optimization

1. **Database Optimization**
   - Ensure proper indexes are created (included in schema.sql)
   - Monitor query performance in Supabase
   - Use RLS policies for security

2. **Frontend Optimization**
   - Images are optimized with Next.js Image component
   - Charts are loaded dynamically
   - API calls are properly cached

3. **API Optimization**
   - Gemini API calls are rate-limited
   - Database queries are optimized
   - Error handling is comprehensive

## Security Considerations

1. **Row Level Security (RLS)**
   - All tables have RLS enabled
   - Users can only access their own data
   - Policies are defined in schema.sql

2. **API Security**
   - Gemini API key is server-side only
   - User input is validated
   - SQL injection protection via Supabase

3. **Authentication Security**
   - Supabase handles secure authentication
   - JWT tokens are managed automatically
   - Session management is built-in

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Supabase and Netlify documentation
3. Check the project's GitHub issues
4. Contact the development team

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── auth/           # Authentication pages
│   ├── dashboard/      # Main dashboard
│   ├── profile/        # User profile management
│   ├── workout/        # Workout tracking
│   ├── history/        # Progress history
│   └── api/           # API routes
├── components/         # Reusable React components
├── lib/               # Utility functions and configurations
├── types/             # TypeScript type definitions
└── utils/             # Helper functions
```

This guide should help you successfully deploy FitGenie to production. Make sure to test thoroughly in development before deploying to ensure all features work correctly.
