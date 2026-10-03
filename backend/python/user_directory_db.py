"""
User Directory Database Module for Callix
Provides dedicated SQLite database storage and querying for Truecaller-style
crowdsourced Caller ID and Community Verified Caller Directory.
"""

import os
import re
import sqlite3
import threading
import logging
from pathlib import Path
from typing import Optional, Dict, Any, List

logger = logging.getLogger("CallixUserDirectory")

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "user_directory.db"

_db_lock = threading.Lock()

def normalize_phone_number(raw_phone: str) -> str:
    """
    Normalizes a phone number to standard international E.164 format.
    - Strips spaces, dashes, parentheses, dots
    - Prepends +91 for 10-digit Indian numbers or handles 11-digit (with 0) / 12-digit (with 91)
    """
    if not raw_phone:
        return ""
    
    clean_str = str(raw_phone).strip()
    digits = re.sub(r"\D", "", clean_str)
    
    if not digits:
        return ""
    
    # 10 digits: Standard Indian mobile (e.g. 9876543210 -> +919876543210)
    if len(digits) == 10:
        return f"+91{digits}"
    
    # 11 digits starting with 0: e.g. 09876543210 -> +919876543210
    if len(digits) == 11 and digits.startswith("0"):
        return f"+91{digits[1:]}"
    
    # 12 digits starting with 91: e.g. 919876543210 -> +919876543210
    if len(digits) == 12 and digits.startswith("91"):
        return f"+{digits}"
    
    # International number already with plus
    if clean_str.startswith("+"):
        return f"+{digits}"
    
    # Numbers longer than 10 digits without plus
    if len(digits) > 10:
        return f"+{digits}"
    
    # Fallback default
    return f"+91{digits}"

def get_phone_variants(phone: str) -> List[str]:
    """Generates lookup variants to ensure resilient directory search."""
    normalized = normalize_phone_number(phone)
    if not normalized:
        return []
    
    digits = re.sub(r"\D", "", normalized)
    variants = [normalized, digits]
    
    if digits.startswith("91") and len(digits) == 12:
        clean10 = digits[-10:]
        variants.append(clean10)
        variants.append(f"91{clean10}")
        variants.append(f"+91{clean10}")
    elif len(digits) >= 10:
        clean10 = digits[-10:]
        variants.append(clean10)
        variants.append(f"+91{clean10}")
    
    # Preserve order with deduplication
    seen = set()
    result = []
    for v in variants:
        if v not in seen:
            seen.add(v)
            result.append(v)
    return result

def get_db_connection() -> sqlite3.Connection:
    """Creates a thread-safe connection to user_directory.db with WAL mode."""
    conn = sqlite3.connect(
        str(DB_PATH),
        check_same_thread=False,
        timeout=30.0,
        isolation_level=None  # autocommit mode; explicit transactions handled via BEGIN/COMMIT
    )
    conn.row_factory = sqlite3.Row
    try:
        conn.execute("PRAGMA journal_mode=WAL;")
        conn.execute("PRAGMA synchronous=NORMAL;")
    except Exception as e:
        logger.warning(f"Could not set WAL mode on user_directory.db: {e}")
    return conn

def init_user_directory_db():
    """Initializes the user_directory table and necessary indexes."""
    with _db_lock:
        conn = get_db_connection()
        try:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS user_directory (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    phone_number TEXT UNIQUE NOT NULL,
                    full_name TEXT NOT NULL,
                    email TEXT,
                    reputation_score INTEGER DEFAULT 100,
                    is_verified BOOLEAN DEFAULT 1,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            """)
            cursor.execute("""
                CREATE INDEX IF NOT EXISTS idx_user_dir_phone 
                ON user_directory(phone_number);
            """)
            logger.info(f"User Directory Database initialized at: {DB_PATH}")
        finally:
            conn.close()

def upsert_user_directory(
    phone_number: str,
    full_name: str,
    email: Optional[str] = None,
    reputation_score: int = 100,
    is_verified: bool = True
) -> Dict[str, Any]:
    """
    Inserts or updates a user profile record in the user_directory table.
    Ensures phone number is normalized and thread-safe.
    """
    normalized_phone = normalize_phone_number(phone_number)
    if not normalized_phone:
        raise ValueError("Invalid phone number provided")
    
    clean_name = str(full_name).strip() if full_name else ""
    if not clean_name:
        raise ValueError("Full name cannot be empty")
    
    clean_email = str(email).strip() if email else None
    rep_score = max(0, min(100, int(reputation_score)))
    verified_val = 1 if is_verified else 0

    with _db_lock:
        conn = get_db_connection()
        try:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO user_directory (
                    phone_number,
                    full_name,
                    email,
                    reputation_score,
                    is_verified,
                    created_at,
                    updated_at
                ) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                ON CONFLICT(phone_number) DO UPDATE SET
                    full_name = excluded.full_name,
                    email = COALESCE(excluded.email, user_directory.email),
                    reputation_score = excluded.reputation_score,
                    is_verified = excluded.is_verified,
                    updated_at = CURRENT_TIMESTAMP;
            """, (normalized_phone, clean_name, clean_email, rep_score, verified_val))
            
            # Fetch the updated row
            cursor.execute("SELECT * FROM user_directory WHERE phone_number = ? LIMIT 1;", (normalized_phone,))
            row = cursor.fetchone()
            if not row:
                raise RuntimeError("Failed to retrieve upserted user record")
            
            return dict(row)
        finally:
            conn.close()

def get_user_directory_by_phone(phone_number: str) -> Optional[Dict[str, Any]]:
    """
    Searches the user_directory database for a given phone number.
    Uses multi-variant matching (E.164, without plus, 10-digit suffix).
    """
    variants = get_phone_variants(phone_number)
    if not variants:
        return None
    
    placeholders = ",".join("?" for _ in variants)
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        query = f"SELECT * FROM user_directory WHERE phone_number IN ({placeholders}) ORDER BY id DESC LIMIT 1;"
        cursor.execute(query, variants)
        row = cursor.fetchone()
        if row:
            return dict(row)
        return None
    finally:
        conn.close()

def get_all_directory_users(limit: int = 50) -> List[Dict[str, Any]]:
    """Retrieves the most recent users registered in the community directory."""
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM user_directory ORDER BY updated_at DESC LIMIT ?;", (limit,))
        rows = cursor.fetchall()
        return [dict(r) for r in rows]
    finally:
        conn.close()

# Auto-initialize database on import
init_user_directory_db()
