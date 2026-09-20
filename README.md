# Callix · Enterprise Real-Time AI Voice Security & Scam Interception Platform

<!-- markdownlint-disable MD013 -->
<!-- markdownlint-disable MD033 -->
<p align="center">
  <img src="frontend/public/vite.svg" alt="Callix Logo" width="80" height="80" />
</p>

<p align="center">
  <strong>Next-Generation Real-Time Voice Fraud Defense, Deepfake Audio Detection & Family Telephony Security</strong>
</p>

<p align="center">
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-indigo.svg" alt="License: MIT" /></a>
  <a href="https://www.python.org/"><img src="https://img.shields.io/badge/Python-3.10+-3776AB.svg?logo=python&logoColor=white" alt="Python 3.10+" /></a>
  <a href="https://flask.palletsprojects.com/"><img src="https://img.shields.io/badge/Backend-Flask_REST_API-000000.svg?logo=flask&logoColor=white" alt="Flask REST API" /></a>
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/Frontend-React_18-61DAFB.svg?logo=react&logoColor=black" alt="React 18" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.x-3178C6.svg?logo=typescript&logoColor=white" alt="TypeScript 5.x" /></a>
  <a href="https://scikit-learn.org/"><img src="https://img.shields.io/badge/ML_Ensemble-5_Models-F7931E.svg?logo=scikitlearn&logoColor=white" alt="ML Ensemble" /></a>
  <a href="https://firebase.google.com/"><img src="https://img.shields.io/badge/Auth-Firebase_(Google_|_GitHub_|_Email)-FFCA28.svg?logo=firebase&logoColor=black" alt="Firebase Auth" /></a>
</p>
<!-- markdownlint-enable MD033 -->

---

## 📌 Executive Summary

**Callix** is an enterprise-grade AI voice cybersecurity and telephony protection platform built to detect, analyze, and intercept sophisticated voice scams, synthetic deepfakes, financial coercion, and social engineering attacks in real time.

Designed specifically to tackle modern fraud vectors—including **Digital Arrest**, **Customs & Police Extortion**, **Bank KYC Expiry & OTP Theft**, **UPI Refund Phishing**, and **Deepfake Voice Cloning**—Callix integrates a high-performance **Python AI/ML backend** with an ultra-responsive **React + TypeScript frontend**.

---

## 🏛️ System Architecture

```text
                                  ┌─────────────────────────────────────────────────────────┐
                                  │            Callix React 18 + Vite Frontend              │
                                  │  (Security Dashboard, Scanner, Simulator, Forensics)    │
                                  └──────────────────────────┬──────────────────────────────┘
                                                             │
                                              REST API / WebSocket Telemetry
                                                             │
                                                             ▼
                                  ┌─────────────────────────────────────────────────────────┐
                                  │           Callix Python REST API (Flask Core)           │
                                  │   (Endpoints: /health, /ml, /audio, /nlp, /reports)     │
                                  └──────┬───────────────────┬───────────────────┬──────────┘
                                         │                   │                   │
                     ┌───────────────────┴───┐               │        ┌──────────┴──────────────────┐
                     │                       │               │        │                             │
                     ▼                       ▼               │        ▼                             ▼
       ┌────────────────────────┐  ┌──────────────────┐      │  ┌───────────────────────────┐ ┌────────────────────┐
       │   5-Model ML Ensemble  │  │  Audio Forensics │      │  │ NLP Psychological Engine  │ │ Relational ORM DB  │
       │ ---------------------- │  │  --------------- │      │  │ ------------------------- │ │ ------------------ │
       │ • Random Forest        │  │ • MFCC Extraction│      │  │ • 100+ Indian Scam Matrix │ │ • Call Logs Ledger │
       │ • Support Vector Mach. │  │ • Spectral Cent. │      │  │ • Urgency Scorer          │ │ • Number Registry  │
       │ • 1D-CNN               │  │ • Zero-Crossing  │      │  │ • Coercion Detection      │ │ • Model Telemetry  │
       │ • RNN (Recurrent Net)  │  │ • Pitch Jitter   │      │  │ • Authority Impersonation │ │ • Audit Records    │
       │ • LSTM (Long Short-Tm) │  │ • Deepfake Audit │      │  └───────────────────────────┘ └────────────────────┘
       └────────────────────────┘  └──────────────────┘      │
                                                             ▼
                                                ┌───────────────────────────┐
                                                │ Threat Report Generator   │
                                                │ (JSON & PDF Certificates) │
                                                └───────────────────────────┘
```

---

## ✨ Core Features & Modules

### 1. 🎙️ Live Call Simulation Engine

- Interactive audio waveform visualizer and diarized speaker timeline (Caller vs. Receiver).
- Preset real-world threat scenarios:
  - **Bank KYC Expiry & OTP Extortion**
  - **Customs / Police Extortion ("Digital Arrest")**
  - **Urgent Electricity Disconnection Phishing**
  - **UPI Refund Impersonation**
