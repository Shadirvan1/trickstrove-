import random
from django.core.mail import send_mail

def generate_otp():
    return str(random.randint(100000,999999))
def sent_otp_email(email,otp): 
    send_mail( subject="Email verification OTP",
    message=f"Your OTP for email verification is {otp}.It is valid for 5 minutes.",
    from_email=None,
    recipient_list=[email], 
    fail_silently=False, 
    )