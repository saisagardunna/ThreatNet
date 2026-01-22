from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import pickle
import os
import numpy as np
import pandas as pd
import requests
import json
import re
from dotenv import load_dotenv

# --- CONFIGURATION ---
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load environment variables
load_dotenv()
# Try to load from frontend .env if not found (Local Dev Setup) 
# Logic to find .env file
if not os.getenv("GROQ_API_KEY"):
    frontend_env_path = os.path.join(os.path.dirname(__file__), "..", "..", "web_app", "frontend", ".env") 
    relative_frontend_path = os.path.join(os.path.dirname(__file__), "..", "frontend", ".env")
    
    if os.path.exists(relative_frontend_path):
        load_dotenv(relative_frontend_path)

GROQ_API_KEY = os.getenv("GROQ_API_KEY") or os.getenv("VITE_GROQ_API_KEY")

# --- DATA & MODELS ---
MITIGATIONS = {
    'Phishing': {
        'Caution': "Do NOT click any links or download attachments. The sender identity is likely spoofed.",
        'Precautions': ["Verify sender email address carefully.", "Hover over links to see the actual URL.", "Enable multi-factor authentication (MFA)."],
        'Solution': "Report the email to IT Security immediately. Isolate the affected machine if a link was clicked. Reset credentials."
    },
    'Malware': {
        'Caution': "Malicious software detected. It may be stealing data or damaging system files.",
        'Precautions': ["Disconnect the device from the network immediately.", "Do not login to sensitive accounts.", "Ensure backup drives are disconnected."],
        'Solution': "Run a full system scan using Endpoint Detection & Response (EDR) tools. Reimage the machine if persistence is confirmed."
    },
    'DDoS': {
        'Caution': "Network traffic spike detected. Services may become unavailable.",
        'Precautions': ["Monitor bandwidth usage.", "Identify source IPs.", "Prepare to scale resources."],
        'Solution': "Activate DDoS mitigation services (e.g., Cloudflare, AWS Shield). Block malicious IP ranges at the firewall."
    },
    'Ransomware': {
        'Caution': "⚠️ CRITICAL: Files are being encrypted. Do NOT pay the ransom.",
        'Precautions': ["Isolate the infected host immediately.", "Check for 'vshadow' deletion commands.", "Verify backup integrity."],
        'Solution': "Disconnect network. Identify the strain using ID-Ransomware. Restore from offline backups. Patch the entry vector (e.g., RDP)."
    },
    'SQL Injection': {
        'Caution': "Database integrity at risk. Attacker may be dumping data.",
        'Precautions': ["Check database logs for query anomalies.", "Monitor for data exfiltration."],
        'Solution': "Sanitize all user inputs. Use Prepared Statements (Parameterized Queries). Patch vulnerable input fields immediately."
    }
}

GRAPH_NODES = {
    'Phishing': {'src': 'Attacker (Email)', 'vuln': 'Human Element', 'impact': 'Credential Theft'},
    'Malware': {'src': 'C2 Server', 'vuln': 'Unpatched Software', 'impact': 'System Compromise'},
    'DDoS': {'src': 'Botnet', 'vuln': 'Network Bandwidth', 'impact': 'Service Unavailable'},
    'Ransomware': {'src': 'Malicious Payload', 'vuln': 'RDP / Phishing', 'impact': 'Data Encryption'},
    'SQL Injection': {'src': 'Web Client', 'vuln': 'Input Fields', 'impact': 'Database Leak'}
}

# Global Resources
model = None
vectorizer = None
dataset_df = None

