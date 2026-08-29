import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: "AIzaSyAfXwbPG7Gr6eMpQuDxHvZMuX8wuvRMjW0",
  authDomain: "callix-app-9f1db.firebaseapp.com",
  projectId: "callix-app-9f1db",
  storageBucket: "callix-app-9f1db.firebasestorage.app",
  messagingSenderId: "96759030535",
  appId: "1:96759030535:web:c7a5e9564613945f451ba2",
  measurementId: "G-4XJV5HHC33"
};

const app: FirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

export { app, auth, db };
export default app;
