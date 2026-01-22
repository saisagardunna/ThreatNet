import streamlit as st

st.set_page_config(page_title="About – THREATNET", layout="wide")

def load_css(file_name):
    with open(file_name) as f:
        st.markdown(f'<style>{f.read()}</style>', unsafe_allow_html=True)

load_css("styles.css")

st.title("ℹ️ About THREATNET")

col1, col2 = st.columns(2)

with col1:
    st.markdown("""
    ### 🛡️ What is THREATNET?
    **THREATNET** is an **AI‑driven Cyber Threat Intelligence & Attack Graph Platform**. 
    It leverages **Machine Learning** to analyze unstructured threat reports and automatically classify them into clear attack categories.
    
    ### 🚀 Key Capabilities
    - **Real-time Threat Analysis**: Turns raw logs and emails into simple threat labels.
    - **Attack Graph Visualization**: Uses NetworkX to map possible attack paths.
    - **Executive Reporting**: Generates PDF reports for CISO/SOC Managers.
    - **Instant Alerting**: Integrated WhatsApp API for rapid response.
    """)
    
    if st.button("GO TO DASHBOARD 📊"):
        st.switch_page("pages/dashboard.py")

with col2:
    st.markdown("### 🌐 How THREATNET Helps")
    st.info("""
    In a modern **Security Operations Center (SOC)**, analysts receive thousands of alerts daily. 
    THREATNET helps automate the early **triage** phase, reduces noise, and highlights the most important threats first.
    """)
    
    # Placeholder for cool image or animation
    st.image("https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80", caption="SOC Visualization")

st.markdown("---")
st.markdown("### 🏗️ Technologies Used")
c1, c2, c3, c4 = st.columns(4)
c1.metric("Language", "Python 3.10")
c2.metric("Frontend", "Streamlit")
c3.metric("ML Model", "Random Forest")
c4.metric("Graph Theory", "NetworkX")
