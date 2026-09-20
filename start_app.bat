@echo off
echo ===================================================
echo   Starting Callix - Full Stack Application
echo ===================================================

echo [1/2] Starting Python AI Backend (Port 5001)...
start "Callix Backend" cmd /c "python backend/python/run.py"

echo [2/2] Starting Frontend (Port 5173)...
cd frontend
start http://localhost:5173
npm run dev
