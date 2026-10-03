"""
Comprehensive Test Suite for Callix User Directory & Caller ID Reputation
Tests:
1. Phone Number Normalization
2. SQLite Database Thread Safety with concurrent read/write threads
3. Profile Synchronization via POST /api/users/sync-profile
4. Priority Caller Lookup via GET /api/lookup-phone (Community Hit vs Carrier Fallback)
"""

import sys
import unittest
import threading
import time
from pathlib import Path

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(backend_dir))

from python.user_directory_db import (
    upsert_user_directory,
    get_user_directory_by_phone,
    normalize_phone_number,
    get_phone_variants,
)
from python.app import app

class TestUserDirectory(unittest.TestCase):
    def setUp(self):
        self.client = app.test_client()

    def test_phone_normalization(self):
        """Test normalization of various Indian and international phone formats."""
        self.assertEqual(normalize_phone_number("9876543210"), "+919876543210")
        self.assertEqual(normalize_phone_number("+91 98765 43210"), "+919876543210")
        self.assertEqual(normalize_phone_number("09876543210"), "+919876543210")
        self.assertEqual(normalize_phone_number("+91-98765-43210"), "+919876543210")
        self.assertEqual(normalize_phone_number("919876543210"), "+919876543210")
        self.assertEqual(normalize_phone_number("+1 415 555 2671"), "+14155552671")

    def test_upsert_and_retrieve_user(self):
        """Test inserting and updating a user profile in SQLite."""
        test_phone = "+919123456780"
        test_name = "Priya Sharma"
        test_email = "priya.sharma@example.com"

        # 1. Insert
        record = upsert_user_directory(
            phone_number=test_phone,
            full_name=test_name,
            email=test_email,
            reputation_score=100,
            is_verified=True
        )
        self.assertIsNotNone(record)
        self.assertEqual(record["phone_number"], test_phone)
        self.assertEqual(record["full_name"], test_name)
        self.assertEqual(record["email"], test_email)
        self.assertEqual(record["reputation_score"], 100)

        # 2. Lookup via 10-digit query
        retrieved = get_user_directory_by_phone("9123456780")
        self.assertIsNotNone(retrieved)
        self.assertEqual(retrieved["full_name"], test_name)

        # 3. Lookup via formatted query
        retrieved_fmt = get_user_directory_by_phone("+91 91234 56780")
        self.assertIsNotNone(retrieved_fmt)
        self.assertEqual(retrieved_fmt["full_name"], test_name)

        # 4. Upsert with updated name
        updated_record = upsert_user_directory(
            phone_number=test_phone,
            full_name="Dr. Priya Sharma",
            email=test_email,
            reputation_score=100,
            is_verified=True
        )
        self.assertEqual(updated_record["full_name"], "Dr. Priya Sharma")

    def test_database_thread_safety(self):
        """Test concurrent multi-threaded writes and reads without database lock errors."""
        errors = []
        threads = []

        def worker(thread_idx):
            try:
                phone = f"98000000{thread_idx:02d}"
                name = f"Concurrent User {thread_idx}"
                # Write
                upsert_user_directory(phone, name, f"user{thread_idx}@callix.ai")
                # Immediate Read
                res = get_user_directory_by_phone(phone)
                if not res or res["full_name"] != name:
                    errors.append(f"Mismatch in thread {thread_idx}")
            except Exception as e:
                errors.append(f"Thread {thread_idx} exception: {e}")

        # Launch 20 concurrent threads
        for i in range(20):
            t = threading.Thread(target=worker, args=(i,))
            threads.append(t)
            t.start()

        for t in threads:
            t.join()

        self.assertEqual(len(errors), 0, f"Thread safety errors encountered: {errors}")

    def test_api_sync_profile_endpoint(self):
        """Test POST /api/users/sync-profile endpoint with Bearer token."""
        payload = {
            "phone_number": "9812345678",
            "full_name": "Vikram Malhotra",
            "email": "vikram@callix.ai",
            "reputation_score": 100,
            "is_verified": True
        }
        headers = {"Authorization": "Bearer mock_token_for_verification"}
        res = self.client.post("/api/users/sync-profile", json=payload, headers=headers)
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue(data.get("success"))
        self.assertIn("user", data)
        self.assertEqual(data["user"]["full_name"], "Vikram Malhotra")
        self.assertEqual(data["user"]["phone_number"], "+919812345678")
        self.assertEqual(data["user"]["is_verified"], 1)

    def test_api_lookup_phone_community_hit(self):
        """Test GET /api/lookup-phone for a registered user (community directory hit)."""
        # First ensure user is synced
        sync_payload = {
            "phone_number": "9876511223",
            "full_name": "Ananya Sen",
            "email": "ananya@callix.ai"
        }
        self.client.post("/api/users/sync-profile", json=sync_payload)

        # Lookup number
        res = self.client.get("/api/lookup-phone?number=9876511223")
        self.assertEqual(res.status_code, 200)
        data = res.get_json()

        self.assertEqual(data["caller_name"], "Ananya Sen")
        self.assertEqual(data["source"], "Callix Community Directory")
        self.assertTrue(data["is_community_verified"])
        self.assertEqual(data["reputation"], 100)
        self.assertIsNotNone(data.get("carrier"))
        self.assertIsNotNone(data.get("location"))

    def test_api_lookup_phone_carrier_fallback(self):
        """Test GET /api/lookup-phone for an unlisted number (carrier fallback)."""
        unlisted_number = "7019188291"
        res = self.client.get(f"/api/lookup-phone?number={unlisted_number}")
        self.assertEqual(res.status_code, 200)
        data = res.get_json()

        # Should NOT have a community caller name
        self.assertIsNone(data.get("caller_name"))
        self.assertEqual(data["source"], "Telecom Carrier Registry")
        self.assertFalse(data["is_community_verified"])
        self.assertIsNotNone(data.get("carrier"))
        self.assertIsNotNone(data.get("location"))

if __name__ == "__main__":
    unittest.main()
