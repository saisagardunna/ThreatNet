import streamlit as st
import base64

# Page Config
st.set_page_config(
    page_title="THREATNET – Cyber Threat Intelligence",
    page_icon="🛡️",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# Load CSS
def load_css(file_name):
    with open(file_name) as f:
        st.markdown(f'<style>{f.read()}</style>', unsafe_allow_html=True)

load_css("styles.css")

# Background Animation & Diagonal Text
# Note: Streamlit doesn't support diagonal divs easily without component hacking, 
# but we used global CSS to style elements. We'll add a clickable overlay.

st.markdown("""
<div class="landing-title">
    THREATNET<br>
    Your AI‑Powered Cyber Threat Intelligence Platform
</div>
<div class="diagonal-text">
    SIMPLE DASHBOARDS • SMART ALERTS • ATTACK GRAPHS • REAL‑TIME ANALYSIS • ZERO TRUST • DARK WEB MONITORING
</div>
<br><br><br>
""", unsafe_allow_html=True)

col1, col2, col3 = st.columns([1, 2, 1])

with col2:
    st.markdown("""
    <div style="text-align: center; color: #a0a0a0; margin-bottom: 30px;">
        <h3>Welcome to THREATNET</h3>
        <p>Monitor threats in real time with clear visuals and easy‑to‑understand insights.</p>
    </div>
    """, unsafe_allow_html=True)
    
    # "Click ANYWHERE" - we simulate this with a large button that acts as entry
    if st.button("🚀 Enter THREATNET Dashboard", use_container_width=True):
        st.switch_page("pages/login.py")

# Footer
st.markdown("""
<div style="position: fixed; bottom: 10px; width: 100%; text-align: center; color: #555;">
    © 2026 AI-CTI Systems Inc. | Final Year Project
</div>
""", unsafe_allow_html=True)
