import os
import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
CONFIG_JSON_PATH = BASE_DIR / "config.json"

def load_json_config():
    if CONFIG_JSON_PATH.exists():
        with open(CONFIG_JSON_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}

_CONFIG = load_json_config()

class Settings:
    PROJECT_NAME = _CONFIG.get("project", {}).get("name", "Callix Audio Guardian Backend")
    PROJECT_VERSION = _CONFIG.get("project", {}).get("version", "2.0.0")
    
    # Server settings
    HOST = os.getenv("HOST", _CONFIG.get("server", {}).get("host", "0.0.0.0"))
    PORT = int(os.getenv("PORT", _CONFIG.get("server", {}).get("port", 5001)))
    DEBUG = os.getenv("DEBUG", "false").lower() == "true" or _CONFIG.get("server", {}).get("debug", False)
    CORS_ORIGINS = _CONFIG.get("server", {}).get("cors_origins", ["*"])

    # Database settings (Defaults to SQLite; supports PostgreSQL / MySQL via DATABASE_URL)
    DATABASE_URL = os.getenv("DATABASE_URL")
    if not DATABASE_URL:
        db_path = BASE_DIR / _CONFIG.get("database", {}).get("sqlite_path", "callix_guardian.db")
        DATABASE_URL = f"sqlite:///{db_path}"
    
    # ML settings
    COMPILER_SETTINGS = _CONFIG.get("compiler_settings", {})
    ML_MODELS = _CONFIG.get("ml_models", {})
    NLP_CONFIG = _CONFIG.get("nlp", {})
    STT_CONFIG = _CONFIG.get("stt", {})
    REPORTS_CONFIG = _CONFIG.get("reports", {})

    RAW_CONFIG = _CONFIG

settings = Settings()
