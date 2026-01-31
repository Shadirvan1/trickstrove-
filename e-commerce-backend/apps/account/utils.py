import random

import requests
from django.conf import settings

BREVO_API_URL = "https://api.brevo.com/v3/smtp/email"


def generate_otp():
    """Generate 6 digit OTP"""
    return str(random.randint(100000, 999999))


def send_email(to_email, subject, html_content):
    """Send email using Brevo API"""

    headers = {
        "accept": "application/json",
        "api-key": settings.BREVO_API_KEY,
        "content-type": "application/json",
    }

    payload = {
        "sender": {
            "name": settings.BREVO_FROM_NAME,
            "email": settings.BREVO_FROM_EMAIL,
        },
        "to": [{"email": to_email}],
        "subject": subject,
        "htmlContent": html_content,
    }

    response = requests.post(
        BREVO_API_URL,
        json=payload,
        headers=headers,
        timeout=10,
    )

    if response.status_code != 201:
        print("Brevo error:", response.text)

    return response.status_code == 201


def send_otp_email(email, otp):
    """Send OTP email"""

    subject = "Email Verification Code"

    html_content = f"""
        <h2>Email Verification</h2>
        <p>Your OTP code is:</p>
        <h1 style="letter-spacing:3px;">{otp}</h1>
        <p>This code is valid for 5 minutes.</p>
    """

    return send_email(email, subject, html_content)
