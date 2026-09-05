import time
from sqlalchemy import Column, Integer, String, Float, Boolean, Text, JSON, BigInteger
from .connection import Base

class UserRecord(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(String(128), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=True)
    email = Column(String(255), unique=True, index=True, nullable=True)
    phone = Column(String(32), nullable=True)
    guardian_name = Column(String(255), nullable=True)
    guardian_phone = Column(String(32), nullable=True)
    guardian_relationship = Column(String(64), nullable=True)
    alert_channel = Column(String(32), default="sms") # sms, push, whatsapp
    created_at = Column(BigInteger, default=lambda: int(time.time() * 1000))

    def to_dict(self):
        return {
            "userId": self.user_id,
            "name": self.name,
            "email": self.email,
            "phone": self.phone,
            "guardianName": self.guardian_name,
            "guardianPhone": self.guardian_phone,
            "guardianRelationship": self.guardian_relationship,
            "alertChannel": self.alert_channel,
            "createdAt": self.created_at
        }

class CallSessionRecord(Base):
    __tablename__ = "call_sessions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    call_id = Column(String(128), unique=True, index=True, nullable=False)
    user_id = Column(String(128), index=True, nullable=False)
    caller_number = Column(String(32), index=True, nullable=False)
    caller_name = Column(String(255), nullable=True, default="Unknown Caller")
    status = Column(String(32), default="IN_PROGRESS") # IN_PROGRESS, COMPLETED, TERMINATED_BY_SYSTEM
    start_time = Column(BigInteger, default=lambda: int(time.time() * 1000))
    end_time = Column(BigInteger, nullable=True)
    duration_seconds = Column(Integer, default=0)
    final_score = Column(Integer, default=0)
    verdict = Column(String(64), default="Legitimate") # Legitimate, Suspicious, Fraudulent
    scam_category = Column(String(64), default="SAFE")
    claude_score = Column(Integer, default=0)
    heuristic_boost = Column(Integer, default=0)
    requires_guardian_alert = Column(Boolean, default=False)
    transcript_text = Column(Text, nullable=True, default="")

    def to_dict(self):
        return {
            "callId": self.call_id,
            "userId": self.user_id,
            "callerNumber": self.caller_number,
            "callerName": self.caller_name,
            "status": self.status,
            "startTime": self.start_time,
            "endTime": self.end_time,
            "durationSeconds": self.duration_seconds,
            "finalScore": self.final_score,
            "verdict": self.verdict,
            "scamCategory": self.scam_category,
            "requiresGuardianAlert": self.requires_guardian_alert
        }

class TranscriptSegmentRecord(Base):
    __tablename__ = "transcript_segments"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    call_id = Column(String(128), index=True, nullable=False)
    speaker = Column(String(64), default="Caller")
    timestamp_offset = Column(Integer, default=0)
    time_display = Column(String(16), default="00:00")
    text = Column(Text, nullable=False)
    risk_level = Column(String(32), default="safe") # safe, warning, danger
    detected_vectors = Column(JSON, default=list)
    created_at = Column(BigInteger, default=lambda: int(time.time() * 1000))

    def to_dict(self):
        return {
            "speaker": self.speaker,
            "secondsOffset": self.timestamp_offset,
            "time": self.time_display,
            "text": self.text,
            "riskLevel": self.risk_level,
            "detectedVectors": self.detected_vectors or []
        }

class AudioForensicsRecord(Base):
    __tablename__ = "audio_forensics_reports"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    scan_id = Column(String(128), unique=True, index=True, nullable=False)
    file_name = Column(String(255), nullable=False)
    file_size_formatted = Column(String(64), default="1.2 MB")
    duration_seconds = Column(Integer, default=20)
    speaker_count = Column(Integer, default=2)
    scam_score = Column(Integer, default=0)
    deepfake_score = Column(Integer, default=0)
    overall_verdict = Column(String(128), default="Legitimate / Human")
    confidence = Column(Float, default=0.95)
    scam_category = Column(String(64), default="SAFE")
    flagged_keywords = Column(JSON, default=list)
    forensic_highlights = Column(JSON, default=list)
    safety_recommendations = Column(JSON, default=list)
    deepfake_markers = Column(JSON, default=dict)
    transcript_timeline = Column(JSON, default=list)
    created_at = Column(BigInteger, default=lambda: int(time.time() * 1000))

    def to_dict(self):
        return {
            "scanId": self.scan_id,
            "fileName": self.file_name,
            "fileSizeFormatted": self.file_size_formatted,
            "durationSeconds": self.duration_seconds,
            "speakerCount": self.speaker_count,
            "scamScore": self.scam_score,
            "deepfakeScore": self.deepfake_score,
            "overallVerdict": self.overall_verdict,
            "confidence": self.confidence,
            "scamCategory": self.scam_category,
            "flaggedKeywords": self.flagged_keywords or [],
            "forensicHighlights": self.forensic_highlights or [],
            "safetyRecommendations": self.safety_recommendations or [],
            "deepfakeMarkers": self.deepfake_markers or {},
            "transcriptTimeline": self.transcript_timeline or [],
            "createdAt": self.created_at
        }

class NumberReputationRecord(Base):
    __tablename__ = "number_reputations"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    phone_number = Column(String(32), unique=True, index=True, nullable=False)
    reputation_score = Column(Integer, default=15)
    total_reports = Column(Integer, default=0)
    last_reported_category = Column(String(64), default="SAFE")
    caller_name_suggestion = Column(String(255), default="Unknown Caller")
    carrier = Column(String(128), default="Standard Carrier")
    location = Column(String(128), default="India")
    tags = Column(JSON, default=list)
    is_blacklisted = Column(Boolean, default=False)
    community_comments = Column(JSON, default=list)
    updated_at = Column(BigInteger, default=lambda: int(time.time() * 1000))

    def to_dict(self):
        return {
            "phoneNumber": self.phone_number,
            "reputationScore": self.reputation_score,
            "totalReports": self.total_reports,
            "lastReportedCategory": self.last_reported_category,
            "callerNameSuggestion": self.caller_name_suggestion,
            "carrier": self.carrier,
            "location": self.location,
            "tags": self.tags or [],
            "isBlacklisted": self.is_blacklisted,
            "communityComments": self.community_comments or []
        }

class FraudReportRecord(Base):
    __tablename__ = "fraud_reports"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    phone_number = Column(String(32), index=True, nullable=False)
    category = Column(String(64), nullable=False)
    description = Column(Text, nullable=True)
    tags = Column(JSON, default=list)
    reported_by = Column(String(128), default="anonymous")
    created_at = Column(BigInteger, default=lambda: int(time.time() * 1000))

    def to_dict(self):
        return {
            "id": self.id,
            "phoneNumber": self.phone_number,
            "category": self.category,
            "description": self.description,
            "tags": self.tags or [],
            "reportedBy": self.reported_by,
            "createdAt": self.created_at
        }

class ScamPhraseRecord(Base):
    __tablename__ = "scam_phrases"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    phrase = Column(String(255), unique=True, index=True, nullable=False)
    category = Column(String(64), nullable=False)
    weight = Column(Integer, default=30)
    language = Column(String(32), default="en-IN")
    severity = Column(String(32), default="warning") # safe, info, warning, danger, critical
    description = Column(Text, nullable=True)

    def to_dict(self):
        return {
            "id": str(self.id),
            "phrase": self.phrase,
            "category": self.category,
            "weight": self.weight,
            "language": self.language,
            "severity": self.severity,
            "description": self.description or ""
        }

class GuardianAlertRecord(Base):
    __tablename__ = "guardian_alerts"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    alert_id = Column(String(128), unique=True, index=True, nullable=False)
    call_id = Column(String(128), index=True, nullable=False)
    user_id = Column(String(128), index=True, nullable=False)
    guardian_phone = Column(String(32), nullable=True)
    scam_score = Column(Integer, default=0)
    category = Column(String(64), default="SAFE")
    message = Column(Text, nullable=False)
    status = Column(String(32), default="DISPATCHED") # DISPATCHED, DELIVERED, FAILED
    created_at = Column(BigInteger, default=lambda: int(time.time() * 1000))

    def to_dict(self):
        return {
            "alertId": self.alert_id,
            "callId": self.call_id,
            "userId": self.user_id,
            "guardianPhone": self.guardian_phone,
            "scamScore": self.scam_score,
            "category": self.category,
            "message": self.message,
            "status": self.status,
            "createdAt": self.created_at
        }

class AuditLogRecord(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    action = Column(String(128), nullable=False)
    user_id = Column(String(128), nullable=True)
    details = Column(JSON, default=dict)
    ip_address = Column(String(64), nullable=True)
    timestamp = Column(BigInteger, default=lambda: int(time.time() * 1000))

    def to_dict(self):
        return {
            "id": self.id,
            "action": self.action,
            "userId": self.user_id,
            "details": self.details or {},
            "ipAddress": self.ip_address,
            "timestamp": self.timestamp
        }
