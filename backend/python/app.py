import time
import uuid
import logging
from flask import Flask, request, jsonify, Response
from flask_cors import CORS

from .config import settings
from .database import (
    init_db, 
    SessionLocal, 
    UserRecord, 
    CallSessionRecord, 
    TranscriptSegmentRecord, 
    AudioForensicsRecord, 
    NumberReputationRecord, 
    FraudReportRecord, 
    ScamPhraseRecord, 
    GuardianAlertRecord, 
    AuditLogRecord
)
from .nlp import scam_analyzer, urgency_analyzer
from .stt import speech_transcriber, audio_forensics_analyzer
from .ml import ml_engine, train_and_save_all_models
from .reports import report_generator

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("CallixApp")

# Initialize database schema & seed data
init_db()

app = Flask(__name__)
CORS(app, origins=settings.CORS_ORIGINS)

# Helper function to register dual routes (direct and prefixed)
def dual_route(rule, **options):
    def decorator(f):
        # Register standard route
        app.add_url_rule(rule, f.__name__ + "_direct", f, **options)
        # Register Firebase function path
        firebase_path = f"/audio-guardian-dev/us-central1{rule}"
        app.add_url_rule(firebase_path, f.__name__ + "_firebase", f, **options)
        # Register /api prefix
        api_path = f"/api{rule}"
        app.add_url_rule(api_path, f.__name__ + "_api", f, **options)
        return f
    return decorator

# --------------------------------------------------------------------------
# 1. Analyze Audio File (Forensics + Deepfake + Scam Detection)
# --------------------------------------------------------------------------
@dual_route("/analyzeAudioFile", methods=["POST"])
def analyze_audio_file():
    payload = request.get_json(silent=True) or {}
    file_name = payload.get("fileName", "recorded_audio.wav")
    preset_id = payload.get("presetId")
    audio_base64 = payload.get("audioBase64")
    client_transcript = payload.get("clientTranscript")
    duration = payload.get("durationSeconds", 20)
    file_size_formatted = payload.get("fileSizeFormatted", "1.2 MB")

    audio_bytes = None
    if audio_base64:
        try:
            audio_bytes = speech_transcriber.decode_base64_audio(audio_base64)
            meta = speech_transcriber.extract_metadata(audio_bytes)
            duration = meta.get("durationSeconds", duration)
            file_size_formatted = meta.get("fileSizeFormatted", file_size_formatted)
        except Exception as e:
            logger.warning(f"Error decoding audio base64: {e}")

    # Speech-to-Text Transcription
    stt_result = speech_transcriber.transcribe(
        audio_bytes=audio_bytes, 
        client_transcript=client_transcript, 
        file_name=file_name
    )
    transcript = stt_result["transcript"]
    timeline = stt_result["timeline"]

    # Audio Forensics (Deepfake & Acoustic Prosody)
    audio_forensics = audio_forensics_analyzer.analyze_audio_data(
        audio_bytes=audio_bytes,
        duration_seconds=duration,
        transcript=transcript
    )

    # NLP Semantic Keyword & Urgency Analysis
    nlp_result = scam_analyzer.analyze_text(transcript)
    urgency_result = urgency_analyzer.analyze(transcript)

    # ML 5-Model Multi-Classifier Prediction
    ml_result = ml_engine.predict(
        text=transcript,
        audio_features=audio_forensics,
        model_type="ensemble"
    )

    # Composite Risk Calculation
    nlp_score = nlp_result["scamScore"]
    ml_score = ml_result["finalScore"]
    final_scam_score = max(nlp_score, ml_score)
    deepfake_score = audio_forensics["deepfakeScore"]

    # Overall Verdict
    if final_scam_score >= 75 or deepfake_score >= 75:
        verdict = "High Risk Scam / AI Voice Clone" if deepfake_score >= 60 else "High Risk Scam"
    elif final_scam_score >= 40:
        verdict = "Suspicious Call"
    else:
        verdict = "Legitimate / Human"

    scan_id = f"scan_{int(time.time())}_{uuid.uuid4().hex[:6]}"

    report_dict = {
        "scanId": scan_id,
        "fileName": file_name,
        "fileSizeFormatted": file_size_formatted,
        "scamScore": final_scam_score,
        "deepfakeScore": deepfake_score,
        "overallVerdict": verdict,
        "confidence": ml_result["confidence"],
        "speakerCount": stt_result["speakerCount"],
        "durationSeconds": duration,
        "scamCategory": nlp_result["category"],
        "flaggedKeywords": nlp_result["triggerPhrases"],
        "forensicHighlights": audio_forensics["forensicHighlights"],
        "safetyRecommendations": audio_forensics["safetyRecommendations"],
        "deepfakeMarkers": audio_forensics["deepfakeMarkers"],
        "transcriptTimeline": timeline,
        "mlModelVotes": ml_result["modelVotes"],
        "createdAt": int(time.time() * 1000)
    }

    # Persist report to Database
    db = SessionLocal()
    try:
        record = AudioForensicsRecord(
            scan_id=scan_id,
            file_name=file_name,
            file_size_formatted=file_size_formatted,
            duration_seconds=duration,
            speaker_count=stt_result["speakerCount"],
            scam_score=final_scam_score,
            deepfake_score=deepfake_score,
            overall_verdict=verdict,
            confidence=ml_result["confidence"],
            scam_category=nlp_result["category"],
            flagged_keywords=nlp_result["triggerPhrases"],
            forensic_highlights=audio_forensics["forensicHighlights"],
            safety_recommendations=audio_forensics["safetyRecommendations"],
            deepfake_markers=audio_forensics["deepfakeMarkers"],
            transcript_timeline=timeline
        )
        db.add(record)
        db.commit()
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to save audio forensics record: {e}")
    finally:
        db.close()

    return jsonify({"report": report_dict})

