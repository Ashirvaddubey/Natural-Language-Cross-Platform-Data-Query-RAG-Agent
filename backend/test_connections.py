#!/usr/bin/env python3
"""
Test script to verify database connections and API configuration
"""

import mysql.connector
from mysql.connector import Error
from pymongo import MongoClient
import requests
import sys

# Configuration (same as main.py)
MONGODB_URL = "mongodb://localhost:27017/Valuefydb"
MYSQL_CONFIG = {
    'host': 'localhost',
    'database': 'wealth_portfolio',
    'user': 'root',
    'password': 'Dubey@&2002'
}
OPENROUTER_API_KEY = "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"

def test_mongodb():
    """Test MongoDB connection"""
    try:
        print("🔍 Testing MongoDB connection...")
        client = MongoClient(MONGODB_URL, serverSelectionTimeoutMS=5000)
        # Test the connection
        client.admin.command('ping')
        db = client.get_database()
        print(f"✅ MongoDB connected successfully to database: {db.name}")
        
        # Test collections
        collections = db.list_collection_names()
        print(f"📊 Available collections: {collections}")
        
        client.close()
        return True
    except Exception as e:
        print(f"❌ MongoDB connection failed: {e}")
        return False

def test_mysql():
    """Test MySQL connection"""
    try:
        print("🔍 Testing MySQL connection...")
        connection = mysql.connector.connect(**MYSQL_CONFIG)
        
        if connection.is_connected():
            cursor = connection.cursor()
            cursor.execute("SELECT VERSION()")
            version = cursor.fetchone()
            print(f"✅ MySQL connected successfully. Version: {version[0]}")
            
            # Test database
            cursor.execute("SHOW DATABASES LIKE 'wealth_portfolio'")
            db_exists = cursor.fetchone()
            if db_exists:
                print("✅ Database 'wealth_portfolio' exists")
                
                # Test tables
                cursor.execute("USE wealth_portfolio")
                cursor.execute("SHOW TABLES")
                tables = cursor.fetchall()
                table_names = [table[0] for table in tables]
                print(f"📊 Available tables: {table_names}")
            else:
                print("⚠️  Database 'wealth_portfolio' does not exist")
            
            cursor.close()
            connection.close()
            return True
    except Error as e:
        print(f"❌ MySQL connection failed: {e}")
        return False

def test_openrouter_api():
    """Test OpenRouter API connection"""
    try:
        print("🔍 Testing OpenRouter API...")
        headers = {
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "Wealth Portfolio Manager"
        }
        
        # Test with a simple request
        data = {
            "model": "deepseek/deepseek-chat",
            "messages": [{"role": "user", "content": "Hello, this is a test."}],
            "max_tokens": 50
        }
        
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers=headers,
            json=data,
            timeout=10
        )
        
        if response.status_code == 200:
            print("✅ OpenRouter API connection successful")
            result = response.json()
            print(f"📝 Test response: {result['choices'][0]['message']['content'][:50]}...")
            return True
        else:
            print(f"❌ OpenRouter API failed with status {response.status_code}: {response.text}")
            return False
    except Exception as e:
        print(f"❌ OpenRouter API test failed: {e}")
        return False

def main():
    """Run all connection tests"""
    print("🧪 Running connection tests for Wealth Portfolio RAG Agent\n")
    
    tests = [
        ("MongoDB", test_mongodb),
        ("MySQL", test_mysql),
        ("OpenRouter API", test_openrouter_api)
    ]
    
    results = []
    for test_name, test_func in tests:
        print(f"\n{'='*50}")
        print(f"Testing {test_name}")
        print('='*50)
        success = test_func()
        results.append((test_name, success))
    
    print(f"\n{'='*50}")
    print("TEST SUMMARY")
    print('='*50)
    
    all_passed = True
    for test_name, success in results:
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{test_name}: {status}")
        if not success:
            all_passed = False
    
    if all_passed:
        print("\n🎉 All tests passed! Your environment is ready.")
        print("You can now run: python3 main.py")
    else:
        print("\n⚠️  Some tests failed. Please fix the issues above before proceeding.")
        sys.exit(1)

if __name__ == "__main__":
    main()
