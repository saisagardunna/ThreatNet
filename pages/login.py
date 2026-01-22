import streamlit as st
import time

st.set_page_config(page_title="Login – THREATNET", layout="centered")

def load_css(file_name):
    with open(file_name) as f:
        st.markdown(f'<style>{f.read()}</style>', unsafe_allow_html=True)

load_css("styles.css")

st.markdown("<h1 style='text-align: center;'>🔐 Sign in to THREATNET</h1>", unsafe_allow_html=True)

# Login Form
with st.form("login_form"):
    username = st.text_input("Username", placeholder="admin")
    password = st.text_input("Password", type="password", placeholder="••••••")
    
    submitted = st.form_submit_button("Sign In Securely")

if submitted:
    with st.spinner("Verifying Credentials with Encrypted Database..."):
        time.sleep(2) # Fake delay for effect
        st.success("Access granted. Redirecting you to the THREATNET overview...")
        time.sleep(1)
        st.switch_page("pages/about.py")

st.markdown("""
<div style="text-align: center; margin-top: 50px;">
    <p style="color: #444;">Restricted Access. All activities are monitored.</p>
</div>
""", unsafe_allow_html=True)
