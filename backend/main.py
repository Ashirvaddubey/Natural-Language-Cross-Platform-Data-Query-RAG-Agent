from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import jwt
import bcrypt
from datetime import datetime, timedelta
import os
from pymongo import MongoClient
import mysql.connector
from mysql.connector import Error
import asyncio
import json
from langchain.agents import create_sql_agent
from langchain.agents.agent_toolkits import SQLDatabaseToolkit
from langchain.sql_database import SQLDatabase
from langchain.llms.base import LLM
from langchain.callbacks.manager import CallbackManagerForLLMRun
import requests
from typing import Optional, List, Any
import urllib.parse

app = FastAPI(title="Wealth Portfolio RAG Agent API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001", 
        "http://localhost:3002",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "http://127.0.0.1:3002"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()
JWT_SECRET = "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTc1MTEyNjQ3NSwiaWF0IjoxNzUxMTI2NDc1fQ.tEwks3HbvRmbQweqkZR--_vuQhOo5d8BIc0DRI6qJ4Y"

# Database connections
MONGODB_URL = "mongodb://localhost:27017/Valuefydb"
MYSQL_CONFIG = {
    'host': 'localhost',
    'database': 'wealth_portfolio',
    'user': 'root',
    'password': 'Dubey@&2002'
}

# OpenRouter API configuration
OPENROUTER_API_KEY = "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"
OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"

# Custom LLM for OpenRouter
class OpenRouterLLM(LLM):
    model_name: str = "deepseek/deepseek-chat"
    openrouter_api_key: str = OPENROUTER_API_KEY
    
    @property
    def _llm_type(self) -> str:
        return "openrouter"
    
    def _call(
        self,
        prompt: str,
        stop: Optional[List[str]] = None,
        run_manager: Optional[CallbackManagerForLLMRun] = None,
        **kwargs: Any,
    ) -> str:
        headers = {
            "Authorization": f"Bearer {self.openrouter_api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "Wealth Portfolio Manager"
        }
        
        data = {
            "model": self.model_name,
            "messages": [{"role": "user", "content": prompt}],
            "max_tokens": 1000,
            "temperature": 0.1
        }
        
        response = requests.post(
            f"{OPENROUTER_BASE_URL}/chat/completions",
            headers=headers,
            json=data
        )
        
        if response.status_code == 200:
            return response.json()["choices"][0]["message"]["content"]
        else:
            raise Exception(f"OpenRouter API error: {response.text}")

# Initialize databases
def init_databases():
    # MongoDB connection
    try:
        mongo_client = MongoClient(MONGODB_URL)
        mongo_db = mongo_client.get_database()
        print("MongoDB connected successfully")
        return mongo_client, mongo_db
    except Exception as e:
        print(f"MongoDB connection failed: {e}")
        return None, None

def get_mysql_connection():
    try:
        connection = mysql.connector.connect(**MYSQL_CONFIG)
        return connection
    except Error as e:
        print(f"MySQL connection failed: {e}")
        return None

# Initialize database connections
mongo_client, mongo_db = init_databases()

# Pydantic models
class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    
    class Config:
        extra = "forbid"  # Reject extra fields

class UserLogin(BaseModel):
    username: str
    password: str
    
    class Config:
        extra = "forbid"  # Reject extra fields

class TokenVerify(BaseModel):
    token: str
    
    class Config:
        extra = "forbid"  # Reject extra fields

class QueryRequest(BaseModel):
    query: str
    
    class Config:
        extra = "forbid"  # Reject extra fields

class User(BaseModel):
    id: str
    username: str
    email: str
    role: str = "user"

# Helper functions
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_jwt_token(user_data: dict) -> str:
    payload = {
        "user_id": str(user_data["_id"]),
        "username": user_data["username"],
        "email": user_data["email"],
        "role": user_data.get("role", "user"),
        "exp": datetime.utcnow() + timedelta(days=7)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")

def verify_jwt_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    payload = verify_jwt_token(token)
    return payload

# Initialize sample data
def init_sample_data():
    if mongo_db is None:
        return
    
    # Sample client data for MongoDB
    clients_collection = mongo_db.clients
    if clients_collection.count_documents({}) == 0:
        sample_clients = [
            {
                "name": "Rajesh Kumar",
                "email": "rajesh.kumar@email.com",
                "phone": "+91-9876543210",
                "address": "Mumbai, Maharashtra",
                "risk_appetite": "Aggressive",
                "investment_preferences": ["Equity", "Mutual Funds", "Derivatives"],
                "relationship_manager": "Amit Sharma",
                "portfolio_value": 1500000000,  # 150 crores
                "client_type": "Film Star",
                "created_date": datetime.now()
            },
            {
                "name": "Priya Singh",
                "email": "priya.singh@email.com",
                "phone": "+91-9876543211",
                "address": "Delhi, India",
                "risk_appetite": "Moderate",
                "investment_preferences": ["Equity", "Bonds", "Real Estate"],
                "relationship_manager": "Neha Gupta",
                "portfolio_value": 2000000000,  # 200 crores
                "client_type": "Sports Personality",
                "created_date": datetime.now()
            },
            {
                "name": "Arjun Patel",
                "email": "arjun.patel@email.com",
                "phone": "+91-9876543212",
                "address": "Bangalore, Karnataka",
                "risk_appetite": "Conservative",
                "investment_preferences": ["Bonds", "Fixed Deposits", "Gold"],
                "relationship_manager": "Amit Sharma",
                "portfolio_value": 1200000000,  # 120 crores
                "client_type": "Film Star",
                "created_date": datetime.now()
            },
            {
                "name": "Sneha Reddy",
                "email": "sneha.reddy@email.com",
                "phone": "+91-9876543213",
                "address": "Hyderabad, Telangana",
                "risk_appetite": "Aggressive",
                "investment_preferences": ["Equity", "Cryptocurrency", "Startups"],
                "relationship_manager": "Rahul Verma",
                "portfolio_value": 1800000000,  # 180 crores
                "client_type": "Sports Personality",
                "created_date": datetime.now()
            },
            {
                "name": "Vikram Malhotra",
                "email": "vikram.malhotra@email.com",
                "phone": "+91-9876543214",
                "address": "Chennai, Tamil Nadu",
                "risk_appetite": "Moderate",
                "investment_preferences": ["Equity", "Mutual Funds", "Real Estate"],
                "relationship_manager": "Neha Gupta",
                "portfolio_value": 2500000000,  # 250 crores
                "client_type": "Film Star",
                "created_date": datetime.now()
            }
        ]
        clients_collection.insert_many(sample_clients)
        print("Sample client data inserted into MongoDB")

# Initialize MySQL sample data
def init_mysql_sample_data():
    connection = get_mysql_connection()
    if connection is None:
        return
    
    cursor = connection.cursor()
    
    # Create tables
    create_tables_query = """
    CREATE TABLE IF NOT EXISTS transactions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        client_name VARCHAR(255) NOT NULL,
        transaction_type ENUM('BUY', 'SELL') NOT NULL,
        stock_symbol VARCHAR(20) NOT NULL,
        quantity INT NOT NULL,
        price_per_share DECIMAL(15, 2) NOT NULL,
        total_amount DECIMAL(15, 2) NOT NULL,
        transaction_date DATETIME NOT NULL,
        status ENUM('COMPLETED', 'PENDING', 'FAILED') DEFAULT 'COMPLETED',
        relationship_manager VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS portfolio_holdings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        client_name VARCHAR(255) NOT NULL,
        stock_symbol VARCHAR(20) NOT NULL,
        quantity INT NOT NULL,
        average_price DECIMAL(15, 2) NOT NULL,
        current_value DECIMAL(15, 2) NOT NULL,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS relationship_managers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(20),
        total_clients INT DEFAULT 0,
        total_portfolio_value DECIMAL(20, 2) DEFAULT 0,
        performance_rating DECIMAL(3, 2) DEFAULT 0.00,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """
    
    for query in create_tables_query.split(';'):
        if query.strip():
            cursor.execute(query)
    
    # Check if data exists
    cursor.execute("SELECT COUNT(*) FROM transactions")
    if cursor.fetchone()[0] == 0:
        # Insert sample transaction data
        sample_transactions = [
            ('Rajesh Kumar', 'BUY', 'RELIANCE', 1000, 2500.00, 2500000.00, '2024-01-15 10:30:00', 'COMPLETED', 'Amit Sharma'),
            ('Priya Singh', 'BUY', 'TCS', 500, 3200.00, 1600000.00, '2024-01-16 11:45:00', 'COMPLETED', 'Neha Gupta'),
            ('Arjun Patel', 'SELL', 'HDFC', 200, 1800.00, 360000.00, '2024-01-17 14:20:00', 'COMPLETED', 'Amit Sharma'),
            ('Sneha Reddy', 'BUY', 'INFY', 800, 1500.00, 1200000.00, '2024-01-18 09:15:00', 'COMPLETED', 'Rahul Verma'),
            ('Vikram Malhotra', 'BUY', 'RELIANCE', 2000, 2600.00, 5200000.00, '2024-01-19 16:30:00', 'COMPLETED', 'Neha Gupta'),
            ('Rajesh Kumar', 'BUY', 'WIPRO', 1500, 400.00, 600000.00, '2024-01-20 12:00:00', 'PENDING', 'Amit Sharma'),
            ('Priya Singh', 'SELL', 'ICICI', 300, 900.00, 270000.00, '2024-01-21 15:45:00', 'COMPLETED', 'Neha Gupta'),
        ]
        
        insert_query = """
        INSERT INTO transactions (client_name, transaction_type, stock_symbol, quantity, price_per_share, total_amount, transaction_date, status, relationship_manager)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        cursor.executemany(insert_query, sample_transactions)
        
        # Insert relationship managers
        sample_rms = [
            ('Amit Sharma', 'amit.sharma@company.com', '+91-9876543220', 2, 2700000000.00, 4.5),
            ('Neha Gupta', 'neha.gupta@company.com', '+91-9876543221', 2, 4500000000.00, 4.8),
            ('Rahul Verma', 'rahul.verma@company.com', '+91-9876543222', 1, 1800000000.00, 4.2),
        ]
        
        rm_query = """
        INSERT INTO relationship_managers (name, email, phone, total_clients, total_portfolio_value, performance_rating)
        VALUES (%s, %s, %s, %s, %s, %s)
        """
        cursor.executemany(rm_query, sample_rms)
        
        connection.commit()
        print("Sample MySQL data inserted")
    
    cursor.close()
    connection.close()

# Initialize sample data on startup
init_sample_data()
init_mysql_sample_data()

# API Routes

@app.post("/api/auth/register")
async def register(user_data: UserCreate):
    try:
        if mongo_db is None:
            raise HTTPException(status_code=500, detail="Database connection failed")
        
        users_collection = mongo_db.users
        
        # Check if user exists
        existing_user = users_collection.find_one({"$or": [{"username": user_data.username}, {"email": user_data.email}]})
        if existing_user:
            if existing_user.get("username") == user_data.username:
                raise HTTPException(status_code=400, detail="Username already exists")
            else:
                raise HTTPException(status_code=400, detail="Email already exists")
        
        # Create user
        hashed_password = hash_password(user_data.password)
        user_doc = {
            "username": user_data.username,
            "email": user_data.email,
            "password": hashed_password,
            "role": "user",
            "created_at": datetime.utcnow()
        }
        
        result = users_collection.insert_one(user_doc)
        user_doc["_id"] = str(result.inserted_id)  # Convert ObjectId to string
        
        token = create_jwt_token(user_doc)
        
        return {
            "token": token,
            "user": {
                "id": str(result.inserted_id),
                "username": user_data.username,
                "email": user_data.email,
                "role": "user"
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Registration error: {e}")
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")

@app.post("/api/auth/login")
async def login(user_data: UserLogin):
    try:
        if mongo_db is None:
            raise HTTPException(status_code=500, detail="Database connection failed")
        
        users_collection = mongo_db.users
        
        # Find user
        user = users_collection.find_one({"username": user_data.username})
        if not user or not verify_password(user_data.password, user["password"]):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        # Convert ObjectId to string for JWT
        user["_id"] = str(user["_id"])
        token = create_jwt_token(user)
        
        return {
            "token": token,
            "user": {
                "id": str(user["_id"]),
                "username": user["username"],
                "email": user["email"],
                "role": user.get("role", "user")
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Login error: {e}")
        raise HTTPException(status_code=500, detail=f"Login failed: {str(e)}")

@app.post("/api/auth/verify")
async def verify_token(token_data: TokenVerify):
    payload = verify_jwt_token(token_data.token)
    return {
        "id": payload["user_id"],
        "username": payload["username"],
        "email": payload["email"],
        "role": payload["role"]
    }

@app.get("/api/dashboard/stats")
async def get_dashboard_stats(current_user: dict = Depends(get_current_user)):
    if mongo_db is None:
        raise HTTPException(status_code=500, detail="Database connection failed")
    
    # Get MongoDB stats
    clients_collection = mongo_db.clients
    total_clients = clients_collection.count_documents({})
    
    # Calculate total portfolio value
    pipeline = [
        {"$group": {"_id": None, "total_value": {"$sum": "$portfolio_value"}}}
    ]
    portfolio_result = list(clients_collection.aggregate(pipeline))
    total_portfolio_value = portfolio_result[0]["total_value"] if portfolio_result else 0
    
    # Get MySQL stats
    connection = get_mysql_connection()
    total_transactions = 0
    if connection:
        cursor = connection.cursor()
        cursor.execute("SELECT COUNT(*) FROM transactions WHERE MONTH(transaction_date) = MONTH(CURRENT_DATE())")
        total_transactions = cursor.fetchone()[0]
        cursor.close()
        connection.close()
    
    return {
        "totalPortfolioValue": total_portfolio_value,
        "totalClients": total_clients,
        "totalTransactions": total_transactions,
        "monthlyGrowth": 12.5  # Mock growth rate
    }

@app.get("/api/dashboard/portfolio-chart")
async def get_portfolio_chart(current_user: dict = Depends(get_current_user)):
    # Mock chart data - in real implementation, this would come from historical data
    chart_data = [
        {"month": "Jan", "value": 85000000000},
        {"month": "Feb", "value": 87000000000},
        {"month": "Mar", "value": 89000000000},
        {"month": "Apr", "value": 91000000000},
        {"month": "May", "value": 88000000000},
        {"month": "Jun", "value": 93000000000},
    ]
    return chart_data

@app.get("/api/dashboard/top-clients")
async def get_top_clients(current_user: dict = Depends(get_current_user)):
    if mongo_db is None:
        raise HTTPException(status_code=500, detail="Database connection failed")
    
    clients_collection = mongo_db.clients
    top_clients = list(clients_collection.find({}).sort("portfolio_value", -1).limit(5))
    
    result = []
    for client in top_clients:
        result.append({
            "id": str(client["_id"]),
            "name": client["name"],
            "portfolioValue": client["portfolio_value"],
            "riskAppetite": client["risk_appetite"]
        })
    
    return result

@app.get("/api/dashboard/recent-transactions")
async def get_recent_transactions(current_user: dict = Depends(get_current_user)):
    connection = get_mysql_connection()
    if connection is None:
        return []
    
    cursor = connection.cursor(dictionary=True)
    query = """
    SELECT id, client_name, transaction_type, stock_symbol, total_amount, transaction_date, status
    FROM transactions
    ORDER BY transaction_date DESC
    LIMIT 10
    """
    cursor.execute(query)
    transactions = cursor.fetchall()
    
    result = []
    for transaction in transactions:
        result.append({
            "id": str(transaction["id"]),
            "clientName": transaction["client_name"],
            "type": transaction["transaction_type"],
            "stock": transaction["stock_symbol"],
            "amount": float(transaction["total_amount"]),
            "date": transaction["transaction_date"].isoformat(),
            "status": transaction["status"]
        })
    
    cursor.close()
    connection.close()
    return result

# Query processing with LangChain
class QueryProcessor:
    def __init__(self):
        self.llm = OpenRouterLLM()
        self.setup_sql_agent()
    
    def setup_sql_agent(self):
        try:
            # Create MySQL connection for LangChain with URL-encoded password
            encoded_password = urllib.parse.quote_plus(MYSQL_CONFIG['password'])
            mysql_uri = f"mysql+pymysql://{MYSQL_CONFIG['user']}:{encoded_password}@{MYSQL_CONFIG['host']}/{MYSQL_CONFIG['database']}"
            self.sql_db = SQLDatabase.from_uri(mysql_uri)
            
            # Create SQL toolkit
            toolkit = SQLDatabaseToolkit(db=self.sql_db, llm=self.llm)
            
            # Create SQL agent
            self.sql_agent = create_sql_agent(
                llm=self.llm,
                toolkit=toolkit,
                verbose=True,
                handle_parsing_errors=True
            )
        except Exception as e:
            print(f"Failed to setup SQL agent: {e}")
            self.sql_agent = None
    
    def get_mongodb_context(self, query: str) -> str:
        """Get relevant MongoDB data based on query"""
        if mongo_db is None:
            return "MongoDB connection not available"
        
        clients_collection = mongo_db.clients
        context = "Client Profile Data:\n"
        
        # Get sample client data for context
        clients = list(clients_collection.find({}).limit(5))
        for client in clients:
            context += f"- {client['name']}: Portfolio Value: ₹{client['portfolio_value']/10000000:.2f} Cr, "
            context += f"Risk: {client['risk_appetite']}, RM: {client['relationship_manager']}\n"
        
        return context
    
    def determine_query_type(self, query: str) -> str:
        """Determine what type of response is needed"""
        query_lower = query.lower()
        
        if any(word in query_lower for word in ['top', 'highest', 'best', 'ranking']):
            return 'table'
        elif any(word in query_lower for word in ['chart', 'graph', 'trend', 'performance']):
            return 'chart'
        else:
            return 'text'
    
    def process_complex_query(self, query: str) -> dict:
        """Process complex queries that might need both MongoDB and MySQL data"""
        try:
            # Get MongoDB context
            mongo_context = self.get_mongodb_context(query)
            
            # Determine response type
            response_type = self.determine_query_type(query)
            
            # Create enhanced prompt with context
            enhanced_prompt = f"""
            You are a wealth portfolio management assistant. Answer the following query using the provided context.
            
            MongoDB Client Context:
            {mongo_context}
            
            MySQL Database Schema:
            - transactions table: client_name, transaction_type, stock_symbol, quantity, price_per_share, total_amount, transaction_date, status, relationship_manager
            - portfolio_holdings table: client_name, stock_symbol, quantity, average_price, current_value
            - relationship_managers table: name, email, total_clients, total_portfolio_value, performance_rating
            
            Query: {query}
            
            Please provide a comprehensive answer. If you need specific transaction data, mention that SQL queries would be needed.
            """
            
            # Get LLM response
            response = self.llm._call(enhanced_prompt)
            
            # Generate mock data based on query type
            mock_data = self.generate_mock_data(query, response_type)
            
            return {
                "response": response,
                "data": mock_data,
                "visualizationType": response_type
            }
            
        except Exception as e:
            return {
                "response": f"I encountered an error processing your query: {str(e)}. Please try rephrasing your question.",
                "data": None,
                "visualizationType": "text"
            }
    
    def generate_mock_data(self, query: str, response_type: str) -> dict:
        """Generate mock data for visualization"""
        query_lower = query.lower()
        
        if response_type == 'table':
            if 'top' in query_lower and 'portfolio' in query_lower:
                return {
                    "headers": ["Client Name", "Portfolio Value (Cr)", "Risk Appetite", "Relationship Manager"],
                    "rows": [
                        ["Vikram Malhotra", "₹250.00", "Moderate", "Neha Gupta"],
                        ["Priya Singh", "₹200.00", "Moderate", "Neha Gupta"],
                        ["Sneha Reddy", "₹180.00", "Aggressive", "Rahul Verma"],
                        ["Rajesh Kumar", "₹150.00", "Aggressive", "Amit Sharma"],
                        ["Arjun Patel", "₹120.00", "Conservative", "Amit Sharma"]
                    ]
                }
            elif 'relationship manager' in query_lower:
                return {
                    "headers": ["RM Name", "Total Clients", "Portfolio Value (Cr)", "Performance Rating"],
                    "rows": [
                        ["Neha Gupta", "2", "₹450.00", "4.8"],
                        ["Amit Sharma", "2", "₹270.00", "4.5"],
                        ["Rahul Verma", "1", "₹180.00", "4.2"]
                    ]
                }
        
        elif response_type == 'chart':
            if 'performance' in query_lower or 'trend' in query_lower:
                return [
                    {"name": "Jan", "value": 85000000000},
                    {"name": "Feb", "value": 87000000000},
                    {"name": "Mar", "value": 89000000000},
                    {"name": "Apr", "value": 91000000000},
                    {"name": "May", "value": 88000000000},
                    {"name": "Jun", "value": 93000000000}
                ]
        
        return None

# Initialize query processor
query_processor = QueryProcessor()

@app.post("/api/query/process")
async def process_query(query_request: QueryRequest, current_user: dict = Depends(get_current_user)):
    """Process natural language queries using LangChain and AI"""
    try:
        result = query_processor.process_complex_query(query_request.query)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Query processing failed: {str(e)}")

@app.get("/")
async def root():
    return {"message": "Wealth Portfolio RAG Agent API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
