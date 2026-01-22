import streamlit as st
import pandas as pd
import plotly.express as px
import os

st.set_page_config(page_title="THREATNET Dashboard", layout="wide")

def load_css(file_name):
    with open(file_name) as f:
        st.markdown(f'<style>{f.read()}</style>', unsafe_allow_html=True)

load_css("styles.css")

st.title("📊 THREATNET Dashboard")

# Load Data
data_path = os.path.join("data", "cyber_threat_dataset.xlsx")
if not os.path.exists(data_path):
    st.error("Dataset not found! Please run data generation script.")
    st.stop()
    
df = pd.read_excel(data_path)

# KPIs
total_threats = len(df)
attack_types = df['attack_type'].nunique()
high_severity = len(df[df['severity'] == 'Critical'])

col1, col2, col3 = st.columns(3)
col1.metric("Total Threats Analyzed", total_threats, "+50 today")
col2.metric("Attack Categories Identified", attack_types)
col3.metric("Critical Alerts", high_severity, "URGENT", delta_color="inverse")

st.markdown("---")

# Charts
c1, c2 = st.columns(2)

with c1:
    st.subheader("Attack Type Distribution")
    fig_pie = px.pie(df, names='attack_type', hole=0.4, 
                     color_discrete_sequence=px.colors.sequential.RdBu,
                     title="Threats by Category")
    fig_pie.update_layout(paper_bgcolor="rgba(0,0,0,0)", plot_bgcolor="rgba(0,0,0,0)", font=dict(color="white"))
    st.plotly_chart(fig_pie, use_container_width=True)

with c2:
    st.subheader("Severity Levels")
    fig_bar = px.bar(df, x='severity', color='severity', 
                     color_discrete_map={'Low': 'green', 'Medium': 'yellow', 'High': 'orange', 'Critical': 'red'},
                     title="Threat Severity Count")
    fig_bar.update_layout(paper_bgcolor="rgba(0,0,0,0)", plot_bgcolor="rgba(0,0,0,0)", font=dict(color="white"))
    st.plotly_chart(fig_bar, use_container_width=True)

# Datatable
st.subheader("📝 Recent Threat Reports")
st.dataframe(df.head(10), use_container_width=True)

# Navigation
st.markdown("<br>", unsafe_allow_html=True)
c_nav1, c_nav2, c_nav3 = st.columns(3)
if c_nav1.button("🔍 New Query"):
    st.switch_page("pages/user_query.py")
if c_nav2.button("📥 Download Reports"):
    st.info("Report downloading started...")
if c_nav3.button("📞 Contact Support"):
    st.switch_page("pages/contact.py")
