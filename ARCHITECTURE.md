# Wealth Portfolio RAG Agent - Architecture Documentation

## 🏗️ System Overview

The Wealth Portfolio RAG Agent is a modern, full-stack application designed to provide natural language query capabilities for wealth portfolio management. The system follows a microservices-inspired architecture with clear separation of concerns between frontend, backend, and data layers.

## 🎯 Architecture Principles

- **Separation of Concerns**: Clear boundaries between UI, business logic, and data layers
- **Scalability**: Designed to handle growing data volumes and user loads
- **Security**: JWT authentication, input validation, and secure data handling
- **Performance**: Optimized queries, caching strategies, and efficient data processing
- **Maintainability**: Clean code structure, comprehensive documentation, and modular design

## 🏛️ High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Databases     │
│   (React/Next)  │◄──►│   (FastAPI)     │◄──►│   MongoDB       │
│                 │    │                 │    │   MySQL         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Interface│    │  AI Processing  │    │   Data Storage  │
│   - Dashboard   │    │  - LangChain    │    │   - Client Data │
│   - Query UI    │    │  - OpenRouter   │    │   - Transactions│
│   - Charts      │    │  - JWT Auth     │    │   - Analytics   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🎨 Frontend Architecture

### Technology Stack
- **Framework**: React 19 with TypeScript
- **Meta Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Context API
- **Data Visualization**: Recharts
- **Icons**: Lucide React

### Component Architecture

```
src/
├── components/
│   ├── Auth/                 # Authentication components
│   │   ├── Login.tsx        # Login form with validation
│   │   └── Register.tsx     # Registration form
│   ├── Dashboard/           # Dashboard components
│   │   ├── Dashboard.tsx    # Main dashboard layout
│   │   ├── PortfolioChart.tsx # Portfolio performance charts
│   │   ├── RecentTransactions.tsx # Transaction history
│   │   └── TopClients.tsx   # Top clients display
│   ├── Navigation/          # Navigation components
│   │   └── Navigation.tsx   # Main navigation bar
│   └── Query/              # AI Query interface
│       ├── QueryInterface.tsx # Main query interface
│       └── QueryResult.tsx  # Query result display
├── contexts/
│   └── AuthContext.tsx     # Authentication state management
└── services/
    └── api.ts             # API service layer
```

### Key Design Patterns

#### 1. Component Composition
- Reusable UI components using shadcn/ui
- Custom hooks for business logic
- Context providers for global state

#### 2. Responsive Design
- Mobile-first approach with Tailwind CSS
- Flexible grid systems
- Adaptive layouts for different screen sizes

#### 3. State Management
```typescript
// AuthContext for global authentication state
interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}
```

#### 4. API Integration
```typescript
// Centralized API service
class ApiService {
  private baseURL: string;
  
  async login(credentials: LoginCredentials): Promise<AuthResponse>
  async register(userData: RegisterData): Promise<AuthResponse>
  async processQuery(query: string): Promise<QueryResponse>
  async getDashboardData(): Promise<DashboardData>
}
```

## 🔧 Backend Architecture

### Technology Stack
- **Framework**: FastAPI (Python)
- **AI/ML**: LangChain with OpenRouter API
- **Authentication**: JWT with bcrypt
- **Database**: MongoDB (client data) + MySQL (transactions)
- **Validation**: Pydantic models

### Service Architecture

```
backend/
├── main.py                 # FastAPI application entry point
├── requirements.txt        # Python dependencies
├── test_connections.py     # Database connection testing
└── (future modules)
    ├── models/            # Pydantic data models
    ├── services/          # Business logic services
    ├── middleware/        # Custom middleware
    └── utils/            # Utility functions
```

### API Endpoints Structure

#### Authentication Endpoints
```python
POST /auth/register     # User registration
POST /auth/login        # User authentication
POST /auth/logout       # User logout
GET  /auth/me          # Get current user
```

#### Query Endpoints
```python
POST /api/query         # Process natural language query
GET  /api/dashboard     # Get dashboard data
GET  /api/portfolio     # Get portfolio analytics
```

#### Data Endpoints
```python
GET  /api/clients       # Get client list
GET  /api/transactions  # Get transaction history
GET  /api/analytics     # Get analytics data
```

