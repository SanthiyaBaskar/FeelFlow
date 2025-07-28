#!/bin/bash

echo "🌈 Daily Mood Tracker - Setup Script"
echo "======================================"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL first."
    echo "   Ubuntu/Debian: sudo apt-get install postgresql postgresql-contrib"
    echo "   macOS: brew install postgresql"
    echo "   Windows: Download from https://www.postgresql.org/download/"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Download from https://nodejs.org/"
    exit 1
fi

echo "✅ Prerequisites check passed!"
echo ""

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd server
if [ ! -f package.json ]; then
    echo "❌ Backend package.json not found!"
    exit 1
fi

npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

# Setup environment file
if [ ! -f .env ]; then
    echo "📝 Setting up environment file..."
    cp .env.example .env
    echo "⚠️  Please edit server/.env file with your database credentials"
else
    echo "✅ Environment file already exists"
fi

cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd client
if [ ! -f package.json ]; then
    echo "❌ Frontend package.json not found!"
    exit 1
fi

npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

cd ..

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Set up your PostgreSQL database:"
echo "   - Create a database named 'mood_tracker'"
echo "   - Update credentials in server/.env file"
echo ""
echo "2. Initialize the database:"
echo "   cd server && npm run init-db"
echo ""
echo "3. Start the backend server:"
echo "   cd server && npm run dev"
echo ""
echo "4. In a new terminal, start the frontend:"
echo "   cd client && npm start"
echo ""
echo "5. Open your browser to http://localhost:3000"
echo ""
echo "📖 For more detailed instructions, see README.md"