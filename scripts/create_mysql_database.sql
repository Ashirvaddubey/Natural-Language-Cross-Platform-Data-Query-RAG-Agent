-- Create the wealth_portfolio database
CREATE DATABASE IF NOT EXISTS wealth_portfolio;
USE wealth_portfolio;

-- Create users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user', 'manager') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_name VARCHAR(255) NOT NULL,
    transaction_type ENUM('BUY', 'SELL') NOT NULL,
    stock_symbol VARCHAR(20) NOT NULL,
    stock_name VARCHAR(255),
    quantity INT NOT NULL,
    price_per_share DECIMAL(15, 2) NOT NULL,
    total_amount DECIMAL(15, 2) NOT NULL,
    transaction_date DATETIME NOT NULL,
    status ENUM('COMPLETED', 'PENDING', 'FAILED') DEFAULT 'COMPLETED',
    relationship_manager VARCHAR(255) NOT NULL,
    commission DECIMAL(10, 2) DEFAULT 0.00,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_client_name (client_name),
    INDEX idx_stock_symbol (stock_symbol),
    INDEX idx_transaction_date (transaction_date),
    INDEX idx_relationship_manager (relationship_manager)
);

-- Create portfolio_holdings table
CREATE TABLE IF NOT EXISTS portfolio_holdings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_name VARCHAR(255) NOT NULL,
    stock_symbol VARCHAR(20) NOT NULL,
    stock_name VARCHAR(255),
    quantity INT NOT NULL,
    average_price DECIMAL(15, 2) NOT NULL,
    current_price DECIMAL(15, 2),
    current_value DECIMAL(15, 2) NOT NULL,
    unrealized_pnl DECIMAL(15, 2) DEFAULT 0.00,
    sector VARCHAR(100),
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_client_stock (client_name, stock_symbol),
    INDEX idx_client_name (client_name),
    INDEX idx_stock_symbol (stock_symbol)
);

-- Create relationship_managers table
CREATE TABLE IF NOT EXISTS relationship_managers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    employee_id VARCHAR(50) UNIQUE,
    total_clients INT DEFAULT 0,
    total_portfolio_value DECIMAL(20, 2) DEFAULT 0,
    performance_rating DECIMAL(3, 2) DEFAULT 0.00,
    target_portfolio_value DECIMAL(20, 2) DEFAULT 0,
    commission_earned DECIMAL(15, 2) DEFAULT 0.00,
    hire_date DATE,
    status ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create stock_master table for stock information
CREATE TABLE IF NOT EXISTS stock_master (
    id INT AUTO_INCREMENT PRIMARY KEY,
    symbol VARCHAR(20) UNIQUE NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    sector VARCHAR(100),
    industry VARCHAR(100),
    market_cap DECIMAL(20, 2),
    current_price DECIMAL(10, 2),
    pe_ratio DECIMAL(8, 2),
    dividend_yield DECIMAL(5, 2),
    beta DECIMAL(5, 2),
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create portfolio_performance table for tracking historical performance
CREATE TABLE IF NOT EXISTS portfolio_performance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_name VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    portfolio_value DECIMAL(20, 2) NOT NULL,
    daily_return DECIMAL(8, 4) DEFAULT 0.0000,
    cumulative_return DECIMAL(8, 4) DEFAULT 0.0000,
    benchmark_return DECIMAL(8, 4) DEFAULT 0.0000,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_client_date (client_name, date),
    INDEX idx_client_name (client_name),
    INDEX idx_date (date)
);

