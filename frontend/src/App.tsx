import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CallSimulationProvider } from './context/CallSimulationContext';
import { ToastProvider } from './context/ToastContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { Loader } from './components/common/Loader';

// Lazy-loaded route components for optimal production bundle splitting
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const Simulation = lazy(() => import('./pages/Simulation').then(m => ({ default: m.Simulation })));
const AudioScanner = lazy(() => import('./pages/AudioScanner').then(m => ({ default: m.AudioScanner })));
const CallHistory = lazy(() => import('./pages/CallHistory').then(m => ({ default: m.CallHistory })));
const CallDetails = lazy(() => import('./pages/CallDetails').then(m => ({ default: m.CallDetails })));
const Analytics = lazy(() => import('./pages/Analytics').then(m => ({ default: m.Analytics })));
const NumberLookup = lazy(() => import('./pages/NumberLookup').then(m => ({ default: m.NumberLookup })));
const GuardianView = lazy(() => import('./pages/GuardianView').then(m => ({ default: m.GuardianView })));
const PhraseLibrary = lazy(() => import('./pages/PhraseLibrary').then(m => ({ default: m.PhraseLibrary })));
const Settings = lazy(() => import('./pages/Settings').then(m => ({ default: m.Settings })));
const Login = lazy(() => import('./pages/Login').then(m => ({ default: m.Login })));

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CallSimulationProvider>
          <ToastProvider>
            <BrowserRouter>
            <Suspense
              fallback={
                <div className="min-h-screen bg-cyber-bg flex items-center justify-center">
                  <Loader size="lg" text="Initializing Audio Guardian Multimodal Shield..." />
                </div>
              }
            >
              <Routes>
                {/* Public Auth Route */}
                <Route path="/login" element={<Login />} />

                {/* Protected Console Dashboard Routes */}
                <Route path="/" element={<DashboardLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="simulation" element={<Simulation />} />
                  <Route path="scanner" element={<AudioScanner />} />
                  <Route path="audio-scanner" element={<AudioScanner />} />
                  <Route path="calls" element={<CallHistory />} />
                  <Route path="calls/:callId" element={<CallDetails />} />
                  <Route path="analytics" element={<Analytics />} />
                  <Route path="lookup" element={<NumberLookup />} />
                  <Route path="guardian" element={<GuardianView />} />
                  <Route path="phrases" element={<PhraseLibrary />} />
                  <Route path="library" element={<PhraseLibrary />} />
                  <Route path="settings" element={<Settings />} />
                </Route>

                {/* Catch-all redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </ToastProvider>
      </CallSimulationProvider>
    </AuthProvider>
  </ErrorBoundary>
  );
};

export default App;
