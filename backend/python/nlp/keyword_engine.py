import re
from typing import Dict, List, Tuple, Any

class KeywordEngine:
    def __init__(self):
        # Comprehensive dictionary of fraud categories and associated regex/phrases
        self.categories = {
            "DIGITAL_ARREST": {
                "patterns": [
                    r"\b(digital\s+arrest)\b",
                    r"\b(customs|fedex|courier)\s+(parcel|package|consignment)\b",
                    r"\b(mdma|drugs|contraband|narcotics|synthetic\s+drugs)\b",
                    r"\b(cbi|police|mumbai\s+police|cyber\s+crime|crime\s+branch|inspector|dsp)\b",
                    r"\b(arrest\s+warrant|court\s+order|non-bailable|jail)\b",
                    r"\b(rbi\s+escrow|verification\s+account|clearance\s+fund)\b",
                    r"\b(do\s+not\s+disconnect|remain\s+on\s+skype|video\s+surveillance)\b"
                ],
                "base_score": 95,
                "vector": "Digital Arrest & Coercion"
            },
            "OTP_THEFT": {
                "patterns": [
                    r"\b(otp|one\s+time\s+password|6-digit|six\s+digit)\b",
                    r"\b(verification\s+code|sms\s+code|auth\s+code)\b",
                    r"\b(share\s+(the\s+)?code|tell\s+me\s+(the\s+)?otp|read\s+out\s+code)\b",
                    r"\b(dispatched\s+otp|received\s+sms)\b"
                ],
                "base_score": 93,
                "vector": "OTP Extortion"
            },
            "KYC_EXPIRY": {
                "patterns": [
                    r"\b(kyc\s+(is\s+)?expired|kyc\s+update|aadhaar\s+link|pan\s+card\s+link)\b",
                    r"\b(account\s+(will\s+be\s+)?blocked|freeze\s+(your\s+)?account|deactivated\s+permanently)\b",
                    r"\b(within\s+(30|10|5)\s+minutes|immediate\s+suspension)\b",
                    r"\b(state\s+bank|sbi|hdfc|icici|axis\s+bank)\s+(security|manager)\b"
                ],
                "base_score": 88,
                "vector": "Fake KYC Expiry"
            },
            "UPI_FRAUD": {
                "patterns": [
                    r"\b(upi\s+pin|enter\s+pin\s+to\s+receive|enter\s+secret\s+pin)\b",
                    r"\b(cashback\s+refund|money\s+refund|payment\s+link|scanner\s+link)\b",
                    r"\b(approve\s+request|gpay|phonepe|paytm)\s+(refund|claim)\b",
                    r"\b(receive\s+money\s+scan)\b"
                ],
                "base_score": 82,
                "vector": "UPI Payment Trap"
            },
            "REMOTE_ACCESS": {
                "patterns": [
                    r"\b(anydesk|teamviewer|quicksupport|rustdesk|screen\s+share)\b",
                    r"\b(install\s+apk|download\s+app|security\s+app|remote\s+support)\b",
                    r"\b(grant\s+permission|allow\s+access|9-digit\s+id)\b"
                ],
                "base_score": 85,
                "vector": "Remote Access Trojan"
            },
            "LOTTERY_PRIZE": {
                "patterns": [
                    r"\b(won\s+lottery|kbc\s+lucky\s+draw|prize\s+money|won\s+25\s+lakh)\b",
                    r"\b(claim\s+reward|processing\s+fee|government\s+tax\s+deposit)\b"
                ],
                "base_score": 78,
                "vector": "Lottery Fraud"
            }
        }

        self.safe_patterns = [
            r"\b(doctor|appointment|clinic|prescription|consultation)\b",
            r"\b(delivery|swiggy|zomato|parcel\s+arrived\s+at\s+gate|food\s+order)\b",
            r"\b(good\s+morning|dinner|family|colleague|meeting\s+scheduled)\b"
        ]

    def analyze_text(self, text: str) -> Dict[str, Any]:
        """Analyzes text for suspicious phrases, computing threat score and scam category."""
        if not text:
            return {
                "scamScore": 0,
                "category": "SAFE",
                "verdict": "Legitimate",
                "triggerPhrases": [],
                "explanation": "No text provided for analysis.",
                "matchedVectors": []
            }

        text_lower = text.lower()
        matched_categories: Dict[str, List[str]] = {}
        matched_vectors = set()
        trigger_phrases = []

        # Check threat categories
        for cat, config in self.categories.items():
            cat_matches = []
            for pat in config["patterns"]:
                found = re.findall(pat, text_lower)
                if found:
                    for m in found:
                        phrase = m if isinstance(m, str) else m[0]
                        if phrase and phrase not in trigger_phrases:
                            trigger_phrases.append(phrase)
                            cat_matches.append(phrase)
            if cat_matches:
                matched_categories[cat] = cat_matches
                matched_vectors.add(config["vector"])

        # Check safe indicators
        safe_matches = []
        for pat in self.safe_patterns:
            found = re.findall(pat, text_lower)
            if found:
                for m in found:
                    phrase = m if isinstance(m, str) else m[0]
                    safe_matches.append(phrase)

        # Decision logic
        if not matched_categories:
            score = 5 if not safe_matches else 2
            return {
                "scamScore": score,
                "category": "SAFE",
                "verdict": "Legitimate",
                "triggerPhrases": [],
                "explanation": "Natural everyday dialogue with zero extortion or fraud indicators.",
                "matchedVectors": []
            }

        # Select primary category based on highest severity
        primary_cat = "SAFE"
        highest_base = 0
        for cat in matched_categories:
            base = self.categories[cat]["base_score"]
            if base > highest_base:
                highest_base = base
                primary_cat = cat

        # Calculate final composite score
        extra_boost = min(15, (len(trigger_phrases) - 1) * 3)
        final_score = min(99, highest_base + extra_boost)

        # Compose human-readable XAI explanation
        explanations = {
            "DIGITAL_ARREST": "Severe psychological coercion impersonating law enforcement/customs with fake drug/crime allegations and illegal extortion.",
            "OTP_THEFT": "High-risk direct extortion demanding confidential 6-digit SMS OTP to compromise bank or digital accounts.",
            "KYC_EXPIRY": "Artificial panic inducing fake bank KYC expiry and threat of permanent account deactivation to steal credentials.",
            "UPI_FRAUD": "Deceptive scheme asking victim to enter secret UPI PIN or scan refund QR code to siphon funds.",
            "REMOTE_ACCESS": "Coercing victim to install remote desktop mirroring tool (AnyDesk/TeamViewer) to gain device control.",
            "LOTTERY_PRIZE": "Luring victim with fake lottery/prize claims requiring upfront tax or processing advance payment."
        }
        explanation = explanations.get(primary_cat, "Suspicious conversation with fraudulent indicators detected.")

        verdict = "Fraudulent" if final_score >= 75 else "Suspicious" if final_score >= 40 else "Legitimate"

        return {
            "scamScore": final_score,
            "category": primary_cat,
            "verdict": verdict,
            "triggerPhrases": trigger_phrases,
            "explanation": explanation,
            "matchedVectors": list(matched_vectors)
        }

scam_analyzer = KeywordEngine()