-- Insert sample data
INSERT IGNORE INTO stock_master (symbol, company_name, sector, industry, market_cap, current_price, pe_ratio, dividend_yield, beta) VALUES
('RELIANCE', 'Reliance Industries Limited', 'Energy', 'Oil & Gas', 1500000000000, 2650.00, 15.2, 0.8, 1.1),
('TCS', 'Tata Consultancy Services', 'Technology', 'IT Services', 1200000000000, 3250.00, 28.5, 1.2, 0.9),
('HDFC', 'HDFC Bank Limited', 'Financial Services', 'Banking', 800000000000, 1850.00, 18.7, 1.5, 1.0),
('INFY', 'Infosys Limited', 'Technology', 'IT Services', 650000000000, 1520.00, 25.3, 2.1, 0.8),
('ICICI', 'ICICI Bank Limited', 'Financial Services', 'Banking', 700000000000, 920.00, 16.4, 1.8, 1.2),
('WIPRO', 'Wipro Limited', 'Technology', 'IT Services', 250000000000, 410.00, 22.1, 2.5, 0.9),
('BHARTIARTL', 'Bharti Airtel Limited', 'Telecom', 'Telecommunications', 450000000000, 850.00, 19.8, 1.0, 1.1),
('ITC', 'ITC Limited', 'FMCG', 'Consumer Goods', 400000000000, 320.00, 24.6, 4.2, 0.7),
('SBIN', 'State Bank of India', 'Financial Services', 'Banking', 350000000000, 580.00, 12.3, 2.8, 1.3),
('HCLTECH', 'HCL Technologies Limited', 'Technology', 'IT Services', 380000000000, 1180.00, 21.7, 1.9, 0.8);

-- Insert sample relationship managers
INSERT IGNORE INTO relationship_managers (name, email, phone, employee_id, total_clients, total_portfolio_value, performance_rating, target_portfolio_value, hire_date, status) VALUES
('Amit Sharma', 'amit.sharma@wealthmanager.com', '+91-9876543220', 'RM001', 2, 2700000000.00, 4.5, 3000000000.00, '2020-01-15', 'ACTIVE'),
('Neha Gupta', 'neha.gupta@wealthmanager.com', '+91-9876543221', 'RM002', 2, 4500000000.00, 4.8, 5000000000.00, '2019-03-20', 'ACTIVE'),
('Rahul Verma', 'rahul.verma@wealthmanager.com', '+91-9876543222', 'RM003', 1, 1800000000.00, 4.2, 2500000000.00, '2021-06-10', 'ACTIVE'),
('Priya Patel', 'priya.patel@wealthmanager.com', '+91-9876543223', 'RM004', 0, 0.00, 4.0, 2000000000.00, '2022-01-05', 'ACTIVE'),
('Suresh Kumar', 'suresh.kumar@wealthmanager.com', '+91-9876543224', 'RM005', 0, 0.00, 3.8, 1500000000.00, '2022-08-15', 'ACTIVE');

-- Insert sample transactions
INSERT IGNORE INTO transactions (client_name, transaction_type, stock_symbol, stock_name, quantity, price_per_share, total_amount, transaction_date, status, relationship_manager, commission, notes) VALUES
('Rajesh Kumar', 'BUY', 'RELIANCE', 'Reliance Industries Limited', 1000, 2500.00, 2500000.00, '2024-01-15 10:30:00', 'COMPLETED', 'Amit Sharma', 2500.00, 'Initial investment in energy sector'),
('Priya Singh', 'BUY', 'TCS', 'Tata Consultancy Services', 500, 3200.00, 1600000.00, '2024-01-16 11:45:00', 'COMPLETED', 'Neha Gupta', 1600.00, 'Technology sector diversification'),
('Arjun Patel', 'SELL', 'HDFC', 'HDFC Bank Limited', 200, 1800.00, 360000.00, '2024-01-17 14:20:00', 'COMPLETED', 'Amit Sharma', 360.00, 'Profit booking in banking sector'),
('Sneha Reddy', 'BUY', 'INFY', 'Infosys Limited', 800, 1500.00, 1200000.00, '2024-01-18 09:15:00', 'COMPLETED', 'Rahul Verma', 1200.00, 'IT sector exposure'),
('Vikram Malhotra', 'BUY', 'RELIANCE', 'Reliance Industries Limited', 2000, 2600.00, 5200000.00, '2024-01-19 16:30:00', 'COMPLETED', 'Neha Gupta', 5200.00, 'Large cap investment'),
('Rajesh Kumar', 'BUY', 'WIPRO', 'Wipro Limited', 1500, 400.00, 600000.00, '2024-01-20 12:00:00', 'PENDING', 'Amit Sharma', 0.00, 'Pending approval for IT sector'),
('Priya Singh', 'SELL', 'ICICI', 'ICICI Bank Limited', 300, 900.00, 270000.00, '2024-01-21 15:45:00', 'COMPLETED', 'Neha Gupta', 270.00, 'Portfolio rebalancing'),
('Sneha Reddy', 'BUY', 'BHARTIARTL', 'Bharti Airtel Limited', 600, 850.00, 510000.00, '2024-01-22 10:20:00', 'COMPLETED', 'Rahul Verma', 510.00, 'Telecom sector entry'),
('Vikram Malhotra', 'BUY', 'ITC', 'ITC Limited', 3000, 320.00, 960000.00, '2024-01-23 13:15:00', 'COMPLETED', 'Neha Gupta', 960.00, 'FMCG sector diversification'),
('Arjun Patel', 'BUY', 'SBIN', 'State Bank of India', 500, 580.00, 290000.00, '2024-01-24 11:30:00', 'COMPLETED', 'Amit Sharma', 290.00, 'PSU banking exposure');

