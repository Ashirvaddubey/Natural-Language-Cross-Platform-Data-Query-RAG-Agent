# Wealth Portfolio RAG Agent

A comprehensive Natural Language Cross-Platform Data Query RAG Agent built for wealth portfolio management. This application enables business users to query multiple data sources using plain English and receive responses in text, tables, and graphs.

## 🎯 Business Scenario

This system manages wealth portfolios for film stars and sports personalities who have invested 100+ crores with our asset management firm. Client profiles are stored in MongoDB, while transaction data flows through MySQL database.

## 🚀 Features

### Core Functionality
- **Natural Language Queries**: Ask questions in plain English
- **Multi-Database Integration**: Seamlessly queries MongoDB and MySQL
- **Multiple Response Formats**: Text, tables, and interactive charts
- **Real-time Data Processing**: Live portfolio and transaction data
- **JWT Authentication**: Secure user authentication system
- **Responsive Dashboard**: Beautiful, modern UI with portfolio analytics

### Sample Queries Supported
- "What are the top five portfolios of our wealth members?"
- "Give me the breakup of portfolio values per relationship manager."
- "Tell me the top relationship managers in my firm"
- "Which clients are the highest holders of RELIANCE stock?"
- "Show me the monthly performance of portfolios above 50 crores"
- "What is the risk distribution across all client portfolios?"

### Advanced Features
- **LangChain Integration**: Powered by LangChain for intelligent query processing
- **OpenRouter API**: Uses DeepSeek model for natural language understanding
- **Real-time Charts**: Interactive data visualizations using Recharts
- **Multi-user Support**: Role-based access control
- **Modern UI/UX**: Professional dashboard with gradients and animations

## 🛠️ Technology Stack

### Frontend
- **React 19** with TypeScript
- **Next.js 15** (App Router)
- **Tailwind CSS** for styling
- **shadcn/ui** components
- **Recharts** for data visualization
- **Lucide React** for icons

### Backend
- **Python 3.8+**
- **FastAPI** for REST API
- **LangChain** for AI/NLP processing
- **OpenRouter API** with DeepSeek model
- **JWT** for authentication
- **bcrypt** for password hashing

### Databases
- **MongoDB**: Client profiles and portfolio data
- **MySQL**: Transaction data and relationship management

### AI/ML
- **LangChain**: Query processing and context management
- **OpenRouter**: AI model access (DeepSeek)
- **Natural Language Processing**: Query understanding and response generation

## 📋 Prerequisites

- **Python 3.8+**
- **Node.js 18+**
- **MongoDB 4.4+**
- **MySQL 8.0+**
- **OpenRouter API Key**
- **pnpm** (recommended) or **npm**

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd wealth-portfolio-rag-agent
```

### 2. Database Setup

#### MongoDB Setup
```bash
# Start MongoDB service
# Ubuntu/Debian
sudo systemctl start mongod
sudo systemctl enable mongod

# macOS
brew services start mongodb-community

# Windows
# Start MongoDB service from Services or MongoDB Compass
```

#### MySQL Setup
```bash
# Start MySQL service
# Ubuntu/Debian
sudo systemctl start mysql
sudo systemctl enable mysql

# macOS
brew services start mysql

# Windows
# Start MySQL service from Services or MySQL Workbench

# Create database and tables
mysql -u root -p < scripts/create_mysql_database.sql
```

### 3. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Configure environment variables
# Copy and edit the configuration in main.py
# Update OPENROUTER_API_KEY with your actual API key

# Start the backend server
python main.py
```

The backend will start on `http://localhost:8000`

### 4. Frontend Setup
```bash
# Navigate to project root
cd ..

# Install dependencies
pnpm install
# or
npm install

# Start the development server
pnpm dev
# or
npm run dev
```

The frontend will start on `http://localhost:3000`

### 5. Quick Setup Script (Linux/macOS)
```bash
# Make the script executable
chmod +x scripts/setup.sh

# Run the setup script
./scripts/setup.sh
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the backend directory:
```env
MONGODB_URL=mongodb://localhost:27017/Valuefydb
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=wealth_portfolio
OPENROUTER_API_KEY=your_openrouter_api_key
JWT_SECRET=your_jwt_secret_key
```

### Backend Configuration
Update the configuration in `backend/main.py`:
```python
# Database Configuration
MONGODB_URL = "mongodb://localhost:27017/Valuefydb"
MYSQL_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "your_password",
    "database": "wealth_portfolio"
}

