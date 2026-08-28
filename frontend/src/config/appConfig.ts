export const appConfig = {
  appName: 'Audio Guardian',
  tagline: 'AI-Powered Voice Scam & Fraud Call Detection Platform',
  version: '1.0.0',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/audio-guardian-dev/us-central1',
  isSimulationMode: import.meta.env.VITE_ENABLE_SIMULATION_MODE === 'true' || true,
  defaultThresholds: {
    highRisk: 75,
    suspicious: 40,
  },
};
