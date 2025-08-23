#!/usr/bin/env python3
"""
Startup script for Smart Tutor Educational Chatbot
"""

from app import app

if __name__ == '__main__':
    print("🚀 Starting Smart Tutor Educational Chatbot...")
    print("📚 Your AI-powered learning companion is ready!")
    print("🌐 Open your browser and go to: http://localhost:5001")
    print("⏹️  Press Ctrl+C to stop the server")
    print("-" * 50)
    
    app.run(debug=True, host='0.0.0.0', port=5001)
