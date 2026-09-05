from typing import Dict, Any, Tuple
import json
import logging
from pathlib import Path
import numpy as np
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
import sys
from pathlib import Path

# Support running directly as script
current_dir = Path(__file__).resolve().parent
if str(current_dir.parent.parent) not in sys.path:
    sys.path.insert(0, str(current_dir.parent.parent))

try:
    from .models import (
        RandomForestFraudModel,
        SVMFraudModel,
        CNN1DFraudModel,
        RNNFraudModel,
        LSTMFraudModel
    )
    from .feature_extractor import feature_extractor
except (ImportError, ValueError):
    from python.ml.models import (
        RandomForestFraudModel,
        SVMFraudModel,
        CNN1DFraudModel,
        RNNFraudModel,
        LSTMFraudModel
    )
    from python.ml.feature_extractor import feature_extractor

logger = logging.getLogger("CallixMLTrain")
SAVED_MODELS_DIR = Path(__file__).resolve().parent / "saved_models"

def generate_training_dataset(n_samples: int = 500) -> Tuple[np.ndarray, np.ndarray]:
    """Generates synthetic dataset of fraud and legitimate call conversations."""
    fraud_templates = [
        "Good afternoon. This is State Bank Security Division. Your savings account KYC has expired. Account will be blocked permanently in 30 minutes. Share the 6-digit OTP immediately.",
        "This is Inspector Vijay Rathore from Mumbai Cyber Crime Cell. A FedEx parcel under your Aadhaar with 150g MDMA was seized at Customs. You are under Digital Arrest. Transfer balance to RBI escrow.",
        "Your electricity bill is overdue. Power disconnection within 15 minutes. Call electricity officer immediately and pay via link.",
        "Congratulations! You won 25 lakh in KBC lottery contest. Pay processing fee and tax deposit immediately to claim reward.",
        "Hello sir, your UPI cashback of Rs 4999 is pending. Please open PhonePe and enter your secret UPI PIN to approve credit.",
        "State Bank alert: suspicious debit detected. Install AnyDesk remote support app right now so technician can assist.",
        "Customs enforcement notice: non-bailable arrest warrant issued. Remain on video call surveillance and do not disconnect.",
        "Your debit card is suspended. Tell me the 16 digit number and CVV code with expiry date to unfreeze.",
        "Your PAN card is not linked to bank. Penalty of 50000 rupees applied. Share SMS verification code now.",
        "QuickSupport download link sent on SMS. Open app and grant permission to fix your mobile banking error."
    ]

    legitimate_templates = [
        "Hello, calling from Max Healthcare clinic to confirm your doctor consultation with Dr. Kapoor tomorrow at 11 AM.",
        "Hi, your food delivery from Swiggy is at the gate. Can you please collect it?",
        "Good morning, just calling to check if we are still meeting for coffee this evening after work.",
        "Hi Mom, I reached the office safely. Will call you back in the evening during dinner.",
        "Amazon delivery: your package has been delivered to your doorstep. Thank you for shopping.",
        "Hello sir, this is from the library reminding you to return the borrowed book by Friday.",
        "Hey, did you get the presentation slides I emailed you earlier today?",
        "Good afternoon, this is customer service confirming your broadband installation appointment for Saturday 3 PM.",
        "Hi Rahul, let's schedule our project sync meeting for tomorrow morning at 10 AM.",
        "Calling from dental clinic to remind you of your routine dental checkup scheduled for next Monday."
    ]

    X_list = []
    y_list = []
    rng = np.random.RandomState(42)

    for i in range(n_samples):
        is_fraud = (i % 2 == 0)
        if is_fraud:
            template = rng.choice(fraud_templates)
            # Add slight randomized text variation
            if rng.rand() > 0.5:
                template += " Hurry right now, fast!"
            rep_score = rng.uniform(60.0, 99.0)
            pitch_invar = rng.uniform(0.6, 0.95) if rng.rand() > 0.4 else 0.1
            breath_abs = rng.choice([True, False])
            audio_feats = {"deepfakeMarkers": {"prosodyUnnaturalness": pitch_invar * 100, "breathingAbsence": breath_abs}}
            vec = feature_extractor.extract_vector(template, audio_feats, rep_score)
            # Add mild feature jitter
            vec = np.clip(vec + rng.randn(*vec.shape) * 0.05, 0.0, 1.0)
            X_list.append(vec)
            y_list.append(1)
        else:
            template = rng.choice(legitimate_templates)
            rep_score = rng.uniform(0.0, 20.0)
            audio_feats = {"deepfakeMarkers": {"prosodyUnnaturalness": 10, "breathingAbsence": False}}
            vec = feature_extractor.extract_vector(template, audio_feats, rep_score)
            vec = np.clip(vec + rng.randn(*vec.shape) * 0.03, 0.0, 1.0)
            X_list.append(vec)
            y_list.append(0)

    return np.array(X_list, dtype=np.float32), np.array(y_list, dtype=np.int32)

def train_and_save_all_models() -> Dict[str, Any]:
    """Trains all 5 models on the synthetic dataset, evaluates benchmarks, and persists weights."""
    SAVED_MODELS_DIR.mkdir(parents=True, exist_ok=True)
    
    X, y = generate_training_dataset(600)
    split_idx = int(len(X) * 0.8)
    X_train, X_val = X[:split_idx], X[split_idx:]
    y_train, y_val = y[:split_idx], y[split_idx:]

    models = {
        "random_forest": RandomForestFraudModel(),
        "svm": SVMFraudModel(),
        "cnn": CNN1DFraudModel(),
        "rnn": RNNFraudModel(),
        "lstm": LSTMFraudModel()
    }

    metrics = {}

    for key, model in models.items():
        logger.info(f"Training model: {model.name}...")
        model.train(X_train, y_train)
        
        # Predict on validation set
        probs = model.predict_proba(X_val)
        preds = (probs >= 0.5).astype(int)

        acc = float(accuracy_score(y_val, preds))
        prec = float(precision_score(y_val, preds, zero_division=0))
        rec = float(recall_score(y_val, preds, zero_division=0))
        f1 = float(f1_score(y_val, preds, zero_division=0))

        metrics[key] = {
            "name": model.name,
            "accuracy": round(acc, 4),
            "precision": round(prec, 4),
            "recall": round(rec, 4),
            "f1Score": round(f1, 4),
            "valSamples": len(y_val)
        }

        # Save model
        if key in ["random_forest", "svm"]:
            model.save(SAVED_MODELS_DIR / f"{key}_model.joblib")
        else:
            model.save(SAVED_MODELS_DIR / f"{key}_model.json")

    # Save metrics JSON
    with open(SAVED_MODELS_DIR / "metrics.json", "w", encoding="utf-8") as f:
        json.dump(metrics, f, indent=2)

    logger.info("All 5 models trained and persisted successfully.")
    return metrics

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    results = train_and_save_all_models()
    print("Training Results:")
    print(json.dumps(results, indent=2))
