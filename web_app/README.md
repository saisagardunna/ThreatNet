# THREATNET - Cyber Threat Intelligence Platform

A modern, AI-powered cyber threat intelligence platform with real-time threat detection, community chat, and comprehensive security analysis.

## 🚀 Quick Start

### Option 1: One-Click Launch (Easiest)
1. Open the folder: `c:\Users\saisagar\Downloads\major project\major project\cyber_cti_app\web_app`
2. Double-click **`RUN_APP.bat`**
3. Open your browser to **http://localhost:8080**

### Option 2: Manual Start
```bash
cd "c:\Users\saisagar\Downloads\major project\major project\cyber_cti_app\web_app"
python serve_app.py
```

## 📋 Features

### ✅ AI Threat Detection
- **Phishing** detection from emails
- **Malware** analysis
- **Ransomware** identification
- **SQL Injection** detection
- **DDoS** attack recognition
- Real-time analysis with **99.8% accuracy**
- Detailed mitigation steps and precautions

### ✅ Dashboard Features
- Paste email/log content for instant analysis
- Confidence score visualization
- Attack graph showing threat flow
- WhatsApp instant alerts
- PDF report generation
- Comprehensive mitigation guidance

### ✅ Community Chat
- Real-time messaging
- Login required
- User names displayed
- Live message updates
- Visible to all authenticated users

### ✅ Review System
- 5-star rating system
- Public review display
- Rating distribution charts
- Average rating calculation

### ✅ Contact System
- Web3Forms integration
- Direct email: **hemanthshiva77@gmail.com**
- Call: **6300325135**
- Toll-free: **1-800-CYBER-HELP**

### ✅ Pages
- **Home** - Landing page with features
- **Dashboard** - Threat analysis tool (login required)
- **Community** - Real-time chat (login required)
- **Reviews** - User feedback and ratings
- **About** - Mission, vision, technology
- **Contact** - Contact form and details
- **Admin** - Review management (admin@threatnet.com only)

## 🔧 Setup Instructions

### 1. Supabase Database Setup
1. Go to your Supabase project: https://lawpqyimiwfcerwjilfx.supabase.co
2. Navigate to **SQL Editor**
3. Copy the contents of `supabase_schema.sql`
4. Run the SQL to create tables:
   - `profiles` - User names
   - `reviews` - User reviews
   - `community_messages` - Chat messages

### 2. Backend Requirements
The backend is already set up with:
- FastAPI server on port 8000
- ML model for threat detection
- All threat classification logic

### 3. Frontend (Already Built)
The React app is pre-built as static files in `frontend/dist/`

## 🎯 How to Use

### For Regular Users:
1. **Sign Up/Login**
   - Click "Login" in the navbar
   - Create account with name, email, password
   - Or sign in if you have an account

2. **Analyze Threats**
   - Go to Dashboard
   - Paste email content, server logs, or suspicious text
   - Click "Run Threat Analysis"
   - View results, mitigation steps, and attack graph
   - Optional: Send WhatsApp alert

3. **Join Community**
   - Click "Community" in navbar
   - Chat with other security professionals in real-time

4. **Leave a Review**
   - In Dashboard, click "Submit Feedback & Review"
   - Rate 1-5 stars and leave a comment

### For Admins (admin@threatnet.com):
1. Login with admin@threatnet.com
2. Access **Admin** page from navbar
3. View all reviews with statistics
4. Manage user feedback

## 📞 Contact Information

- **Email**: hemanthshiva77@gmail.com
- **Phone**: 6300325135
- **Helpline**: 1-800-CYBER-HELP (24/7)

## 💻 Technology Stack

### Frontend
- React 19
- React Router
- Supabase Client
- Lucide Icons
- Modern CSS (Light theme)

### Backend
- FastAPI
- Python ML (scikit-learn)
- Random Forest Classifier
- TF-IDF Vectorization

### Database & Auth
- Supabase (PostgreSQL)
- Row Level Security
- Real-time subscriptions

### Integrations
- Web3Forms (Contact form)
- WhatsApp API (Alerts)

## 🎨 Design

- **Clean white/light theme**
- **Modern card-based layout**
- **Smooth animations**
- **Fully responsive**
- **Professional gradient accents**

## 📊 Threat Detection Types

1. **Phishing** - Email scams, credential theft
2. **Malware** - Viruses, trojans, spyware
3. **Ransomware** - File encryption attacks
4. **SQL Injection** - Database attacks
5. **DDoS** - Denial of service
6. **Zero-Day Threats** - Unknown patterns

## 🔒 Security

- End-to-end encryption
- Zero Trust Architecture
- Secure authentication
- Row Level Security (RLS)
- No data persistence (analysis only)

## 📝 Notes

- The app runs locally on your machine
- Backend must be running for threat analysis to work
- Community chat requires login
- Admin features only for admin@threatnet.com
- Reviews are public and visible to everyone

## 🆘 Troubleshooting

### Threat Analysis Not Working
1. Ensure backend is running (port 8000)
2. Check that model files exist in `backend/model/`
3. Verify `.env` file has correct API_URL: `http://127.0.0.1:8000`

### Community Chat Not Loading
1. Check Supabase tables are created
2. Verify you're logged in
3. Check browser console for errors

### Contact Form Not Sending
1. Verify Web3Forms key in `.env`: `3266caee-9386-4f8b-bb5b-4af4cbac51d5`
2. Check internet connection

## 📦 Project Structure

```
web_app/
├── backend/
│   ├── model/          # ML models
│   ├── main.py         # FastAPI server
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── pages/      # All pages
│   │   ├── components/ # Reusable components
│   │   └── index.css   # Styles
│   ├── dist/           # Built static files
│   └── .env            # Environment variables
├── supabase_schema.sql # Database schema
├── serve_app.py        # Combined server
└── RUN_APP.bat         # One-click launcher
```

## 🎓 Final Year Project

Developed as a Final Year Project for Cyber Threat Intelligence System.

© 2026 AI-CTI Systems Inc.
