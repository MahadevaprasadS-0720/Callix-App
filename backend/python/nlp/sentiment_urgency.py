import re
from typing import Dict, Any

class SentimentUrgencyAnalyzer:
    def __init__(self):
        self.urgency_words = [
            "immediately", "urgent", "right now", "hurry", "fast",
            "within 10 minutes", "within 30 minutes", "instantly",
            "before it is too late", "last chance", "final notice",
            "do not delay", "do not hang up", "stay on the line"
        ]
        
        self.intimidation_words = [
            "police", "cbi", "arrest", "court", "jail", "non-bailable",
            "warrant", "seized", "illegal", "investigation", "crime",
            "penalty", "frozen", "deactivated", "blocked", "confiscated"
        ]

        self.authority_titles = [
            "officer", "inspector", "dsp", "magistrate", "judge",
            "bank manager", "security division", "headquarters", "customs department"
        ]

    def analyze(self, text: str) -> Dict[str, Any]:
        """Evaluates psychological urgency, intimidation level, and authority impersonation."""
        if not text:
            return {
                "urgencyScore": 0,
                "intimidationLevel": "None",
                "authorityImpersonation": False,
                "urgencyMarkers": [],
                "intimidationMarkers": []
            }

        text_lower = text.lower()

        matched_urgency = [w for w in self.urgency_words if w in text_lower]
        matched_intimidation = [w for w in self.intimidation_words if w in text_lower]
        matched_authority = [w for w in self.authority_titles if w in text_lower]

        # Calculate urgency score (0 - 100)
        urgency_score = min(100, len(matched_urgency) * 25 + len(matched_intimidation) * 15)

        intimidation_level = "Severe" if len(matched_intimidation) >= 3 else \
                             "Moderate" if len(matched_intimidation) >= 1 else "None"

        return {
            "urgencyScore": urgency_score,
            "intimidationLevel": intimidation_level,
            "authorityImpersonation": len(matched_authority) > 0,
            "urgencyMarkers": matched_urgency,
            "intimidationMarkers": matched_intimidation,
            "authorityTitles": matched_authority
        }

urgency_analyzer = SentimentUrgencyAnalyzer()
