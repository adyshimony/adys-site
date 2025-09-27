#!/bin/bash

echo "🚀 Starting deployment script..."

echo "📦 Building static HTML files..."
npm run build

echo "🚀 Deploying to Vercel..."
vercel --prod --yes

echo "✅ Deployment complete."