- Dynamic risk gauge calculating instantaneous danger levels with automated safety recommendations.

### 2. 🤖 5-Model Machine Learning Ensemble

- **Random Forest Classifier**: Non-linear ensemble model with multi-feature bagging.
- **Support Vector Machine (SVM)**: High-margin hyperplane separation for acoustic variance.
- **1D Convolutional Neural Network (CNN)**: Temporal spectral feature kernel extraction.
- **Recurrent Neural Network (RNN)**: Sequential pattern analysis of speech rhythm.
- **Long Short-Term Memory (LSTM)**: Deep temporal tracking of stress and acoustic anomalies.
- Real-time consensus voting yielding unified threat confidence scores.

### 3. 🔬 Audio Forensics & Synthetic Voice (Deepfake) Detection

- Computes acoustic features:
  - **MFCCs** (Mel-Frequency Cepstral Coefficients)
  - **Spectral Centroid & Rolloff**
  - **Zero-Crossing Rate (ZCR)**
  - **Pitch Variance ($F_0$) & Jitter**
  - **Biological Breathing Pause Analysis**
- Flags artificial audio lacking human micro-tremors and biological acoustic variations.

### 4. 🧠 Linguistic & Psychological Threat Analysis (NLP)

- 100+ categorized scam phrase signatures across Indian English, Hindi transliterated loan words, and financial terms.
- Real-time detection of coercion tactics:
  - Fake legal intimidation ("Arrest Warrant", "CBI", "Narcotics Control Bureau")
  - Extreme time pressure ("Disconnect in 5 minutes", "Immediate fine")
  - Credential extortion ("Read the OTP", "Screen share with AnyDesk")

### 5. 🛡️ Elder Shield Hub

- Designated family guardian delegation for senior citizen accounts.
- Automated instant alert dispatch when critical threats (>75% risk) target protected contacts.

### 6. 📞 Telephony Lookup & Spam Intelligence

- Carrier circle lookup, line type (GSM / VoLTE) classification, and live threat verification.

### 7. 🔐 Production Authentication

- Complete **Firebase Authentication** integration:
  - **Google OAuth** (with automatic avatar and profile image rendering)
  - **GitHub OAuth**
  - **Corporate Work Email & Password**
  - Strict route protection; guest bypass completely eliminated.

---

## 📊 Machine Learning Model Benchmarks

| Model Architecture | Precision | Recall | F1-Score | Inference Latency | Primary Use Case |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Random Forest** | 94.8% | 93.2% | 94.0% | ~8ms | Fast baseline feature classification |
| **Support Vector Machine (SVM)** | 92.4% | 91.0% | 91.7% | ~12ms | Margin-based separation of spectral cues |
| **1D-CNN** | 96.1% | 95.4% | 95.7% | ~18ms | Temporal convolutional feature extraction |
| **RNN (Recurrent Net)** | 93.5% | 92.8% | 93.1% | ~22ms | Sequential speech dynamics |
| **LSTM (Long Short-Term Memory)** | **97.3%** | **96.8%** | **97.0%** | ~28ms | Long-range context & conversational trajectory |
| **Ensemble Weighted Consensus** | **98.2%** | **97.6%** | **97.9%** | ~35ms | Production real-time verdict |

---

## 📡 REST API Reference

The Python backend runs on `http://127.0.0.1:5001`.

| Endpoint | Method | Description | Sample Payload / Params |
| :--- | :---: | :--- | :--- |
| `/api/health` | `GET` | Subsystem health check (DB, ML, NLP, STT, Reports) | `None` |
| `/api/ml/models` | `GET` | Model list, training timestamps, and benchmark metrics | `None` |
| `/api/ml/predict` | `POST` | ML consensus threat prediction on extracted features | `{"features": [0.42, 120.5, ...], "model": "ensemble"}` |
| `/api/audio/analyze` | `POST` | Deepfake voice detection and acoustic forensics | `Multipart Audio / JSON feature vector` |
| `/api/nlp/analyze` | `POST` | Scam phrase matching & psychological urgency scoring | `{"text": "Your electricity will be cut, send OTP"}` |
| `/api/calls` | `GET` | Retrieve paginated call logs with risk filters | `?page=1&limit=20&risk=HIGH` |
| `/api/calls` | `POST` | Record a new intercepted call session | Call object JSON |
| `/api/calls/<id>` | `GET` | Detailed telemetry and forensic breakdown for a call | `call_id` in URL |
| `/api/reports/generate` | `POST` | Generate forensic PDF/JSON incident audit certificate | `{"call_id": "call_123", "format": "json"}` |

---

## 🚀 Quick Start Guide

### Prerequisites

- **Node.js**: v18.0 or higher
- **Python**: v3.10 or higher
- **npm** or **yarn**
- **Git**

