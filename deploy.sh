#!/bin/bash

# Pre-deployment checklist and build script for Netlify

echo "🚀 Starting deployment preparation..."

# Check if required environment variables are set (for local testing)
if [ -f .env.local ]; then
    echo "✅ Environment file found"
else
    echo "⚠️  No .env.local file found. Make sure to set environment variables in Netlify"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run build
echo "🔨 Building application..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful! Ready for deployment."
    echo ""
    echo "📋 Deployment Checklist:"
    echo "1. Push your code to GitHub"
    echo "2. Connect your GitHub repo to Netlify"
    echo "3. Set environment variables in Netlify:"
    echo "   - NEXT_PUBLIC_SUPABASE_URL"
    echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
    echo "   - GEMINI_API_KEY"
    echo "4. Deploy!"
else
    echo "❌ Build failed. Please fix the errors before deployment."
    exit 1
fi
