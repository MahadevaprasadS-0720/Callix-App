# Audio Guardian - AI-Powered Voice Scam & Fraud Call Detection Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-indigo.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-cyan.svg)](https://react.dev/)
[![Deepgram](https://img.shields.io/badge/Speech_to_Text-Deepgram_nova--2-red.svg)](https://deepgram.com/)
[![Anthropic Claude](https://img.shields.io/badge/Fraud_Scoring-Claude_3.5_Sonnet-orange.svg)](https://anthropic.com/)
[![Firebase](https://img.shields.io/badge/Serverless-Firebase_Cloud_Functions-yellow.svg)](https://firebase.google.com/)

**Audio Guardian** is an enterprise-grade AI voice cybersecurity platform designed to detect phone scams, financial fraud, impersonation attacks, and social engineering in real time. It specifically targets high-velocity Indian fraud patterns (such as OTP theft, fake KYC expiry, UPI refund traps, and digital arrest threats).

---

## Architecture Overview

```
Audio-Guardian/
├── frontend/                     # React 18 + TypeScript + Vite + TailwindCSS
│   ├── src/
│   │   ├── components/           # Common, Layout, Dashboard & Call XAI components
│   │   ├── context/              # Auth & Realtime Call Simulation state
│   │   ├── hooks/                # useAuth, useRealtimeRisk, useCallHistory
│   │   ├── pages/                # Dashboard, Simulation, CallDetails, Analytics, etc.
│   │   ├── services/             # Firebase, API & Mock Simulation engines
│   │   ├── types/                # Strict TypeScript schemas
│   │   └── utils/                # Risk calculation, formatters & constants
│   └── vite.config.ts
│
├── backend/                      # Firebase Serverless & AI Orchestration
│   ├── functions/
│   │   ├── src/
│   │   │   ├── controllers/      # Call, Fraud & Guardian API endpoints
│   │   │   ├── prompts/          # Claude 3.5 Sonnet Scam Detection Prompts
│   │   │   ├── rules/            # Heuristic Decision Engine & keyword weights
│   │   │   ├── services/         # Deepgram STT, Claude XAI, Firestore
│   │   │   └── index.ts          # Cloud Functions Triggers
│   │   └── package.json
│   ├── firestore.rules           # Granular RBAC & Guardian delegation rules
│   └── firebase.json
└── README.md
```

---

## Key Features

1. **Real-time Speech Recognition (`en-IN`)**:
   - Integrated with Deepgram `nova-2 en-IN` model for Indian English accents, mixed multilingual phrasing, and diarized audio segments.
2. **Explainable AI (XAI) Fraud Scoring**:
   - Multi-stage evaluation powered by Anthropic Claude 3.5 Sonnet analyzing psychological urgency, authority impersonation, payment redirection, and credential demands.
3. **Multi-Layered Decision Engine**:
   - Combines Claude NLP confidence scores with heuristic phrase matching (e.g. `AnyDesk`, `ScreenShare`, `APK download`, `Digital Arrest`) and crowd-sourced phone number reputation.
4. **Elder & Family Guardian Intercept**:
   - Immediate push/SMS alerts to designated family guardians when high-risk fraud (Score > 75) is detected in real-time.
5. **Interactive Live Call Simulator**:
   - Built-in live simulation engine to test and inspect real-time waveforms, live transcription streams, and instant risk scoring with preset scam scenarios.

---

## Getting Started

### Prerequisites
- Node.js 18+ & npm
- Firebase CLI (`npm install -g firebase-tools`)
- (Optional) Anthropic Claude API Key & Deepgram API Key

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` to explore the dashboard.

### Backend Cloud Functions Setup
```bash
cd backend/functions
npm install
npm run build
```
