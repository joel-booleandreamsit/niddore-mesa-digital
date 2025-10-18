#!/bin/bash

# Vercel Deployment Script for Static Build
# This script builds and deploys the static version to Vercel

set -e

echo "🚀 Starting Vercel deployment process..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if logged in to Vercel
if ! vercel whoami &> /dev/null; then
    echo "❌ Not logged in to Vercel. Please login first:"
    echo "   vercel login"
    exit 1
fi

# Set environment variables
export DIRECTUS_STATIC_TOKEN=E4BU9clij-sC5WCNF4HFhkw7KpEwpYfQ
export DIRECTUS_URL=http://localhost:8055

echo "📦 Building static version with real data..."
npm run build-static

echo "🌐 Deploying to Vercel..."
cd out
vercel --prod

echo "✅ Deployment complete!"
echo "🌍 Your app is now live on Vercel!"
