import streamlit as st

st.set_page_config(page_title="Contact – THREATNET", layout="centered")

def load_css(file_name):
    with open(file_name) as f:
        st.markdown(f'<style>{f.read()}</style>', unsafe_allow_html=True)

load_css("styles.css")

st.title("📞 Contact THREATNET Support")

st.markdown("""
<div style="background-color: rgba(0,0,0,0.5); padding: 20px; border-radius: 10px; border: 1px solid #00f2ff;">
    <h3>Technical Support Team</h3>
    <p>For urgent inquiries or system malfunctions, please contact:</p>
    <ul>
        <li><b>Lead Developer:</b> A. Hemanth</li>
        <li><b>Role:</b> Senior Security Architect</li>
        <li><b>Phone:</b> +91 6300325135</li>
        <li><b>Email:</b> support@threatnet.ai</li>
    </ul>
    <br>
    <p><i>Operating Hours: 24/7 SOC Support</i></p>
</div>
""", unsafe_allow_html=True)

col1, col2 = st.columns(2)
with col1:
    st.image("https://cdn-icons-png.flaticon.com/512/732/732200.png", width=50)
    st.write("Email Support")
with col2:
    st.image("https://cdn-icons-png.flaticon.com/512/724/724664.png", width=50)
    st.write("Hotline: 1800-CYBER")

if st.button("⬅️ Back to Home"):
    st.switch_page("app.py")
