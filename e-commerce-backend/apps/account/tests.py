from django.test import TestCase
from apps.account.models import CoustomUser
from django.db.utils import IntegrityError

class CustomUserModelTest(TestCase):

    def setUp(self):
        self.user = CoustomUser.objects.create_user(
            username="testuser",
            email="testuser@example.com",
            password="testpass123",
            phone_number="9876543210"
        )

    # ---------------- BASIC USER CREATION ----------------

    def test_user_creation(self):
        self.assertEqual(self.user.username, "testuser")
        self.assertEqual(self.user.email, "testuser@example.com")
        self.assertFalse(self.user.is_verified)

    # ---------------- EMAIL UNIQUE ----------------

    def test_email_is_unique(self):
        with self.assertRaises(IntegrityError):
            CoustomUser.objects.create_user(
                username="user2",
                email="testuser@example.com",  
                password="testpass123"
            )

    # ---------------- OTP FIELDS ----------------

    def test_otp_fields_can_be_empty(self):
        self.assertIsNone(self.user.otp)
        self.assertIsNone(self.user.otp_created_at)

    # ---------------- PHONE NUMBER ----------------

    def test_phone_number_saved(self):
        self.assertEqual(self.user.phone_number, "9876543210")

    # ---------------- STRING REPRESENTATION ----------------

    def test_string_representation(self):
        self.assertEqual(str(self.user), self.user.username)
