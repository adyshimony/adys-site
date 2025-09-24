#!/bin/bash

echo "🚀 Starting deployment script..."

# Define source and destination directories
SRC_DIR=~/Sources/miniscript-compiler
DEST_DIR=~/Sources/adys-site

# Copy files with overwrite
echo "📁 Copying script.js..."
cp -f "$SRC_DIR/miniscript/script.js" "$DEST_DIR/miniscript/script.js"

echo "📁 Copying index.html..."
cp -f "$SRC_DIR/miniscript/index.html" "$DEST_DIR/miniscript/index.html"

echo "📁 Copying js folder..."
mkdir -p "$DEST_DIR/miniscript/modules"
cp -f "$SRC_DIR/miniscript/modules/"* "$DEST_DIR/miniscript/modules/"



echo "📁 Copying miniscript_wasm_bg.wasm..."
cp -f "$SRC_DIR/pkg/miniscript_wasm_bg.wasm" "$DEST_DIR/miniscript/pkg/miniscript_wasm_bg.wasm"

echo "📁 Copying miniscript_wasm.js..."
cp -f "$SRC_DIR/pkg/miniscript_wasm.js" "$DEST_DIR/miniscript/pkg/miniscript_wasm.js"

# Deploy with Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod --yes

echo "✅ Deployment complete."
