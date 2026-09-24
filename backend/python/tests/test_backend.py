import sys
import unittest
import json
import uuid
from pathlib import Path

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(backend_dir))

from python.config import settings
from python.database import (
    init_db, 
    SessionLocal, 
    UserRecord, 
    CallSessionRecord, 
    NumberReputationRecord, 
    ScamPhraseRecord
)
from python.nlp import scam_analyzer, urgency_analyzer
from python.stt import speech_transcriber, audio_forensics_analyzer
from python.ml import (
    feature_extractor,
    train_and_save_all_models,
    ml_engine,
    RandomForestFraudModel,
    SVMFraudModel,
    CNN1DFraudModel,
    RNNFraudModel,
    LSTMFraudModel
)
from python.reports import report_generator
from python.app import app

class TestCallixBackend(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        init_db()
        cls.client = app.test_client()

    def test_01_config_loaded(self):
        """Test JSON configuration and compiler settings"""
        self.assertIsNotNone(settings.PROJECT_NAME)
        self.assertEqual(settings.PROJECT_VERSION, "2.0.0")
        self.assertIn("python_target", settings.COMPILER_SETTINGS)
        self.assertIn("random_forest", settings.ML_MODELS)
        self.assertIn("lstm", settings.ML_MODELS)

    def test_02_database_operations(self):
        """Test SQLAlchemy database seeding and querying"""
        db = SessionLocal()
        try:
            phrase_count = db.query(ScamPhraseRecord).count()
            self.assertGreater(phrase_count, 0)

            rep_count = db.query(NumberReputationRecord).count()
            self.assertGreater(rep_count, 0)

            # Insert test user with unique ID
            import uuid
            unique_uid = f"test_user_{uuid.uuid4().hex[:8]}"
            test_user = UserRecord(
                user_id=unique_uid,
                name="Ramesh Kumar",
                guardian_name="Suresh Kumar",
                guardian_phone="+919876543210"
            )
            db.add(test_user)
            db.commit()

            fetched = db.query(UserRecord).filter(UserRecord.user_id == unique_uid).first()
            self.assertIsNotNone(fetched)
            self.assertEqual(fetched.name, "Ramesh Kumar")
        finally:
            db.close()

    def test_03_nlp_engine(self):
        """Test NLP keyword detection, urgency, and categorization"""
        # Test Digital Arrest Scam
        text_arrest = "Inspector Vijay Rathore from Mumbai Police. A FedEx parcel with MDMA drugs was seized. You are under Digital Arrest. Transfer balance to RBI escrow."
        res_arrest = scam_analyzer.analyze_text(text_arrest)
        self.assertEqual(res_arrest["category"], "DIGITAL_ARREST")
        self.assertGreaterEqual(res_arrest["scamScore"], 85)
        self.assertEqual(res_arrest["verdict"], "Fraudulent")

        # Test OTP Theft
        text_otp = "I sent you a 6-digit OTP verification code. Read out the code immediately."
        res_otp = scam_analyzer.analyze_text(text_otp)
        self.assertEqual(res_otp["category"], "OTP_THEFT")
        self.assertGreaterEqual(res_otp["scamScore"], 85)

        # Test Safe Conversation
        text_safe = "Hello, calling from Max Healthcare to confirm your doctor appointment tomorrow at 11 AM."
        res_safe = scam_analyzer.analyze_text(text_safe)
        self.assertEqual(res_safe["category"], "SAFE")
        self.assertLess(res_safe["scamScore"], 30)

        # Test Urgency Analyzer
        urg = urgency_analyzer.analyze(text_arrest)
        self.assertGreater(urg["urgencyScore"], 40)
        self.assertTrue(urg["authorityImpersonation"])

    def test_04_stt_and_audio_forensics(self):
        """Test Speech-to-Text transcription and deepfake audio forensic analysis"""
        transcription = speech_transcriber.transcribe(file_name="Police_Customs_Digital_Arrest.wav")
        self.assertIn("transcript", transcription)
        self.assertGreater(len(transcription["timeline"]), 0)

        # Forensic analysis of synthetic voice cues
        synthetic_forensics = audio_forensics_analyzer.analyze_audio_data(
            transcript="State Bank Security Division automated officer voice clone."
        )
        self.assertGreater(synthetic_forensics["deepfakeScore"], 70)
        self.assertTrue(synthetic_forensics["deepfakeMarkers"]["breathingAbsence"])

    def test_05_machine_learning_models(self):
        """Test training and inference on all 5 models: RF, SVM, CNN, RNN, LSTM"""
        # 1. Train and save all models
        metrics = train_and_save_all_models()
        self.assertIn("random_forest", metrics)
        self.assertIn("svm", metrics)
        self.assertIn("cnn", metrics)
        self.assertIn("rnn", metrics)
        self.assertIn("lstm", metrics)

        # Verify high accuracy on synthetic dataset
        for m_name in ["random_forest", "svm", "cnn", "rnn", "lstm"]:
            acc = metrics[m_name]["accuracy"]
            self.assertGreaterEqual(acc, 0.80, f"{m_name} accuracy below threshold: {acc}")

        # 2. Test multi-model inference engine
        ml_engine.load_models()
        scam_sample = "State Bank KYC expired. Account blocked. Share 6-digit OTP right now immediately!"
        
        # Test individual models
        rf_pred = ml_engine.predict(scam_sample, model_type="random_forest")
        self.assertGreaterEqual(rf_pred["finalScore"], 50)

        svm_pred = ml_engine.predict(scam_sample, model_type="svm")
        self.assertGreaterEqual(svm_pred["finalScore"], 50)

        cnn_pred = ml_engine.predict(scam_sample, model_type="cnn")
        self.assertGreaterEqual(cnn_pred["finalScore"], 50)

        rnn_pred = ml_engine.predict(scam_sample, model_type="rnn")
        self.assertGreaterEqual(rnn_pred["finalScore"], 50)

        lstm_pred = ml_engine.predict(scam_sample, model_type="lstm")
        self.assertGreaterEqual(lstm_pred["finalScore"], 50)

        # Test Ensemble
        ensemble_pred = ml_engine.predict(scam_sample, model_type="ensemble")
        self.assertEqual(ensemble_pred["verdict"], "Fraudulent")
        self.assertIn("random_forest", ensemble_pred["modelVotes"])
        self.assertIn("lstm", ensemble_pred["modelVotes"])

    def test_06_report_generation(self):
        """Test HTML and JSON report generator"""
        sample_report = {
            "scanId": "scan_test_999",
            "fileName": "Test_Call.wav",
            "scamScore": 95,
            "deepfakeScore": 88,
            "overallVerdict": "High Risk Scam / AI Voice Clone",
            "confidence": 0.98,
            "scamCategory": "OTP_THEFT",
            "forensicHighlights": ["Acoustic Prosody: Unnatural pitch stability"],
            "safetyRecommendations": ["Never share OTP"],
            "deepfakeMarkers": {"prosodyUnnaturalness": 88, "breathingAbsence": True},
            "transcriptTimeline": [
                {"time": "00:02", "speaker": "Caller", "text": "Give me OTP", "riskLevel": "danger"}
            ]
        }
        html = report_generator.generate_html_report(sample_report)
        self.assertIn("Audio Guardian Forensic Report", html)
        self.assertIn("High Risk Scam", html)
        self.assertIn("1930", html)

    def test_07_api_endpoints(self):
        """Test all Flask REST endpoints and dual routes matching frontend expectations"""
        # 1. Health check
        res = self.client.get("/api/health")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json["status"], "online")

        # 2. Analyze Audio File
        res = self.client.post("/analyzeAudioFile", json={
            "fileName": "Police_Customs_Digital_Arrest.wav",
            "clientTranscript": "Inspector Vijay Rathore. MDMA seized. Transfer money to RBI escrow."
        })
        self.assertEqual(res.status_code, 200)
        self.assertIn("report", res.json)
        self.assertGreaterEqual(res.json["report"]["scamScore"], 75)

        # Also test Firebase prefixed path
        res_fb = self.client.post("/audio-guardian-dev/us-central1/analyzeAudioFile", json={
            "fileName": "Doctor_Appointment.mp3",
            "clientTranscript": "Hello, confirming your doctor appointment with Dr. Kapoor tomorrow at 11 AM."
        })
        self.assertEqual(res_fb.status_code, 200)
        self.assertIn("report", res_fb.json)
        self.assertLess(res_fb.json["report"]["scamScore"], 30)

        test_call_id = f"call_unit_{uuid.uuid4().hex[:6]}"
        # 3. Create Call Session
        res = self.client.post("/createCallSession", json={
            "callId": test_call_id,
            "userId": "user_unit_test",
            "callerNumber": "+919876543210"
        })
        self.assertEqual(res.status_code, 200)
        self.assertTrue(res.json["success"])

        # 4. Analyze Live Transcript
        res = self.client.post("/analyzeLiveTranscript", json={
            "callId": test_call_id,
            "userId": "user_unit_test",
            "callerNumber": "+919876543210",
            "textSegment": "Your KYC expired. Account blocked. Share 6-digit OTP."
        })
        self.assertEqual(res.status_code, 200)
        self.assertIn("decision", res.json)
        self.assertGreaterEqual(res.json["decision"]["finalScore"], 75)
        self.assertTrue(res.json["decision"]["requiresGuardianAlert"])

        # 5. Lookup Phone Number
        res = self.client.get("/lookupPhoneNumber?phone=+919876543210")
        self.assertEqual(res.status_code, 200)
        self.assertIn("data", res.json)
        self.assertEqual(res.json["data"]["phoneNumber"], "+919876543210")

        # 6. Report Fraud Number
        res = self.client.post("/reportFraudNumber", json={
            "phoneNumber": "+919111222333",
            "category": "KYC_EXPIRY",
            "description": "Fake bank officer calling"
        })
        self.assertEqual(res.status_code, 200)
        self.assertTrue(res.json["success"])

        # 7. Get Scam Phrase Library
        res = self.client.get("/getScamPhraseLibrary")
        self.assertEqual(res.status_code, 200)
        self.assertIn("data", res.json)
        self.assertGreater(len(res.json["data"]), 0)

        # 8. ML Models API
        res = self.client.get("/api/ml/models")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(len(res.json["activeModels"]), 6)

        # 9. Database Stats API
        res = self.client.get("/api/database/stats")
        self.assertEqual(res.status_code, 200)
        self.assertIn("callSessionsCount", res.json)

    def test_firebase_admin_integration(self):
        """Test Firebase Admin SDK, Auth, and Firestore db initialization."""
        import firebase_admin
        from python.app import db, auth, firestore_db, firebase_auth

        # Verify SDK app initialization
        self.assertTrue(len(firebase_admin._apps) > 0)
        self.assertIsNotNone(db)
        self.assertIsNotNone(auth)
        self.assertEqual(db, firestore_db)
        self.assertEqual(auth, firebase_auth)

        # Verify Firebase status endpoint
        res = self.client.get("/api/firebase/status")
        self.assertEqual(res.status_code, 200)
        self.assertTrue(res.json["initialized"])
        self.assertTrue(res.json["firestoreReady"])
        self.assertTrue(res.json["authReady"])
        self.assertEqual(res.json["credentialsLoaded"], "serviceAccountKey.json")

        # Verify Health endpoint reports operational subsystems
        health = self.client.get("/api/health")
        self.assertEqual(health.status_code, 200)
        subsystems = health.json.get("subsystems", {})
        self.assertEqual(subsystems.get("firebase_admin"), "operational")
        self.assertEqual(subsystems.get("firestore"), "operational")

    def test_analytics_and_calls_endpoints(self):
        """Test /api/analytics/overview and /api/calls dynamic endpoints."""
        res_analytics = self.client.get("/api/analytics/overview")
        self.assertEqual(res_analytics.status_code, 200)
        self.assertIn("totalCalls", res_analytics.json)
        self.assertIn("scamsIntercepted", res_analytics.json)
        self.assertIn("guardianAlerts", res_analytics.json)

        res_calls = self.client.get("/api/calls")
        self.assertEqual(res_calls.status_code, 200)
        self.assertIn("calls", res_calls.json)
        self.assertIn("count", res_calls.json)

if __name__ == "__main__":
    unittest.main()
