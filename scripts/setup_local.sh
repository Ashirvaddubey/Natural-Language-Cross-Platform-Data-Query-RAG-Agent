#!/bin/bash

# Local Environment Setup Script for Wealth Portfolio RAG Agent

echo "🚀 Setting up Wealth Portfolio RAG Agent for Local Environment..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16 or higher."
    exit 1
fi

echo "🔍 Checking database connections..."

# Test MongoDB connection
echo "📊 Testing MongoDB connection..."
if mongosh --eval "db.runCommand('ping')" --quiet > /dev/null 2>&1; then
    echo "✅ MongoDB is running and accessible"
else
    echo "⚠️  MongoDB connection failed. Starting MongoDB..."
    # Try to start MongoDB service
    if command -v systemctl &> /dev/null; then
        sudo systemctl start mongod
    elif command -v brew &> /dev/null; then
        brew services start mongodb-community
    else
        echo "❌ Please start MongoDB manually"
        exit 1
    fi
fi

# Test MySQL connection with your credentials
echo "🗄️  Testing MySQL connection..."
mysql -u root -p'Dubey@&2002' -e "SELECT 1;" > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ MySQL connection successful"
else
    echo "❌ MySQL connection failed. Please check:"
    echo "   - MySQL service is running"
    echo "   - Username: root"
    echo "   - Password: Dubey@&2002"
    echo "   - Try: sudo systemctl start mysql (Linux) or brew services start mysql (macOS)"
    exit 1
fi

echo "📦 Installing Python dependencies..."
cd backend
python3 -m pip install -r requirements.txt

echo "🗄️  Creating MySQL database and tables..."
mysql -u root -p'Dubey@&2002' < ../scripts/create_mysql_database.sql

if [ $? -eq 0 ]; then
    echo "✅ Database setup completed successfully!"
else
    echo "❌ Database setup failed. Please check MySQL connection."
    exit 1
fi

echo "🔧 Configuration Summary:"
echo "   ✅ MongoDB URL: mongodb://localhost:27017/Valuefydb"
echo "   ✅ MySQL Host: localhost"
echo "   ✅ MySQL User: root"
echo "   ✅ MySQL Database: wealth_portfolio"
echo "   ✅ OpenRouter API Key: sk-or-v1-dca95114... (configured)"
echo "   ✅ JWT Secret: eyJhbGciOiJIUzI1NiJ9... (configured)"

echo ""
echo "🚀 Starting backend server..."
python3 main.py &
BACKEND_PID=$!

echo "Backend server started with PID: $BACKEND_PID"

echo ""
echo "✅ Setup completed successfully!"
echo ""
echo "🌐 Application URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:8000"
echo "   API Documentation: http://localhost:8000/docs"
echo ""
echo "📝 Next Steps:"
echo "   1. Open http://localhost:3000 in your browser"
echo "   2. Register a new account"
echo "   3. Start querying your portfolio data!"
echo ""
echo "🛑 To stop the backend server:"
echo "   kill $BACKEND_PID"