-- Insert sample portfolio holdings
INSERT IGNORE INTO portfolio_holdings (client_name, stock_symbol, stock_name, quantity, average_price, current_price, current_value, unrealized_pnl, sector) VALUES
('Rajesh Kumar', 'RELIANCE', 'Reliance Industries Limited', 1000, 2500.00, 2650.00, 2650000.00, 150000.00, 'Energy'),
('Rajesh Kumar', 'WIPRO', 'Wipro Limited', 1500, 400.00, 410.00, 615000.00, 15000.00, 'Technology'),
('Priya Singh', 'TCS', 'Tata Consultancy Services', 500, 3200.00, 3250.00, 1625000.00, 25000.00, 'Technology'),
('Arjun Patel', 'SBIN', 'State Bank of India', 500, 580.00, 580.00, 290000.00, 0.00, 'Financial Services'),
('Sneha Reddy', 'INFY', 'Infosys Limited', 800, 1500.00, 1520.00, 1216000.00, 16000.00, 'Technology'),
('Sneha Reddy', 'BHARTIARTL', 'Bharti Airtel Limited', 600, 850.00, 850.00, 510000.00, 0.00, 'Telecom'),
('Vikram Malhotra', 'RELIANCE', 'Reliance Industries Limited', 2000, 2600.00, 2650.00, 5300000.00, 100000.00, 'Energy'),
('Vikram Malhotra', 'ITC', 'ITC Limited', 3000, 320.00, 320.00, 960000.00, 0.00, 'FMCG');

-- Insert sample portfolio performance data
INSERT IGNORE INTO portfolio_performance (client_name, date, portfolio_value, daily_return, cumulative_return, benchmark_return) VALUES
('Rajesh Kumar', '2024-01-01', 3200000.00, 0.0000, 0.0000, 0.0000),
('Rajesh Kumar', '2024-01-15', 3265000.00, 0.0203, 0.0203, 0.0150),
('Rajesh Kumar', '2024-01-31', 3265000.00, 0.0000, 0.0203, 0.0180),
('Priya Singh', '2024-01-01', 1600000.00, 0.0000, 0.0000, 0.0000),
('Priya Singh', '2024-01-16', 1625000.00, 0.0156, 0.0156, 0.0150),
('Priya Singh', '2024-01-31', 1625000.00, 0.0000, 0.0156, 0.0180),
('Vikram Malhotra', '2024-01-01', 6200000.00, 0.0000, 0.0000, 0.0000),
('Vikram Malhotra', '2024-01-19', 6260000.00, 0.0097, 0.0097, 0.0150),
('Vikram Malhotra', '2024-01-31', 6260000.00, 0.0000, 0.0097, 0.0180);
