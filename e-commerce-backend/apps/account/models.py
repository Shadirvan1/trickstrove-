from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.

class CoustomUser(AbstractUser):
    otp = models.CharField(max_length=6, blank=True, null=True)
    otp_created_at = models.DateTimeField(blank=True, null=True)
    email = models.EmailField(unique=True)
    is_verified = models.BooleanField(default=False)
    phone_number = models.CharField(max_length=15,blank=True,null=True)
    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'