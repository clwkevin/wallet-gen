#!/bin/bash

# Octra Wallet Generator Setup Script
# Automated setup: security warning, build from source, run, and open browser

echo "=== Octra Wallet Generator Setup ==="
echo ""

# Show security warning first
echo "=== ⚠️  SECURITY WARNING ⚠️  ==="
echo ""
echo "This tool generates real cryptographic keys. Always:"
echo "  - Keep your private keys secure"
echo "  - Never share your mnemonic phrase"
echo "  - Don't store wallet files on cloud services"
echo "  - Use on a secure, offline computer for production wallets"
echo ""
read -p "Press Enter to continue..."
echo ""

# Function to install Bun
install_bun() {
    echo "Installing Bun..."
    if command -v bun &> /dev/null; then
        echo "Bun is already installed. Version: $(bun --version)"
    else
        echo "Installing Bun..."
        curl -fsSL https://bun.sh/install | bash
        # Set PATH to include Bun's binary directory
        export PATH="$HOME/.bun/bin:$PATH"
        echo "Bun installed successfully!"
    fi
}

# Build from source
echo "=== Building from Source ==="
echo ""

# Install Bun if not present
install_bun

echo ""
echo "Installing dependencies..."
bun install

echo ""
echo "Building standalone executable..."
bun build --compile --outfile=wallet-generator ./wallet_generator.ts

if [ ! -f "./wallet-generator" ]; then
    echo "❌ Error: wallet-generator executable not found!"
    echo "Build may have failed. Please check the build output above."
    exit 1
fi

echo ""
echo "Build complete!"
echo ""

# Execute binary
echo "=== Starting Wallet Generator ==="
echo ""
echo "Starting wallet generator server..."

# Start the binary in the background
./wallet-generator &
WALLET_PID=$!

# Wait a moment for the server to start
sleep 2

# Open browser
echo "Opening browser at http://localhost:8888"

BROWSER_CMD=""
if command -v open &> /dev/null; then
    # macOS
    BROWSER_CMD="open"
elif command -v xdg-open &> /dev/null; then
    # Linux
    BROWSER_CMD="xdg-open"
fi

if [ -n "$BROWSER_CMD" ]; then
    $BROWSER_CMD http://localhost:8888 2>/dev/null || echo "Could not automatically open browser. Please manually open http://localhost:8888"
else
    echo "Please manually open http://localhost:8888 in your browser"
fi

# Wait for the background process
wait $WALLET_PID