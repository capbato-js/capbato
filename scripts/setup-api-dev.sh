#!/bin/bash

# API Development Setup Script
# This script sets up the optimal development environment for the API

set -e

echo "🚀 Setting up API development environment..."
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "apps/api" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "📦 Installing pnpm..."
    npm install -g pnpm
fi

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Build library dependencies
echo "🔨 Building library dependencies for fast development mode..."
npx nx run-many -t build -p domain,application-shared,application-api,utils-core

echo ""
echo "✅ Setup complete!"
echo ""
echo "🎯 You can now start development with:"
echo "   pnpm dev:api          # Fast development mode (recommended)"
echo "   pnpm start:api:fast   # Alternative fast mode command"
echo "   pnpm start:api        # Traditional webpack mode"
echo ""
echo "📖 For more information, see: apps/api/docs/DEVELOPMENT_GUIDE.md"
echo ""

# Optional: Start the API automatically
read -p "🚀 Start the API in fast development mode now? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Starting API in fast development mode..."
    echo "Press Ctrl+C to stop the server"
    echo ""
    pnpm dev:api
fi