# --------------------------------------------------------------------------
# 2. Create Call Session
# --------------------------------------------------------------------------
@dual_route("/createCallSession", methods=["POST"])
def create_call_session():
    payload = request.get_json(silent=True) or {}
    call_id = payload.get("callId", f"call_{uuid.uuid4().hex[:10]}")
    user_id = payload.get("userId", "user_default")
    caller_number = payload.get("callerNumber", "+910000000000")
    caller_name = payload.get("callerName", "Unknown Caller")

    db = SessionLocal()
    try:
        session = CallSessionRecord(
            call_id=call_id,
            user_id=user_id,
            caller_number=caller_number,
            caller_name=caller_name,
            status="IN_PROGRESS"
        )
        db.add(session)
        db.commit()
    except Exception as e:
        db.rollback()
        logger.error(f"Error creating call session: {e}")
    finally:
        db.close()

    return jsonify({"success": True, "callId": call_id})

# --------------------------------------------------------------------------
# 3. Analyze Live Transcript (Real-time Streamed Chunk Analysis)
# --------------------------------------------------------------------------
@dual_route("/analyzeLiveTranscript", methods=["POST"])
def analyze_live_transcript():
    payload = request.get_json(silent=True) or {}
    call_id = payload.get("callId", "default_call")
    user_id = payload.get("userId", "default_user")
    caller_number = payload.get("callerNumber", "")
    text_segment = payload.get("textSegment", "")
    history = payload.get("fullTranscriptHistory", "")
    offset = payload.get("timestampOffset", 0)

    combined_text = f"{history} {text_segment}".strip()

    # NLP Semantic analysis
    nlp_res = scam_analyzer.analyze_text(combined_text)
    # ML 5-model analysis
    ml_res = ml_engine.predict(combined_text, model_type="ensemble")

    final_score = max(nlp_res["scamScore"], ml_res["finalScore"])
    category = nlp_res["category"]
    trigger_phrases = nlp_res["triggerPhrases"]
    explanation = nlp_res["explanation"]
    verdict = "Fraudulent" if final_score >= 75 else "Suspicious" if final_score >= 40 else "Legitimate"
    requires_guardian = (final_score >= 75)

    # Save to Database
    db = SessionLocal()
    try:
        # Save transcript segment
        seg = TranscriptSegmentRecord(
            call_id=call_id,
            speaker="Caller",
            timestamp_offset=offset,
            time_display=f"{offset//60:02d}:{offset%60:02d}",
            text=text_segment,
            risk_level="danger" if final_score >= 75 else "warning" if final_score >= 40 else "safe",
            detected_vectors=nlp_res.get("matchedVectors", [])
        )
        db.add(seg)

        # Update Call Session
        session = db.query(CallSessionRecord).filter(CallSessionRecord.call_id == call_id).first()
        if session:
            session.final_score = max(session.final_score, final_score)
            session.verdict = verdict
            session.scam_category = category
            session.requires_guardian_alert = requires_guardian
            session.transcript_text = combined_text

        # If high risk and guardian alert required, log guardian alert
        if requires_guardian:
            user = db.query(UserRecord).filter(UserRecord.user_id == user_id).first()
            guardian_phone = user.guardian_phone if user else "+919876543210"
            alert = GuardianAlertRecord(
                alert_id=f"alert_{uuid.uuid4().hex[:8]}",
                call_id=call_id,
                user_id=user_id,
                guardian_phone=guardian_phone,
                scam_score=final_score,
                category=category,
                message=f"CRITICAL ALERT: Callix detected {category} with score {final_score}/100. Intercept suggested.",
                status="DISPATCHED"
            )
            db.add(alert)

        db.commit()
    except Exception as e:
        db.rollback()
        logger.error(f"Error handling live transcript: {e}")
    finally:
        db.close()

    return jsonify({
        "callId": call_id,
        "decision": {
            "finalScore": final_score,
            "verdict": verdict,
            "claudeScore": final_score,
            "heuristicBoost": 0,
            "blocklistTriggered": False,
            "category": category,
            "triggerPhrases": trigger_phrases,
            "explanation": explanation,
            "requiresGuardianAlert": requires_guardian,
            "matchedRules": trigger_phrases,
            "mlModelVotes": ml_res["modelVotes"]
        }
    })

