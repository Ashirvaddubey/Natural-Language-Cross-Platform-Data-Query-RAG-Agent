#!/bin/bash
# Wealth Portfolio RAG Agent Setup Script
echo "🚀 Setting up Wealth Portfolio RAG Agent..."

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
# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB service."
    echo "   On Ubuntu/Debian: sudo systemctl start mongod"
    echo "   On macOS: brew services start mongodb-community"
fi
# Check if MySQL is running
if ! pgrep -x "mysqld" > /dev/null; then
    echo "⚠️  MySQL is not running. Please start MySQL service."
    echo "   On Ubuntu/Debian: sudo systemctl start mysql"
    echo "   On macOS: brew services start mysql"
fi
echo "📦 Installing Python dependencies..."
cd backend
python3 -m pip install -r requirements.txt

echo "🗄️  Setting up MySQL database..."
mysql -u root -p < ../scripts/create_mysql_database.sql

echo "📊 Database setup completed!"

echo "🎯 Starting backend server..."
python3 main.py &
BACKEND_PID=$!

echo "Backend server started with PID: $BACKEND_PID"

echo "✅ Setup completed successfully!"
echo ""
echo "🌐 Application URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:8000"
echo "   API Documentation: http://localhost:8000/docs"
echo ""
echo "📝 Default login credentials:"
echo "   Create a new account through the registration page"
echo ""
echo "🔧 Configuration:"
echo "   MongoDB URL: mongodb://localhost:27017/Valuefydb"
echo "   MySQL Database: wealth_portfolio"
echo "   OpenRouter API: Configured with DeepSeek model"
echo ""
echo "🛑 To stop the backend server:"
echo "   kill $BACKEND_PID"
