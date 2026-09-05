import re
import numpy as np
from typing import Dict, Any, Optional

class FeatureExtractor:
    FEATURE_NAMES = [
        "urgency_density",
        "authority_density",
        "credential_density",
        "threat_penalty_density",
        "financial_redirection",
        "remote_access_indicator",
        "total_word_count_norm",
        "question_ratio",
        "exclamation_density",
        "reputation_risk",
        "pitch_invariance",
        "breathing_absence",
        "sentiment_negativity",
        "coercion_proximity",
        "kyc_threat_score",
        "parcel_contraband_score"
    ]

    def __init__(self):
        self.urgency_regex = re.compile(r"\b(immediately|urgent|right\s+now|hurry|instantly|within\s+\d+\s+min|fast)\b", re.I)
        self.authority_regex = re.compile(r"\b(cbi|police|customs|inspector|officer|rbi|cyber\s+crime|bank\s+manager)\b", re.I)
        self.credential_regex = re.compile(r"\b(otp|pin|password|verification\s+code|6-digit|auth\s+code)\b", re.I)
        self.threat_regex = re.compile(r"\b(arrest|jail|court|warrant|freeze|blocked|deactivated|suspended|penalty)\b", re.I)
        self.financial_regex = re.compile(r"\b(transfer|escrow|refund|clearance|deposit|wire|send\s+money|scanner)\b", re.I)
        self.remote_regex = re.compile(r"\b(anydesk|teamviewer|quicksupport|rustdesk|screen\s+share|install\s+apk)\b", re.I)
        self.kyc_regex = re.compile(r"\b(kyc|aadhaar|pan\s+card|identity\s+update)\b", re.I)
        self.parcel_regex = re.compile(r"\b(fedex|parcel|courier|mdma|drugs|contraband|narcotics)\b", re.I)

    def extract_vector(
        self, 
        text: str, 
        audio_features: Optional[Dict[str, Any]] = None,
        caller_reputation_score: float = 0.0
    ) -> np.ndarray:
        """Extracts a 16-dimensional normalized feature vector from text and audio signals."""
        words = text.split()
        n_words = max(1, len(words))

        u_matches = len(self.urgency_regex.findall(text))
        a_matches = len(self.authority_regex.findall(text))
        c_matches = len(self.credential_regex.findall(text))
        t_matches = len(self.threat_regex.findall(text))
        f_matches = len(self.financial_regex.findall(text))
        r_matches = len(self.remote_regex.findall(text))
        k_matches = len(self.kyc_regex.findall(text))
        p_matches = len(self.parcel_regex.findall(text))

        # Acoustic features if available
        pitch_invar = 0.0
        breath_abs = 0.0
        if audio_features:
            markers = audio_features.get("deepfakeMarkers", {})
            pitch_invar = float(markers.get("prosodyUnnaturalness", 0)) / 100.0
            breath_abs = 1.0 if markers.get("breathingAbsence", False) else 0.0

        q_count = text.count("?")
        excl_count = text.count("!")

        # Coercion proximity: authority co-occurring with threat
        coercion = 1.0 if (a_matches > 0 and t_matches > 0) else 0.0

        vec = np.array([
            min(1.0, u_matches / (n_words * 0.15 + 1e-5)),
            min(1.0, a_matches / (n_words * 0.10 + 1e-5)),
            min(1.0, c_matches * 0.5),
            min(1.0, t_matches / (n_words * 0.12 + 1e-5)),
            min(1.0, f_matches * 0.4),
            min(1.0, r_matches * 0.8),
            min(1.0, n_words / 150.0),
            min(1.0, q_count / (n_words * 0.05 + 1e-5)),
            min(1.0, excl_count / (n_words * 0.05 + 1e-5)),
            min(1.0, caller_reputation_score / 100.0),
            pitch_invar,
            breath_abs,
            min(1.0, (t_matches + u_matches) * 0.2),
            coercion,
            min(1.0, k_matches * 0.5 + (1.0 if (k_matches > 0 and t_matches > 0) else 0.0)),
            min(1.0, p_matches * 0.5 + (1.0 if (p_matches > 0 and a_matches > 0) else 0.0))
        ], dtype=np.float32)

        return vec

feature_extractor = FeatureExtractor()