# --------------------------------------------------------------------------
# 4. End Call Session
# --------------------------------------------------------------------------
@dual_route("/endCallSession", methods=["POST"])
def end_call_session():
    payload = request.get_json(silent=True) or {}
    call_id = payload.get("callId")
    duration = payload.get("durationSeconds", 0)
    status = payload.get("status", "COMPLETED")

    db = SessionLocal()
    try:
        session = db.query(CallSessionRecord).filter(CallSessionRecord.call_id == call_id).first()
        if session:
            session.duration_seconds = duration
            session.status = status
            session.end_time = int(time.time() * 1000)
            db.commit()
    except Exception as e:
        db.rollback()
        logger.error(f"Error ending call session: {e}")
    finally:
        db.close()

    return jsonify({"success": True})

# --------------------------------------------------------------------------
# 5. Lookup Phone Number Reputation
# --------------------------------------------------------------------------
@dual_route("/lookupPhoneNumber", methods=["GET", "POST"])
def lookup_phone_number():
    phone = request.args.get("phone")
    if not phone and request.is_json:
        phone = request.json.get("phone")
    if not phone:
        phone = "+919876543210"

    # URL query strings decode '+' to space ' '
    phone = phone.strip()
    digits_only = "".join([c for c in phone if c.isdigit()])
    with_plus = f"+{digits_only}"

    db = SessionLocal()
    try:
        record = db.query(NumberReputationRecord).filter(
            (NumberReputationRecord.phone_number == with_plus) |
            (NumberReputationRecord.phone_number == digits_only)
        ).first()

        if record:
            return jsonify({"data": record.to_dict()})
        
        # If not present in DB, generate baseline reputation
        new_rep = NumberReputationRecord(
            phone_number=with_plus,
            reputation_score=15,
            total_reports=0,
            last_reported_category="SAFE",
            caller_name_suggestion="Unknown Caller",
            carrier="Telecom Carrier",
            location="India",
            tags=["No Prior Reports"],
            is_blacklisted=False
        )
        db.add(new_rep)
        db.commit()
        return jsonify({"data": new_rep.to_dict()})
    finally:
        db.close()