### Core Services

#### 1. Query Processing Service
```python
class QueryProcessor:
    def __init__(self):
        self.llm = self._setup_llm()
        self.sql_agent = self._setup_sql_agent()
    
    def process_query(self, query: str) -> QueryResponse:
        # 1. Determine query type
        # 2. Generate appropriate response
        # 3. Format and return result
```

#### 2. Authentication Service
```python
class AuthService:
    def create_user(self, user_data: UserCreate) -> User
    def authenticate_user(self, credentials: LoginCredentials) -> User
    def create_access_token(self, user: User) -> str
    def verify_token(self, token: str) -> User
```

#### 3. Data Service
```python
class DataService:
    def get_client_data(self) -> List[Client]
    def get_transaction_data(self) -> List[Transaction]
    def get_portfolio_analytics(self) -> PortfolioAnalytics
```

## 🗄️ Database Architecture

### Data Layer Design

#### MongoDB (Client Data)
**Purpose**: Store client profiles and portfolio information
**Collections**:
- `clients`: Client profiles and preferences
- `portfolios`: Portfolio holdings and valuations
- `relationship_managers`: RM information and performance

**Schema Design**:
```javascript
// Client Document
{
  _id: ObjectId,
  name: String,
  email: String,
  phone: String,
  address: String,
  risk_appetite: String, // "Aggressive", "Moderate", "Conservative"
  investment_preferences: [String],
  relationship_manager: String,
  portfolio_value: Number,
  client_type: String, // "Film Star", "Sports Personality"
  created_at: Date,
  updated_at: Date
}
```

#### MySQL (Transaction Data)
**Purpose**: Store transactional data and relationship management
**Tables**:
- `transactions`: Buy/sell transactions
- `stocks`: Stock information and metadata
- `relationship_managers`: RM performance metrics

**Schema Design**:
```sql
-- Transactions Table
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

### Data Flow Architecture

```
User Query → Frontend → Backend API → Query Processor → Database Query → Response Formatting → Frontend Display
     │           │           │              │               │                │                    │
     │           │           │              │               │                │                    │
     ▼           ▼           ▼              ▼               ▼                ▼                    ▼
Natural    React      FastAPI        LangChain        MongoDB/        JSON/Chart        React
Language   Component  Endpoint       Processing       MySQL Query     Formatting       Component
```

## 🤖 AI/ML Architecture

### LangChain Integration

#### Query Processing Pipeline
1. **Input Processing**: Natural language query validation
2. **Intent Recognition**: Determine query type and required data sources
3. **Context Enrichment**: Add business context and constraints
4. **Query Generation**: Generate appropriate database queries
5. **Response Formatting**: Format results based on query type
6. **Visualization**: Generate charts/tables when appropriate

#### LangChain Components
```python
class QueryProcessor:
    def __init__(self):
        # LLM Configuration
        self.llm = ChatOpenAI(
            model="deepseek-chat",
            temperature=0.1,
            openai_api_key=OPENROUTER_API_KEY,
            openai_api_base="https://openrouter.ai/api/v1"
        )
        
        # SQL Agent Setup
        self.sql_agent = create_sql_agent(
            llm=self.llm,
            toolkit=self.toolkit,
            verbose=True,
            handle_parsing_errors=True
        )
    
    def determine_query_type(self, query: str) -> str:
        # Analyze query to determine response type
        # Returns: "text", "table", "chart"
    
    def generate_response(self, query: str) -> QueryResponse:
        # Process query and generate appropriate response
```

### Query Types and Processing

#### 1. Text Queries
- **Purpose**: General information and insights
- **Processing**: Direct LLM response with context
- **Example**: "What is the average portfolio size?"

#### 2. Table Queries
- **Purpose**: Structured data retrieval
- **Processing**: SQL generation and execution
- **Example**: "Show me the top 5 clients by portfolio value"

#### 3. Chart Queries
- **Purpose**: Data visualization
- **Processing**: Data aggregation + chart generation
- **Example**: "Show me portfolio performance over time"

## 🔐 Security Architecture

### Authentication & Authorization

#### JWT Implementation
```python
# Token Structure
{
  "sub": "user_id",
  "email": "user@example.com",
  "exp": "expiration_timestamp",
  "iat": "issued_at_timestamp"
}

