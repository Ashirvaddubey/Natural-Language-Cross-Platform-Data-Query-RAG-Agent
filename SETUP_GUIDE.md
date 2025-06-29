# Local Setup Guide for Wealth Portfolio RAG Agent

## ✅ Confirmed Configuration

Your project is configured with:
- **OpenRouter API Key**: `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`
- **JWT Secret**: `eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTc1MTEyNjQ3NSwiaWF0IjoxNzUxMTI2NDc1fQ.tEwks3HbvRmbQweqkZR--_vuQhOo5d8BIc0DRI6qJ4Y`
- **MongoDB URL**: `mongodb://localhost:27017/Valuefydb`
- **MySQL Credentials**: 
  - Host: `localhost`
  - Username: `root`
  - Password: `Dubey@&2002`
  - Database: `wealth_portfolio`

## 🚀 Step-by-Step Setup

### 1. Prerequisites Check
\`\`\`bash
# Check Python version (need 3.8+)
python3 --version

# Check Node.js version (need 16+)
node --version

# Check if MongoDB is installed and running
mongosh --eval "db.runCommand('ping')"

# Check if MySQL is installed and running
mysql -u root -p'Dubey@&2002' -e "SELECT 1;"
\`\`\`

### 2. Start Database Services

**For Ubuntu/Debian:**
\`\`\`bash
# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Start MySQL
sudo systemctl start mysql
sudo systemctl enable mysql
\`\`\`

**For macOS:**
\`\`\`bash
# Start MongoDB
brew services start mongodb-community

# Start MySQL
brew services start mysql
\`\`\`

**For Windows:**
\`\`\`bash
# Start MongoDB service from Services panel or:
net start MongoDB

# Start MySQL service from Services panel or:
net start MySQL80
\`\`\`

### 3. Test Database Connections
\`\`\`bash
cd backend
python3 test_connections.py
\`\`\`

This will verify:
- ✅ MongoDB connection to `localhost:27017/Valuefydb`
- ✅ MySQL connection with your credentials
- ✅ OpenRouter API accessibility

### 4. Install Dependencies and Setup Database
\`\`\`bash
# Make setup script executable
chmod +x scripts/setup_local.sh

# Run the setup script
./scripts/setup_local.sh
\`\`\`

### 5. Manual Database Setup (if script fails)
\`\`\`bash
# Install Python dependencies
cd backend
pip3 install -r requirements.txt

# Create MySQL database and tables
mysql -u root -p'Dubey@&2002' < ../scripts/create_mysql_database.sql
\`\`\`

### 6. Start the Application
\`\`\`bash
# Start backend server
cd backend
python3 main.py

# The frontend will be available at http://localhost:3000
# Backend API will be available at http://localhost:8000
\`\`\`

## 🔧 Troubleshooting

### MySQL Connection Issues
If you get "Access denied" errors:
\`\`\`bash
# Reset MySQL password
sudo mysql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'Dubey@&2002';
FLUSH PRIVILEGES;
EXIT;
\`\`\`

### MongoDB Connection Issues
\`\`\`bash
# Check MongoDB status
sudo systemctl status mongod

# Check MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log

# Restart MongoDB if needed
sudo systemctl restart mongod
\`\`\`

### Port Conflicts
If ports 3000 or 8000 are in use:
\`\`\`bash
# Check what's using the ports
lsof -i :3000
lsof -i :8000

# Kill processes if needed
sudo kill -9 <PID>
\`\`\`

### Python Dependencies Issues
\`\`\`bash
# Create virtual environment (recommended)
python3 -m venv venv
source venv/bin/activate  # Linux/macOS
# or
venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt
\`\`\`

## 🎯 Verification Steps

1. **Backend API**: Visit `http://localhost:8000/docs` - should show FastAPI documentation
2. **Database Test**: Run `python3 test_connections.py` - all tests should pass
3. **Frontend**: Visit `http://localhost:3000` - should show login page
4. **Registration**: Create a new account and login
5. **Query Test**: Try "What are the top five portfolios of our wealth members?"

## 📊 Sample Data

The setup automatically creates:
- **5 sample clients** with portfolios ranging from 120-250 crores
- **3 relationship managers** with performance metrics
- **10+ sample transactions** across different stocks
- **Portfolio holdings** with current valuations

## 🔐 Security Notes

- JWT tokens expire after 7 days
- Passwords are hashed with bcrypt
- API keys are configured in the backend only
- CORS is configured for localhost:3000

## 🆘 Getting Help

If you encounter issues:
1. Check the console logs in both frontend and backend
2. Verify database connections with the test script
3. Ensure all services are running on correct ports
4. Check firewall settings if using remote databases

Your configuration is now ready with your specific credentials and API keys!
