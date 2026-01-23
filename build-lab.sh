#!/bin/bash
set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}------------------------------------------------------------${NC}"
echo -e "${YELLOW}           The Tale of Remy's Hot Dog Victory            ${NC}"
echo -e "${CYAN}------------------------------------------------------------${NC}"

echo -e "${PURPLE}Chapter 1: The Scent on the Wind${NC}"
echo "In the depths of the CI pipes, a brave rat named Remy smelled it."
echo "A glorious, steamed street vendor hot dog, waiting in the world above."
echo -e "${RED}"
echo "      __             _"
echo "     /  \           / \\"
echo "    / ..|\         /.. \\"
echo "   (_\  |_)       (_\  |)"
echo "   /  \@'          /  \@'"
echo "  /     \         /     \\"
echo " _/  \  \        _/  \   \\"
echo -e "${NC}"

echo -e "${GREEN}Action: Building The Lab Website...${NC}"
pnpm install
# We need to run the build command inside the workspace
pnpm --filter the-lab-website build

echo -e "${CYAN}------------------------------------------------------------${NC}"
echo -e "${PURPLE}Chapter 2: The Ascent${NC}"
echo "Dependencies installed. The foundation was laid."
echo "Remy scurried up the data cables, dodging packets and glitches."
echo "He was on the warpath. He was on parade."
echo -e "${BLUE}"
echo "         ( )"
echo "          \ \\"
echo "           \ \\"
echo "            \ \\"
echo "    _       _\ \\"
echo "   ( \     /  \ \\"
echo "    ) \___/    \ \\"
echo "   (            ) )"
echo "    \__________/ /"
echo -e "${NC}"

echo -e "${GREEN}Action: Assembling site...${NC}"
rm -rf _site
mkdir -p _site

echo -e "${CYAN}------------------------------------------------------------${NC}"
echo -e "${PURPLE}Chapter 3: The Prize${NC}"
echo "He reached the surface. The hot dog was there. Mustard glistening."
echo "With a squeak of triumph, he claimed his victory!"
echo -e "${YELLOW}"
echo "      .--."
echo "     |o_o |"
echo "     |:_/ |  =={=======> (HOT DOG)"
echo "    //   \ \\"
echo "   (|     | )"
echo "  /'\_   _/ \`"
echo "  \___)=(___/"
echo -e "${NC}"

echo -e "${GREEN}Action: Copying artifacts...${NC}"
# Copy Lab Website build to root of _site
cp -r the-lab-website/dist/* _site/

# Copy Rats game to _site/rats-the-video-game
mkdir -p _site/rats-the-video-game
cp -r rats-the-video-game/* _site/rats-the-video-game/
# Remove node_modules if present
rm -rf _site/rats-the-video-game/node_modules

echo -e "${CYAN}------------------------------------------------------------${NC}"
echo -e "${PURPLE}Epilogue: The Feast${NC}"
echo "Remy sat in the deployed folder, belly full, watching the users visit."
echo "The lab was open. The rats had won."
echo -e "${GREEN}Build complete. Content ready in _site/${NC}"
