import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from ..config import settings

logger = logging.getLogger("CallixDatabase")

db_url = settings.DATABASE_URL
connect_args = {}
if db_url.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(
    db_url,
    connect_args=connect_args,
    echo=settings.RAW_CONFIG.get("database", {}).get("echo_queries", False)
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    """Dependency generator for database sessions"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    """Initializes all tables and seeds default phrase database and mock reputations if empty"""
    from .models import (
        ScamPhraseRecord, 
        NumberReputationRecord
    )
    Base.metadata.create_all(bind=engine)
    logger.info(f"Database initialized successfully with URL: {db_url}")

    # Seed default scam phrases and number reputation if empty
    db = SessionLocal()
    try:
        if db.query(ScamPhraseRecord).count() == 0:
            default_phrases = [
                ScamPhraseRecord(
                    phrase="kyc expire", 
                    category="KYC_EXPIRY", 
                    weight=45, 
                    language="en-IN", 
                    severity="danger", 
                    description="Claiming KYC document expiry to induce panic"
                ),
                ScamPhraseRecord(
                    phrase="share otp", 
                    category="OTP_THEFT", 
                    weight=50, 
                    language="en-IN", 
                    severity="critical", 
                    description="Coercing user to read out 6-digit one-time password"
                ),
                ScamPhraseRecord(
                    phrase="digital arrest", 
                    category="DIGITAL_ARREST", 
                    weight=55, 
                    language="en-IN", 
                    severity="critical", 
                    description="Threatening virtual judicial arrest over Skype/WhatsApp"
                ),
                ScamPhraseRecord(
                    phrase="customs parcel seized", 
                    category="CUSTOMS_PARCEL_SCAM", 
                    weight=40, 
                    language="en-IN", 
                    severity="danger", 
                    description="Claiming illegal parcel containing narcotics held at airport"
                ),
                ScamPhraseRecord(
                    phrase="upi pin enter", 
                    category="UPI_FRAUD", 
                    weight=40, 
                    language="en-IN", 
                    severity="danger", 
                    description="Deceitfully asking for UPI PIN to receive refund money"
                ),
                ScamPhraseRecord(
                    phrase="install anydesk", 
                    category="REMOTE_ACCESS", 
                    weight=45, 
                    language="en-IN", 
                    severity="danger", 
                    description="Asking to install remote screen sharing application"
                ),
                ScamPhraseRecord(
                    phrase="rbi escrow account", 
                    category="DIGITAL_ARREST", 
                    weight=50, 
                    language="en-IN", 
                    severity="critical", 
                    description="Demanding funds transfer to fake RBI verification account"
                ),
            ]
            db.add_all(default_phrases)
            db.commit()

        if db.query(NumberReputationRecord).count() == 0:
            default_reputations = [
                NumberReputationRecord(
                    phone_number="+919876543210",
                    reputation_score=92,
                    total_reports=184,
                    last_reported_category="CUSTOMS_PARCEL_SCAM",
                    caller_name_suggestion="Fake Mumbai Police Cell",
                    carrier="Jio Telecom",
                    location="Maharashtra, India",
                    tags=["Digital Arrest", "CBI Impersonator", "Severe Threat"],
                    is_blacklisted=True
                ),
                NumberReputationRecord(
                    phone_number="+918001234567",
                    reputation_score=88,
                    total_reports=96,
                    last_reported_category="KYC_EXPIRY",
                    caller_name_suggestion="Fake SBI KYC Executive",
                    carrier="Airtel",
                    location="New Delhi, India",
                    tags=["OTP Extortion", "Bank Fraud"],
                    is_blacklisted=True
                ),
                NumberReputationRecord(
                    phone_number="+919999988888",
                    reputation_score=10,
                    total_reports=0,
                    last_reported_category="SAFE",
                    caller_name_suggestion="Max Healthcare Clinic",
                    carrier="Vodafone Idea",
                    location="Bangalore, India",
                    tags=["Verified Clinic", "Safe Caller"],
                    is_blacklisted=False
                )
            ]
            db.add_all(default_reputations)
            db.commit()
    except Exception as e:
        db.rollback()
        logger.warning(f"Initial seed notice: {e}")
    finally:
        db.close()
