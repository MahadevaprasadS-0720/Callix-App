import json
from pathlib import Path
from typing import Dict, Any, Optional
import numpy as np
from .feature_extractor import feature_extractor
from .models import (
    RandomForestFraudModel,
    SVMFraudModel,
    CNN1DFraudModel,
    RNNFraudModel,
    LSTMFraudModel
)

SAVED_MODELS_DIR = Path(__file__).resolve().parent / "saved_models"

class MLInferenceEngine:
    def __init__(self):
        self.rf = RandomForestFraudModel()
        self.svm = SVMFraudModel()
        self.cnn = CNN1DFraudModel()
        self.rnn = RNNFraudModel()
        self.lstm = LSTMFraudModel()
        self.weights = {
            "random_forest": 0.30,
            "svm": 0.20,
            "cnn": 0.20,
            "rnn": 0.15,
            "lstm": 0.15
        }
        self.load_models()

    def load_models(self):
        """Loads saved model checkpoints if available."""
        rf_path = SAVED_MODELS_DIR / "random_forest_model.joblib"
        svm_path = SAVED_MODELS_DIR / "svm_model.joblib"
        cnn_path = SAVED_MODELS_DIR / "cnn_model.json"
        rnn_path = SAVED_MODELS_DIR / "rnn_model.json"
        lstm_path = SAVED_MODELS_DIR / "lstm_model.json"

        if rf_path.exists():
            self.rf.load(rf_path)
        if svm_path.exists():
            self.svm.load(svm_path)
        if cnn_path.exists():
            self.cnn.load(cnn_path)
        if rnn_path.exists():
            self.rnn.load(rnn_path)
        if lstm_path.exists():
            self.lstm.load(lstm_path)

    def get_models_info(self) -> Dict[str, Any]:
        metrics_file = SAVED_MODELS_DIR / "metrics.json"
        metrics = {}
        if metrics_file.exists():
            with open(metrics_file, "r", encoding="utf-8") as f:
                metrics = json.load(f)

        return {
            "activeModels": [
                {"id": "random_forest", "name": self.rf.name, "isTrained": self.rf.is_trained, "weight": self.weights["random_forest"]},
                {"id": "svm", "name": self.svm.name, "isTrained": self.svm.is_trained, "weight": self.weights["svm"]},
                {"id": "cnn", "name": self.cnn.name, "isTrained": self.cnn.is_trained, "weight": self.weights["cnn"]},
                {"id": "rnn", "name": self.rnn.name, "isTrained": self.rnn.is_trained, "weight": self.weights["rnn"]},
                {"id": "lstm", "name": self.lstm.name, "isTrained": self.lstm.is_trained, "weight": self.weights["lstm"]},
                {"id": "ensemble", "name": "5-Model Consensus Ensemble", "isTrained": True, "weight": 1.0}
            ],
            "benchmarkMetrics": metrics
        }

    def predict(
        self,
        text: str,
        audio_features: Optional[Dict[str, Any]] = None,
        caller_reputation_score: float = 0.0,
        model_type: str = "ensemble"
    ) -> Dict[str, Any]:
        """
        Runs ML fraud inference using any of the 5 models or ensemble consensus.
        """
        vec = feature_extractor.extract_vector(text, audio_features, caller_reputation_score)
        
        rf_prob = float(self.rf.predict_proba(vec)[0])
        svm_prob = float(self.svm.predict_proba(vec)[0])
        cnn_prob = float(self.cnn.predict_proba(vec)[0])
        rnn_prob = float(self.rnn.predict_proba(vec)[0])
        lstm_prob = float(self.lstm.predict_proba(vec)[0])

        model_votes = {
            "random_forest": round(rf_prob * 100, 1),
            "svm": round(svm_prob * 100, 1),
            "cnn": round(cnn_prob * 100, 1),
            "rnn": round(rnn_prob * 100, 1),
            "lstm": round(lstm_prob * 100, 1),
        }

        # Select target probability based on model_type
        if model_type == "random_forest":
            final_prob = rf_prob
        elif model_type == "svm":
            final_prob = svm_prob
        elif model_type == "cnn":
            final_prob = cnn_prob
        elif model_type == "rnn":
            final_prob = rnn_prob
        elif model_type == "lstm":
            final_prob = lstm_prob
        else: # Default: Ensemble
            final_prob = (
                rf_prob * self.weights["random_forest"] +
                svm_prob * self.weights["svm"] +
                cnn_prob * self.weights["cnn"] +
                rnn_prob * self.weights["rnn"] +
                lstm_prob * self.weights["lstm"]
            )

        final_score = int(np.clip(final_prob * 100, 2, 99))
        verdict = "Fraudulent" if final_score >= 75 else "Suspicious" if final_score >= 40 else "Legitimate"

        # Extract top 3 influential features for explainability
        top_indices = np.argsort(vec)[::-1][:3]
        key_factors = [
            feature_extractor.FEATURE_NAMES[idx] 
            for idx in top_indices if vec[idx] > 0.05
        ]

        return {
            "finalScore": final_score,
            "verdict": verdict,
            "confidence": round(float(np.max([final_prob, 1.0 - final_prob])), 3),
            "modelType": model_type,
            "modelVotes": model_votes,
            "keyRiskFactors": key_factors,
            "featureVector": [round(float(v), 3) for v in vec]
        }

ml_engine = MLInferenceEngine()