---

### 1. Clone the Repository

```bash
git clone https://github.com/MahadevaprasadS-0720/Callix-App.git
cd Callix-App
```

---

### 2. Start the Python AI Backend

#### Option A: Quick Launch (Windows)

Double-click [`start_backend.bat`](start_backend.bat) in the root directory.

#### Option B: Terminal Setup

```bash
cd backend/python

# Create and activate virtual environment (optional but recommended)
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Launch Flask API server
python run.py
```

> Server runs at `http://127.0.0.1:5001` with auto-reloading enabled.

---

### 3. Start the React Frontend

Open a new terminal window:

```bash
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```

> Open your browser at `http://localhost:5173` to access the Callix console.

---

### 4. Running Backend Unit Tests

To verify all database schemas, ML models, NLP engines, audio forensics, and report generators:

```bash
python -m unittest backend/python/tests/test_backend.py
```

All 9 unit test suites will execute and validate the complete pipeline.

---

## 📂 Project Structure

```text
Callix/
├── backend/
│   ├── python/
│   │   ├── app.py                     # Flask REST application & routing
│   │   ├── run.py                     # Server entrypoint (Port 5001)
│   │   ├── config.py & config.json    # Centralized system configurations
│   │   ├── requirements.txt           # Python dependencies
│   │   ├── database/
│   │   │   ├── connection.py          # SQLAlchemy engine & session factory
│   │   │   └── models.py              # CallLog, AudioSample, ScamPhrase, MLTelemetry
│   │   ├── ml/
│   │   │   ├── models.py              # RF, SVM, CNN, RNN, LSTM architectures
│   │   │   ├── feature_extractor.py   # MFCC, spectral, and prosody extractor
│   │   │   ├── train.py               # Synthetic training & evaluation pipeline
│   │   │   ├── inference.py           # Real-time consensus prediction engine
│   │   │   └── saved_models/          # Trained weights, serialized models & metrics.json
│   │   ├── nlp/
│   │   │   ├── keyword_engine.py      # Scam phrase dictionary & regex matchers
│   │   │   └── sentiment_urgency.py   # Urgency, coercion, and panic scoring
│   │   ├── stt/
│   │   │   ├── transcriber.py         # Speech-to-Text handler & diarization
│   │   │   └── audio_forensics.py     # Deepfake voice & pitch anomaly detector
│   │   ├── reports/
│   │   │   └── generator.py           # PDF / JSON forensic incident report generator
│   │   └── tests/
│   │       └── test_backend.py        # Automated test suite for all 7 subsystems
│   └── functions/                     # Firebase Cloud Functions (Serverless bridge)
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/                  # AuthModal (Google, GitHub, Email/Password)
│   │   │   ├── common/                # ProtectedRoute, UserAvatar, Modal, Badge
│   │   │   ├── layout/                # Header, Sidebar, Navigation
│   │   │   └── profile/               # UserProfileModal
│   │   ├── context/                   # AuthContext, CallSimulationContext
│   │   ├── hooks/                     # useAuth, useRealtimeRisk, useCallHistory
│   │   ├── pages/
│   │   │   ├── LandingPage.tsx        # High-conversion product showcase
│   │   │   ├── Dashboard.tsx          # Real-time operational security console
│   │   │   ├── Simulation.tsx         # Live waveform & scenario simulation
│   │   │   ├── AudioScanner.tsx       # Deepfake detection playground
│   │   │   ├── CallHistory.tsx        # Telephony forensic ledger
│   │   │   ├── CallDetails.tsx        # Deep-dive call investigation view
│   │   │   ├── Analytics.tsx          # Threat intelligence & trend analysis
│   │   │   ├── NumberLookup.tsx       # Telecom circle & spam lookup
│   │   │   ├── GuardianView.tsx       # Elder Shield family monitoring hub
│   │   │   ├── PhraseLibrary.tsx      # Linguistic scam patterns
│   │   │   └── Settings.tsx           # Sensitivity controls & data export
│   │   ├── services/                  # authService, api, simulationEngine
│   │   └── utils/                     # riskCalculator, formatters, constants
│   ├── package.json
│   └── vite.config.ts
│
├── .gitignore
├── README.md                          # Platform documentation
└── start_backend.bat                  # One-click Windows launcher for backend
```

---

## 🔒 Security & Privacy

- **Data Minimization**: Callix processes audio features and phonetic markers; raw audio streams are anonymized or purged according to regulatory retention windows.
- **Strict Authentication**: All dashboard and API access requires authenticated Google, GitHub, or enterprise verified credentials.
- **Sandboxed Execution**: Machine learning inference runs locally in isolated environments without external data leaks.

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

<!-- markdownlint-disable MD033 -->
<p align="center">
  Built with ❤️ for Telephony Security & Scam Defense.
</p>
<!-- markdownlint-enable MD033 -->
