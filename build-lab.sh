#!/bin/bash
set -e

# Build the Lab Website using pnpm
echo "Building The Lab Website..."
pnpm install
# We need to run the build command inside the workspace
pnpm --filter the-lab-website build

# Create deployment directory
echo "Assembling site..."
rm -rf _site
mkdir -p _site

# Copy Lab Website build to root of _site
cp -r the-lab-website/dist/* _site/

# Copy Rats game to _site/rats-the-video-game
mkdir -p _site/rats-the-video-game
cp -r rats-the-video-game/* _site/rats-the-video-game/
# Remove src from deployed copy if not needed, BUT for vanilla JS with ES modules, src IS needed.
# However, we should remove node_modules if present
rm -rf _site/rats-the-video-game/node_modules

echo "Build complete. Content ready in _site/"
