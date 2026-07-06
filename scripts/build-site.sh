#!/usr/bin/env bash
# Assemble the deployable static site into dist-site/:
#   /            → launcher landing page (site/index.html)
#   /resort/     → Episode 1: The Curse of the Abandoned Resort
#   /museum/     → Episode 2: Night at the Spooky Museum
#
# Both games are built with a RELATIVE base (./) so the site works from any
# host root or subdirectory (Netlify, GitHub Pages project sites, nginx, ...).
set -euo pipefail
cd "$(dirname "$0")/.."

echo "==> Building Episode 1 (resort)..."
npm run build -- --base=./ >/dev/null

echo "==> Building Episode 2 (museum)..."
(cd spooky-museum && npm run build -- --base=./ >/dev/null)

echo "==> Assembling dist-site/..."
rm -rf dist-site
mkdir -p dist-site
cp site/index.html dist-site/index.html
cp -R dist dist-site/resort
cp -R spooky-museum/dist dist-site/museum

echo "==> Done. Deploy the dist-site/ folder to any static host."
du -sh dist-site | awk '{print "    total size: " $1}'