# API Configuration
OPENROUTER_API_KEY = "your_openrouter_api_key"
JWT_SECRET = "your_jwt_secret_key"
```

### Frontend Configuration
Update API endpoints in `src/services/api.ts` if needed:
```typescript
const API_BASE_URL = 'http://localhost:8000';
```

## 🗄️ Database Schemas

### MongoDB (Client Profiles)
```javascript
{
  _id: ObjectId,
  name: "Client Name",
  email: "client@email.com",
  phone: "+91-XXXXXXXXXX",
  address: "City, State",
  risk_appetite: "Aggressive|Moderate|Conservative",
  investment_preferences: ["Equity", "Bonds", "Real Estate"],
  relationship_manager: "RM Name",
  portfolio_value: 1500000000, // in rupees
  client_type: "Film Star|Sports Personality",
  created_at: ISODate,
  updated_at: ISODate
}
```

### MySQL (Transactions)
```sql
CREATE TABLE transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_name VARCHAR(255) NOT NULL,
  transaction_type ENUM('BUY', 'SELL') NOT NULL,
  stock_symbol VARCHAR(50) NOT NULL,
  quantity INT NOT NULL,
  price_per_share DECIMAL(10,2) NOT NULL,
  total_amount DECIMAL(15,2) NOT NULL,
  transaction_date DATETIME NOT NULL,
  status ENUM('PENDING', 'COMPLETED', 'CANCELLED') DEFAULT 'COMPLETED',
  relationship_manager VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🎮 Usage Examples

### Dashboard Features
- **Portfolio Overview**: Total portfolio value, client count, transaction summary
- **Performance Charts**: Monthly portfolio performance trends
- **Top Clients**: Highest portfolio value clients
- **Recent Transactions**: Latest buy/sell activities

### Natural Language Queries
1. **Portfolio Analysis**:
   - "Show me clients with portfolio value above 200 crores"
   - "What's the average portfolio size by risk appetite?"

2. **Relationship Manager Insights**:
   - "Which RM manages the highest portfolio value?"
   - "Show me the client distribution per relationship manager"

3. **Stock Analysis**:
   - "Which stocks are most popular among our clients?"
   - "Show me clients holding RELIANCE stock"

4. **Performance Tracking**:
   - "What's the monthly growth rate of our portfolios?"
   - "Show me the best performing portfolios this quarter"

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **CORS Protection**: Configured for secure cross-origin requests
- **Input Validation**: Pydantic models for request validation
- **SQL Injection Prevention**: Parameterized queries and ORM usage

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern Gradients**: Beautiful gradient backgrounds and buttons
- **Interactive Charts**: Hover effects and detailed tooltips
- **Loading States**: Smooth loading animations
- **Error Handling**: User-friendly error messages
- **Toast Notifications**: Real-time feedback for user actions
- **Hover Animations**: Smooth transitions and scale effects

## 🚀 Advanced Features

### LangChain Integration
- **SQL Agent**: Automatically generates SQL queries from natural language
- **Context Management**: Maintains conversation context across queries
- **Multi-step Reasoning**: Handles complex queries requiring multiple data sources

### Query Processing Pipeline
1. **Intent Recognition**: Determines query type and required data sources
2. **Context Enrichment**: Adds relevant business context
3. **Query Generation**: Creates appropriate database queries
4. **Response Formatting**: Formats results based on query type
5. **Visualization**: Generates charts/tables when appropriate

## 📊 Sample Data

The application comes with pre-populated sample data:
- **5 High-net-worth clients** (Film stars and sports personalities)
- **3 Relationship managers** with performance metrics
- **Multiple stock transactions** across different sectors
- **Portfolio holdings** with current valuations

## 🔧 Customization

### Adding New Query Types
1. Update `QueryProcessor.determine_query_type()` method
2. Add corresponding data generation in `generate_mock_data()`
3. Implement visualization components in React

### Database Schema Extensions
1. Update MySQL schema in `create_mysql_database.sql`
2. Modify MongoDB document structure in sample data
3. Update API endpoints to handle new fields

## 🐛 Troubleshooting

### Common Issues

#### Database Connection Errors
```bash
# Check MongoDB status
sudo systemctl status mongod

# Check MySQL status
sudo systemctl status mysql

# Test connections
python backend/test_connections.py
```

#### API Key Issues
- Verify OpenRouter API key is valid and has sufficient credits
- Check API key format in backend configuration

#### Port Conflicts
```bash
# Check if ports are in use
lsof -i :3000  # Frontend
lsof -i :8000  # Backend
lsof -i :27017 # MongoDB
lsof -i :3306  # MySQL
```

#### CORS Errors
- Ensure backend CORS is configured for frontend URL
- Check browser console for specific CORS error details

### Debug Mode
Enable verbose logging in LangChain:
```python
# In main.py
self.sql_agent = create_sql_agent(
    llm=self.llm,
    toolkit=toolkit,
    verbose=True,  # Enable debug logging
    handle_parsing_errors=True
)
```

### Logs and Monitoring
```bash
# Backend logs
tail -f backend/logs/app.log

# Frontend logs
# Check browser developer tools console
```

## 📁 Project Structure

```
wealth-portfolio-rag-agent/
├── app/                    # Next.js app directory
├── backend/               # FastAPI backend
│   ├── main.py           # Main application file
│   ├── requirements.txt  # Python dependencies
│   └── test_connections.py
├── components/           # UI components
│   ├── ui/              # shadcn/ui components
│   └── theme-provider.tsx
├── src/                 # React source code
│   ├── components/      # React components
│   ├── contexts/        # React contexts
│   └── services/        # API services
├── scripts/             # Setup and database scripts
├── public/              # Static assets
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section above
- Review the architecture documentation

## 🔄 Updates and Maintenance

- Keep dependencies updated regularly
- Monitor API usage and costs
- Backup database regularly
- Update security configurations as needed