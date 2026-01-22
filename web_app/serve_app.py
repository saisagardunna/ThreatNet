"""
Simple HTTP server to serve the built React app and API together
Run this file and open http://localhost:8080 in your browser
"""
import http.server
import socketserver
import os
from pathlib import Path
import threading
import subprocess
import sys

# Get the directory paths
SCRIPT_DIR = Path(__file__).parent
FRONTEND_DIST = SCRIPT_DIR / "frontend" / "dist"
BACKEND_DIR = SCRIPT_DIR / "backend"

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(FRONTEND_DIST), **kwargs)
    
    def end_headers(self):
        # Add CORS headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

def start_backend():
    """Start the FastAPI backend server"""
    print("🚀 Starting Backend API on http://localhost:8000")
    python_exe = BACKEND_DIR / "venv" / "Scripts" / "python.exe"
    subprocess.run([
        str(python_exe), 
        "-m", 
        "uvicorn", 
        "main:app", 
        "--reload", 
        "--port", 
        "8000"
    ], cwd=str(BACKEND_DIR))

def start_frontend():
    """Start the frontend server"""
    PORT = 8080
    print(f"🌐 Starting Frontend on http://localhost:{PORT}")
    print(f"📂 Serving files from: {FRONTEND_DIST}")
    print("\n" + "="*60)
    print("✅ THREATNET APPLICATION IS RUNNING")
    print("="*60)
    print(f"\n🔗 Open your browser to: http://localhost:{PORT}")
    print("\n⚠️  Keep this window open while using the app")
    print("⚠️  Press Ctrl+C to stop the servers\n")
    
    with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
        httpd.serve_forever()

if __name__ == "__main__":
    # Check if dist folder exists
    if not FRONTEND_DIST.exists():
        print("❌ Error: Frontend build not found!")
        print(f"   Looking for: {FRONTEND_DIST}")
        print("\n   Please run 'npm run build' in the frontend directory first.")
        sys.exit(1)
    
    # Start backend in a separate thread
    backend_thread = threading.Thread(target=start_backend, daemon=True)
    backend_thread.start()
    
    # Start frontend in main thread
    try:
        start_frontend()
    except KeyboardInterrupt:
        print("\n\n👋 Shutting down servers...")
        sys.exit(0)