# --------------------------------------------------------------------------
# 6. Report Fraud Number
# --------------------------------------------------------------------------
@dual_route("/reportFraudNumber", methods=["POST"])
def report_fraud_number():
    payload = request.get_json(silent=True) or {}
    raw_phone = payload.get("phoneNumber", "").strip()
    digits_only = "".join([c for c in raw_phone if c.isdigit()])
    phone = f"+{digits_only}" if digits_only else "+919999999999"
    category = payload.get("category", "SCAM")
    desc = payload.get("description", "")
    tags = payload.get("tags", ["Scam Reported"])

    db = SessionLocal()
    try:
        # Add report
        report = FraudReportRecord(
            phone_number=phone,
            category=category,
            description=desc,
            tags=tags
        )
        db.add(report)

        # Update or create NumberReputationRecord
        rep = db.query(NumberReputationRecord).filter(
            (NumberReputationRecord.phone_number == phone) |
            (NumberReputationRecord.phone_number == digits_only)
        ).first()
        if rep:
            rep.total_reports += 1
            rep.reputation_score = min(99, rep.reputation_score + 25)
            rep.last_reported_category = category
            if rep.total_reports >= 3:
                rep.is_blacklisted = True
        else:
            rep = NumberReputationRecord(
                phone_number=phone,
                reputation_score=75,
                total_reports=1,
                last_reported_category=category,
                caller_name_suggestion="Reported Scam Number",
                carrier="Telecom Carrier",
                location="India",
                tags=tags,
                is_blacklisted=False
            )
            db.add(rep)
        db.commit()
    except Exception as e:
        db.rollback()
        logger.error(f"Error reporting fraud number: {e}")
    finally:
        db.close()

    return jsonify({"success": True})

# --------------------------------------------------------------------------
# 7. Get Scam Phrase Library
# --------------------------------------------------------------------------
@dual_route("/getScamPhraseLibrary", methods=["GET"])
def get_scam_phrase_library():
    db = SessionLocal()
    try:
        phrases = db.query(ScamPhraseRecord).all()
        return jsonify({"data": [p.to_dict() for p in phrases]})
    finally:
        db.close()

# --------------------------------------------------------------------------
# 8. Register Guardian & List Alerts
# --------------------------------------------------------------------------
@dual_route("/registerGuardian", methods=["POST"])
def register_guardian():
    payload = request.get_json(silent=True) or {}
    user_id = payload.get("userId", "default_user")
    name = payload.get("name", "User")
    guardian_name = payload.get("guardianName", "Family Guardian")
    guardian_phone = payload.get("guardianPhone", "+919876543210")
    relationship = payload.get("relationship", "Parent")

    db = SessionLocal()
    try:
        user = db.query(UserRecord).filter(UserRecord.user_id == user_id).first()
        if not user:
            user = UserRecord(
                user_id=user_id,
                name=name,
                guardian_name=guardian_name,
                guardian_phone=guardian_phone,
                guardian_relationship=relationship
            )
            db.add(user)
        else:
            user.guardian_name = guardian_name
            user.guardian_phone = guardian_phone
            user.guardian_relationship = relationship
        db.commit()
        return jsonify({"success": True, "guardian": user.to_dict()})
    finally:
        db.close()

@dual_route("/listGuardianAlerts", methods=["GET"])
def list_guardian_alerts():
    user_id = request.args.get("userId")
    db = SessionLocal()
    try:
        query = db.query(GuardianAlertRecord)
        if user_id:
            query = query.filter(GuardianAlertRecord.user_id == user_id)
        alerts = query.order_by(GuardianAlertRecord.created_at.desc()).limit(50).all()
        return jsonify({"alerts": [a.to_dict() for a in alerts]})
    finally:
        db.close()

# --------------------------------------------------------------------------
# 9. Machine Learning Management APIs (All 5 Models)
# --------------------------------------------------------------------------
@app.route("/api/ml/models", methods=["GET"])
def get_ml_models():
    """Returns active status and metadata for Random Forest, SVM, CNN, RNN, and LSTM."""
    return jsonify(ml_engine.get_models_info())

