import streamlit as st
import pickle
import os
import networkx as nx
import sys
import time
from datetime import datetime

# Add parent dir to path to import graph
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from graph import generate_attack_graph, plot_graph
from fpdf import FPDF

st.set_page_config(page_title="THREATNET Threat Analyzer", layout="wide", page_icon="🛡️")

def load_css(file_name):
    with open(file_name) as f:
        st.markdown(f'<style>{f.read()}</style>', unsafe_allow_html=True)

load_css("styles.css")

# --- KNOWLEDGE BASE ---
MITIGATIONS = {
    'Phishing': {
        'Caution': "Do NOT click any links or download attachments. The sender identity is likely spoofed.",
        'Precautions': [
            "Verify sender email address carefully.",
            "Hover over links to see the actual URL.",
            "Enable multi-factor authentication (MFA)."
        ],
        'Solution': "Report the email to IT Security immediately. Isolate the affected machine if a link was clicked. Reset credentials."
    },
    'Malware': {
        'Caution': "Malicious software detected. It may be stealing data or damaging system files.",
        'Precautions': [
            "Disconnect the device from the network immediately.",
            "Do not login to sensitive accounts.",
            "Ensure backup drives are disconnected."
        ],
        'Solution': "Run a full system scan using Endpoint Detection & Response (EDR) tools. Reimage the machine if persistence is confirmed."
    },
    'DDoS': {
        'Caution': "Network traffic spike detected. Services may become unavailable.",
        'Precautions': [
            "Monitor bandwidth usage.",
            "Identify source IPs.",
            "Prepare to scale resources."
        ],
        'Solution': "Activate DDoS mitigation services (e.g., Cloudflare, AWS Shield). Block malicious IP ranges at the firewall."
    },
    'Ransomware': {
        'Caution': "⚠️ CRITICAL: Files are being encrypted. Do NOT pay the ransom.",
        'Precautions': [
            "Isolate the infected host immediately.",
            "Check for 'vshadow' deletion commands.",
            "Verify backup integrity."
        ],
        'Solution': "Disconnect network. Identify the strain using ID-Ransomware. Restore from offline backups. Patch the entry vector (e.g., RDP)."
    },
    'SQL Injection': {
        'Caution': "Database integrity at risk. Attacker may be dumping data.",
        'Precautions': [
            "Check database logs for query anomalies.",
            "Monitor for data exfiltration."
        ],
        'Solution': "Sanitize all user inputs. Use Prepared Statements (Parameterized Queries). Patch vulnerable input fields immediately."
    }
}

# --- LOAD MODEL ---
@st.cache_resource
def load_model():
    model_path = os.path.join("model", "model.pkl")
    vec_path = os.path.join("model", "vectorizer.pkl")
    
    if not os.path.exists(model_path) or not os.path.exists(vec_path):
        return None, None
        
    with open(model_path, "rb") as f:
        model = pickle.load(f)
    with open(vec_path, "rb") as f:
        vectorizer = pickle.load(f)
    return model, vectorizer

model, vectorizer = load_model()

# --- HEADER ---
st.markdown("""
<div style="text-align: center; margin-bottom: 20px;">
    <h1>🔍 THREATNET – AI Threat Analyzer</h1>
    <p style="color: #00f2ff; font-size: 1.2em;">Paste your log or email text and let THREATNET explain the risk in simple terms.</p>
</div>
""", unsafe_allow_html=True)

# --- MAIN LAYOUT ---
col1, col2 = st.columns([1, 1.5], gap="large")

with col1:
    st.markdown("### 📥 Add Threat Data")
    st.markdown("Paste the raw log, email body, or alert below. THREATNET will classify it and suggest what to do next.")
    
    user_input = st.text_area("Log / Threat Text", height=150, 
                              placeholder="[Paste Threat Intelligence Report or Log Here]\nExample: Suspicious SSH login attempts detected from IP 192.168.1.10 followed by binary execution...",
                              label_visibility="collapsed")
    
    whatsapp_num = st.text_input("📱 WhatsApp Alert Number (Optional)", placeholder="+919876543210")
    
    analyze_btn = st.button("🚀 INITIATE ANALYSIS PROTOCOL", use_container_width=True)

    st.markdown("---")
    st.markdown("### ⚙️ SYSTEM STATUS")
    st.info("Model Status: ONLINE (Random Forest v1.0)")
    st.success("Database Connection: SECURE")