# Security Features
- Token expiration (24 hours)
- Refresh token mechanism
- Secure token storage (httpOnly cookies)
```

#### Password Security
```python
# Password Hashing
password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

# Password Verification
is_valid = bcrypt.checkpw(password.encode('utf-8'), stored_hash)
```

### Data Security

#### Input Validation
```python
# Pydantic Models for Request Validation
class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)

class QueryRequest(BaseModel):
    query: str = Field(min_length=1, max_length=500)
```

#### SQL Injection Prevention
- Parameterized queries
- Input sanitization
- ORM usage for database operations

#### CORS Configuration
```python
# Backend CORS Settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 📊 Performance Architecture

### Optimization Strategies

#### 1. Database Optimization
- **Indexing**: Strategic indexes on frequently queried fields
- **Query Optimization**: Efficient SQL queries with proper joins
- **Connection Pooling**: Reuse database connections

#### 2. Frontend Optimization
- **Code Splitting**: Lazy loading of components
- **Caching**: React Query for API response caching
- **Bundle Optimization**: Tree shaking and minification

#### 3. API Optimization
- **Response Caching**: Cache frequently requested data
- **Pagination**: Limit response sizes for large datasets
- **Async Processing**: Non-blocking operations

### Monitoring & Logging

#### Performance Metrics
- API response times
- Database query performance
- Frontend load times
- User interaction metrics

#### Error Tracking
- Structured logging
- Error aggregation
- Performance alerts

## 🔄 Deployment Architecture

### Development Environment
```
Local Development Setup:
├── Frontend: localhost:3000 (Next.js dev server)
├── Backend: localhost:8000 (FastAPI uvicorn)
├── MongoDB: localhost:27017
└── MySQL: localhost:3306
```

### Production Considerations

#### Containerization
```dockerfile
# Frontend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

#### Environment Configuration
```bash
# Environment Variables
NODE_ENV=production
API_BASE_URL=https://api.wealthportfolio.com
MONGODB_URL=mongodb://production-mongo:27017/Valuefydb
MYSQL_HOST=production-mysql
OPENROUTER_API_KEY=prod_api_key
```

## 🚀 Scalability Considerations

### Horizontal Scaling
- **Load Balancing**: Multiple backend instances
- **Database Sharding**: Distribute data across multiple databases
- **CDN**: Static asset delivery optimization

### Vertical Scaling
- **Resource Optimization**: Efficient memory and CPU usage
- **Database Optimization**: Query optimization and indexing
- **Caching Layers**: Redis for session and data caching

### Future Enhancements
- **Microservices**: Split into domain-specific services
- **Event-Driven Architecture**: Async processing with message queues
- **Real-time Updates**: WebSocket integration for live data
- **Advanced Analytics**: Machine learning for portfolio insights

## 📈 Monitoring & Observability

### Health Checks
```python
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow(),
        "services": {
            "mongodb": check_mongodb_connection(),
            "mysql": check_mysql_connection(),
            "openrouter": check_openrouter_connection()
        }
    }
```

### Metrics Collection
- **Application Metrics**: Response times, error rates
- **Business Metrics**: Query volume, user engagement
- **Infrastructure Metrics**: CPU, memory, disk usage

### Alerting
- **Performance Alerts**: High response times
- **Error Alerts**: High error rates
- **Business Alerts**: Unusual query patterns

## 🔧 Configuration Management

### Environment-Based Configuration
```python
# Configuration Classes
class Settings(BaseSettings):
    environment: str = "development"
    debug: bool = False
    mongodb_url: str
    mysql_config: dict
    openrouter_api_key: str
    jwt_secret: str
    
    class Config:
        env_file = ".env"
```

### Feature Flags
```python
# Feature Toggle System
FEATURES = {
    "advanced_analytics": True,
    "real_time_updates": False,
    "multi_tenant": False
}
```

This architecture documentation provides a comprehensive overview of the Wealth Portfolio RAG Agent's design, implementation details, and scalability considerations. It serves as a reference for developers, architects, and stakeholders to understand the system's structure and make informed decisions about future enhancements. 