def load_resources():
    global model, vectorizer, dataset_df
    
    # 1. Load ML Model
    try:
        model_path = os.path.join("model", "model.pkl")
        vec_path = os.path.join("model", "vectorizer.pkl")
        if os.path.exists(model_path) and os.path.exists(vec_path):
            with open(model_path, "rb") as f:
                model = pickle.load(f)
            with open(vec_path, "rb") as f:
                vectorizer = pickle.load(f)
            print("ML Model loaded successfully.")
        else:
            print("ML Model files not found.")
    except Exception as e:
        print(f"Error loading ML model: {e}")

    # 2. Load Excel Dataset
    try:
        # Path: web_app/backend/../../data/cyber_threat_dataset.xlsx
        dataset_path = os.path.join(os.path.dirname(__file__), "..", "..", "data", "cyber_threat_dataset.xlsx")
        dataset_path = os.path.normpath(dataset_path)
        
        if os.path.exists(dataset_path):
            dataset_df = pd.read_excel(dataset_path)
            # Preprocess: lowercase the text column for case-insensitive searching
            if 'threat_text' in dataset_df.columns:
                dataset_df['threat_text'] = dataset_df['threat_text'].astype(str).str.lower()
            print(f"Dataset loaded: {len(dataset_df)} records.")
        else:
            print(f"Dataset not found at {dataset_path}")
    except Exception as e:
        print(f"Error loading dataset: {e}")

load_resources()

# --- REQUEST MODEL ---
class AnalysisRequest(BaseModel):
    text: str
    message_type: str = "email"

class ChatRequest(BaseModel):
    message: str
    history: list = []

# --- ENDPOINTS ---
@app.post("/chat")
async def chat_with_bot(request: ChatRequest):
    """
    Chatbot endpoint using Groq API.
    Context: Expert on the current Website (ThreatNet) and Phishing detection.
    """
    if not GROQ_API_KEY:
        raise HTTPException(status_code=500, detail="Groq API Key not configured")

    try:
        headers = {
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json"
        }
        
        system_prompt = """You are 'Cute Bot', the official AI Assistant for ThreatNet (this website).
        
        YOUR ROLE:
        1. Expert in Phishing Detection and Cyber Threat Intelligence (CTI).
        2. You know everything about this website (ThreatNet):
           - It uses AI + Dataset (Excel) + ML to detect threats.
           - It has a Dashboard for text analysis.
           - It can generate PDF reports.
           - It identifies Phishing, Malware, DDoS, Ransomware, SQL Injection.
        3. You explain technical concepts simply.
        4. When asked about a specific email/text, analyze it for phishing indicators (Urgency, Bad links, Requests for money).
        
        TONE:
        - Friendly, helpful, professional, and slightly cute/enthusiastic.
        - You live in the bottom-right corner of the screen!
        """
        
        messages = [{"role": "system", "content": system_prompt}]
        
        # Append history (limit to last 6 messages to save context window)
        messages.extend(request.history[-6:])
        
        # Append current message
        messages.append({"role": "user", "content": request.message})
        
        payload = {
            "model": "llama-3.3-70b-versatile",
            "messages": messages,
            "temperature": 0.7
        }
        
        resp = requests.post("https://api.groq.com/openai/v1/chat/completions", headers=headers, json=payload)
        
        if resp.status_code == 200:
            return {"reply": resp.json()['choices'][0]['message']['content']}
        else:
             raise HTTPException(status_code=resp.status_code, detail=f"Groq API Error: {resp.text}")

    except Exception as e:
        print(f"Chat Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze")