@app.route("/api/ml/predict", methods=["POST"])
def predict_ml():
    """Runs prediction on text with a specified model (rf, svm, cnn, rnn, lstm, or ensemble)."""
    payload = request.get_json(silent=True) or {}
    text = payload.get("text", "")
    model_type = payload.get("modelType", "ensemble")
    rep_score = payload.get("callerReputationScore", 0.0)
    audio_feats = payload.get("audioFeatures")

    res = ml_engine.predict(text, audio_features=audio_feats, caller_reputation_score=rep_score, model_type=model_type)
    return jsonify(res)

@app.route("/api/ml/train", methods=["POST"])
def train_ml():
    """Triggers retraining of all 5 models and returns benchmark metrics."""
    metrics = train_and_save_all_models()
    ml_engine.load_models()
    return jsonify({"success": True, "benchmarkMetrics": metrics})

@app.route("/api/ml/metrics", methods=["GET"])
def get_ml_metrics():
    """Returns benchmark accuracy, precision, recall, and F1 metrics."""
    info = ml_engine.get_models_info()
    return jsonify(info.get("benchmarkMetrics", {}))

# --------------------------------------------------------------------------
# 10. Speech-to-Text & Forensics Direct Endpoint
# --------------------------------------------------------------------------
@app.route("/api/stt/transcribe", methods=["POST"])
def transcribe_audio():
    payload = request.get_json(silent=True) or {}
    audio_base64 = payload.get("audioBase64")
    file_name = payload.get("fileName", "audio.wav")
    audio_bytes = None
    if audio_base64:
        audio_bytes = speech_transcriber.decode_base64_audio(audio_base64)
    result = speech_transcriber.transcribe(audio_bytes=audio_bytes, file_name=file_name)
    return jsonify(result)

# --------------------------------------------------------------------------
# 11. Report Generation API
# --------------------------------------------------------------------------
@app.route("/api/reports/generate", methods=["POST"])
def generate_report():
    payload = request.get_json(silent=True) or {}
    report_data = payload.get("reportData", payload)
    html_content = report_generator.generate_html_report(report_data)
    scan_id = report_data.get("scanId", f"scan_{int(time.time())}")
    return jsonify({
        "success": True,
        "scanId": scan_id,
        "htmlReportUrl": f"/api/reports/{scan_id}/html",
        "htmlContent": html_content
    })

@app.route("/api/reports/<scan_id>/html", methods=["GET"])
def view_html_report(scan_id):
    db = SessionLocal()
    try:
        record = db.query(AudioForensicsRecord).filter(AudioForensicsRecord.scan_id == scan_id).first()
        if record:
            html = report_generator.generate_html_report(record.to_dict())
            return Response(html, mimetype="text/html")
        return Response("<h1>Report not found</h1>", status=404, mimetype="text/html")
    finally:
        db.close()

# --------------------------------------------------------------------------
# 12. Health Check & Database Stats
# --------------------------------------------------------------------------
@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "online",
        "project": settings.PROJECT_NAME,
        "version": settings.PROJECT_VERSION,
        "subsystems": {
            "database": "operational",
            "ml_models": ["Random Forest", "SVM", "1D-CNN", "RNN", "LSTM"],
            "nlp_engine": "operational",
            "stt_engine": "operational",
            "report_generator": "operational"
        },
        "timestamp": int(time.time() * 1000)
    })

@app.route("/api/database/stats", methods=["GET"])
def database_stats():
    db = SessionLocal()
    try:
        stats = {
            "callSessionsCount": db.query(CallSessionRecord).count(),
            "audioReportsCount": db.query(AudioForensicsRecord).count(),
            "numberReputationsCount": db.query(NumberReputationRecord).count(),
            "fraudReportsCount": db.query(FraudReportRecord).count(),
            "scamPhrasesCount": db.query(ScamPhraseRecord).count(),
            "guardianAlertsCount": db.query(GuardianAlertRecord).count(),
        }
        return jsonify(stats)
    finally:
        db.close()

if __name__ == "__main__":
    app.run(host=settings.HOST, port=settings.PORT, debug=settings.DEBUG)