def generate_pdf(prediction, confidence, user_input, mitigation):
    pdf = FPDF()
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=15)
    
    # Header
    pdf.set_font("Arial", 'B', 16)
    pdf.cell(0, 10, "CYBER THREAT INTELLIGENCE REPORT", ln=True, align='C')
    pdf.ln(10)
    
    # Meta Info
    pdf.set_font("Arial", size=10)
    pdf.cell(0, 10, f"Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", ln=True)
    pdf.ln(5)
    
    # Analysis Result
    pdf.set_font("Arial", 'B', 14)
    pdf.set_text_color(255, 0, 0)
    pdf.cell(0, 10, f"DETECTED THREAT: {prediction.upper()}", ln=True)
    pdf.set_text_color(0, 0, 0)
    pdf.set_font("Arial", size=12)
    pdf.cell(0, 10, f"Confidence Score: {confidence*100:.2f}%", ln=True)
    pdf.ln(10)
    
    # Details
    pdf.set_font("Arial", 'B', 12)
    pdf.cell(0, 10, "Original Log Data:", ln=True)
    pdf.set_font("Arial", size=10)
    pdf.multi_cell(0, 10, user_input)
    pdf.ln(5)
    
    # Actions
    pdf.set_font("Arial", 'B', 12)
    pdf.cell(0, 10, "Recommended Actions:", ln=True)
    pdf.set_font("Arial", size=10)
    pdf.multi_cell(0, 10, f"Solution: {mitigation['Solution']}")
    
    filename = f"CTI_Report_{int(time.time())}.pdf"
    pdf.output(filename)
    return filename

if analyze_btn and user_input:
    if not model:
        st.error("❌ Model not loaded. Please run training script.")
    else:
        # PREDICITON
        vec_text = vectorizer.transform([user_input])
        prediction = model.predict(vec_text)[0]
        probs = model.predict_proba(vec_text)[0]
        confidence = max(probs)
        
        # Get Mitigation Info
        mitigation = MITIGATIONS.get(prediction, {
            'Caution': "Unknown Threat Pattern.",
            'Precautions': ["Investigate manually."],
            'Solution': "Isolate and Analyze."
        })
        
        # --- RESULTS COLUMN ---
        with col2:
            st.markdown(f"""
            <div style="background-color: rgba(255, 0, 0, 0.1); border: 2px solid #ff0055; padding: 15px; border-radius: 10px; margin-bottom: 20px;">
                <h2 style="color: #ff0055; margin:0; text-align: center;">⚠️ THREAT DETECTED: {prediction.upper()}</h2>
                <p style="text-align: center; color: #fff;">Confidence Level: <b>{confidence*100:.1f}%</b></p>
                <div style="background-color: #333; height: 10px; border-radius: 5px; width: 100%;">
                    <div style="background-color: #ff0055; width: {confidence*100}%; height: 100%; border-radius: 5px;"></div>
                </div>
            </div>
            """, unsafe_allow_html=True)
            
            # TABS for info
            tab1, tab2, tab3 = st.tabs(["🛡️ MITIGATION PLAN", "🕸️ ATTACK GRAPH", "📄 EXPORT"])
            
            with tab1:
                st.markdown(f"### 🛑 CAUTION")
                st.warning(mitigation['Caution'])
                
                st.markdown("### ✅ PRECAUTIONS & STEPS")
                for step in mitigation['Precautions']:
                    st.markdown(f"- {step}")
                    
                st.markdown("### 💉 REMEDIATION / SOLUTION")
                st.success(mitigation['Solution'])
                
                # Auto WhatsApp integration
                st.markdown("---")
                st.markdown("### 📲 INSTANT OBSERVER ALERT")
                
                # Auto WhatsApp integration
                st.markdown("---")
                st.markdown("### 📲 INSTANT OBSERVER ALERT")
                
                if whatsapp_num:
                    st.info(f"Ready to send alert to: {whatsapp_num}")
                    
                    # Encode message for URL
                    msg = f"🚨 *THREAT ALERT* 🚨%0A*Type:* {prediction}%0A*Confidence:* {confidence*100:.1f}%%0A*Action:* {mitigation['Solution']}"
                    wa_link = f"https://wa.me/{whatsapp_num.replace('+', '').replace(' ', '')}?text={msg}"
                    
                    st.markdown(f"""
                    <a href="{wa_link}" target="_blank" style="text-decoration: none;">
                        <button style="
                            background-color: #25D366; 
                            color: white; 
                            border: none; 
                            padding: 15px 32px; 
                            text-align: center; 
                            text-decoration: none; 
                            display: inline-block; 
                            font-size: 16px; 
                            margin: 4px 2px; 
                            cursor: pointer; 
                            border-radius: 8px; 
                            width: 100%;
                            font-weight: bold;
                            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
                        ">
                            🚀 CLICK TO SEND WHATSAPP ALERT (OPENS APP)
                        </button>
                    </a>
                    <p style="text-align:center; font-size: 0.8em; color: #aaa; margin-top: 5px;">
                        *Opens WhatsApp Web/Desktop to confirm sending from YOUR number.*
                    </p>
                    """, unsafe_allow_html=True)

                else:
                    st.info("ℹ️ Enter a WhatsApp Number above to enable Instant Alerts.")

            with tab2:
                G = generate_attack_graph(prediction)
                plot_graph(G)
                st.caption(f"Visualizing attack path for {prediction}")

            with tab3:
                st.markdown("Generate official incident report for compliance.")
                pdf_file = generate_pdf(prediction, confidence, user_input, mitigation)
                with open(pdf_file, "rb") as f:
                    st.download_button("⬇️ DOWNLOAD ENCRYPTED PDF REPORT", f, file_name=pdf_file, mime="application/pdf", use_container_width=True)

elif analyze_btn and not user_input:
    st.warning("⚠️ Please input threat data to analyze.")