async def analyze_threat(request: AnalysisRequest):
    """
    Combined analysis: Dataset check + ML local model + Groq AI fallback/enhancement.
    """
    response_data = {
        "dataset_result": None,
        "ai_result": None,
        "ml_result": None
    }
    
    input_text = request.text
    input_lower = input_text.lower()
    
    # 1. DATASET CHECK
    dataset_match = None
    if dataset_df is not None and 'threat_text' in dataset_df.columns:
        for _, row in dataset_df.iterrows():
            threat_txt = str(row['threat_text']).lower()
            if len(threat_txt) > 4 and threat_txt in input_lower:
                dataset_match = {
                    "threat_type": row.get('attack_type', 'Spam'),
                    "confidence": 0.99,
                    "spam_score": 95,
                    "method": "Dataset (Exact Match)",
                    "matched_patterns": [threat_txt],
                    "explanation": f"Matched known threat signature from dataset Report ID: {row.get('report_id', 'N/A')}"
                }
                break
    
    # Failsafe fallback
    if not dataset_match:
         spam_patterns = {
            'Phishing': ['verify account', 'confirm identity', 'urgent action', 'click here', 'suspended account', 'unusual activity', 'verify now', 'confirm password', 'account locked', 'login attempt', 'security alert', 'bank account', 'update information'],
            'Malware': ['download attachment', 'open file', 'install', '.exe', 'virus', 'infected', 'enable macros', '.zip', '.rar', 'malicious', 'trojan'],
            'Ransomware': ['bitcoin', 'payment required', 'locked files', 'decrypt', 'ransom', 'encrypted', 'wallet', 'btc', 'pay now'],
            'Spam': ['win prize', 'congratulations', 'free', 'limited offer', 'act now', 'special promotion', 'winner', 'lottery', 'inheritance', '100% free', 'buy now'],
            'SQL Injection': ['drop table', 'select *', 'union select', '1=1', 'or 1=1', '--', 'delete from', 'insert into', 'update set'],
            'DDoS': ['flood', 'overwhelm', 'traffic spike', 'denial of service', 'packet flood', 'botnet']
        }
         found_matches = []
         detected_type = "Legitimate"
         max_matches = 0
         for t_type, patterns in spam_patterns.items():
            matches = [p for p in patterns if p in input_lower]
            if matches:
                 if len(matches) > max_matches:
                    max_matches = len(matches)
                    detected_type = t_type
                    found_matches = matches
         
         if max_matches > 0:
            dataset_match = {
                "threat_type": detected_type,
                "confidence": min(0.99, 0.7 + (max_matches * 0.1)),
                "spam_score": min(100, 40 + (max_matches * 20)),
                "method": "Dataset (Heuristic)",
                "matched_patterns": found_matches,
                "explanation": f"Detected suspicious patterns commonly found in {detected_type}: {', '.join(found_matches)}"
            }

    response_data["dataset_result"] = dataset_match or {
        "threat_type": "Legitimate",
        "confidence": 0.0,
        "spam_score": 0,
        "method": "Dataset",
        "explanation": "No matching threat signature found in dataset."
    }

    # 2. ML MODEL CHECK (Local)
    if model and vectorizer:
        try:
            vec_text = vectorizer.transform([input_text])
            prediction = model.predict(vec_text)[0]
            probs = model.predict_proba(vec_text)[0]
            confidence = float(max(probs))
            
            mitigation_info = MITIGATIONS.get(prediction, {})
            
            response_data["ml_result"] = {
                "prediction": prediction,
                "confidence": confidence,
                "mitigation": mitigation_info
            }
        except Exception as e:
            print(f"ML Prediction Error: {e}")

    # 3. GROQ AI CHECK
    if GROQ_API_KEY:
        try:
            headers = {
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json"
            }
            
            system_prompt = """You are a cybersecurity expert. Analyze the user's message for spam and threats.
            CRITICAL:
            1. "Hi" or normal chat is SAFE.
            2. "Verify account", "Bitcoin", "Urgent" are THREATS.
            3. Return JSON ONLY.
            """
            
            user_prompt = f"""Analyze this {request.message_type} message:
            "{input_text}"
            
            Respond with JSON:
            {{
              "threat_type": "Phishing|Malware|Ransomware|SQL Injection|DDoS|Spam|Legitimate",
              "confidence": 0.95,
              "spam_score": 85,
              "explanation": "Reasoning...",
              "caution": "Warning if any",
              "precautions": ["Step 1", "Step 2"],
              "solution": "Fix...",
              "attack_flow": {{ "source": "...", "vulnerability": "...", "impact": "..." }}
            }}
            """
            
            payload = {
                "model": "llama-3.3-70b-versatile",
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                "temperature": 0.3
            }
            
            resp = requests.post("https://api.groq.com/openai/v1/chat/completions", headers=headers, json=payload)
            if resp.status_code == 200:
                content = resp.json()['choices'][0]['message']['content']
                # extract json
                json_match = re.search(r'\{[\s\S]*\}', content)
                if json_match:
                    ai_json = json.loads(json_match.group(0))
                    response_data["ai_result"] = ai_json
            else:
                print(f"Groq API returned {resp.status_code}: {resp.text}")
                
        except Exception as e:
            print(f"Groq API Error: {e}")

    return response_data

@app.get("/")
def read_root():
    return {"message": "Cyber CTI API with Dataset & Groq Support is Running"}
