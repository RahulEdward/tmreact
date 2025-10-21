#!/bin/bash

echo "Building React frontend for production..."

# Clean previous build
if [ -d "dist" ]; then
    rm -rf dist
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Type check
echo "Running type check..."
npm run type-check
if [ $? -ne 0 ]; then
    echo "Type check failed!"
    exit 1
fi

# Build for production
echo "Building for production..."
npm run build
if [ $? -ne 0 ]; then
    echo "Build failed!"
    exit 1
fi

echo "Build completed successfully!"
echo ""
echo "Build output is in the 'dist' directory."
echo ""
echo "To integrate with Flask:"
echo "1. Copy dist/* to Flask static/react/ directory"
echo "2. Update Flask routes to serve React app"
echo "3. Configure CORS if needed"
echo ""

# Optional: Copy to Flask static directory if it exists
if [ -d "../static" ]; then
    echo "Flask static directory found. Copy build files? (y/n)"
    read -r choice
    if [ "$choice" = "y" ] || [ "$choice" = "Y" ]; then
        mkdir -p "../static/react"
        cp -r dist/* "../static/react/"
        echo "Files copied to Flask static/react directory!"
    fi
fi

echo "Deployment preparation complete!"