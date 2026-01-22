@echo off
cd /d "%~dp0"
title CTI Platform Launcher

echo ===================================================
echo   AI-Driven Cyber Threat Intelligence Platform
echo ===================================================

if not exist "data\cyber_threat_dataset.xlsx" (
    echo [!] Dataset not found. Generating...
    python generate_dataset.py
)

if not exist "model\model.pkl" (
    echo [!] Model artifacts not found. Training...
    cd model
    python train_model.py
    cd ..
)

echo.
echo [+] Launching Application...
streamlit run app.py
pause
