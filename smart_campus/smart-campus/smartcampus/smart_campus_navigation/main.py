import streamlit as st
from PIL import Image
import requests

# Configuration
OLLAMA_API_URL = "http://localhost:11434/api/generate"
st.set_page_config(page_title="Smart Campus Assistant", layout="wide")

# Sidebar for feature selection
with st.sidebar:
    
    app_mode = st.radio("Select Mode", ["Campus Navigation", "Lost & Found"])

# Main App
if app_mode == "Campus Navigation":
    st.title("🏫 Campus Navigation Assistant")
    
    prompt = st.text_area("Ask about locations or administrative procedures:", height=100)
    
    if st.button("Ask") and prompt.strip():
        with st.spinner("Searching campus information..."):
            response = requests.post(OLLAMA_API_URL, json={
                "model": "mistral:latest",
                "prompt": f"CAMPUS_NAV_PROMPT: {prompt}",
                "stream": False
            })
            if response.status_code == 200:
                st.success(response.json()['response'])
            else:
                st.error("Error processing request.")

else:  # Lost & Found mode
    st.title("🔍 Lost & Found Assistant")
    
    tab1, tab2 = st.tabs(["Report Lost Item", "Browse Found Items"])
    
    with tab1:
        with st.form("lost_item_form"):
            desc = st.text_input("Item Description")
            location = st.text_input("Where did you lose it?")
            date = st.date_input("When did you lose it?")
            image = st.file_uploader("Upload image (optional)")
            
            if st.form_submit_button("Submit"):
                # Process and store the lost item report
                st.success("Lost item report submitted. We'll notify you if found.")

    with tab2:
        search_term = st.text_input("Search found items")
        if search_term:
            # Implement search through found items
            st.write("Matching found items would appear here")