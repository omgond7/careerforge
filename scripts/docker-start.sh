#!/bin/bash
set -e

echo "🐳 Starting CareerForge..."

# Run DB migrations
echo "📦 Running Prisma migrations..."
npx prisma migrate deploy

# Seed if empty
echo "🌱 Checking seed..."
npx prisma db seed 2>/dev/null || echo "Skipping seed (already seeded)"

echo "🚀 Starting app..."
node server.js
