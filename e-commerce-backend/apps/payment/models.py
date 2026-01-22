from django.db import models
from apps.account.models import CoustomUser

class Address(models.Model):
    user = models.ForeignKey(
        CoustomUser,
        on_delete=models.CASCADE,
        related_name="addresses"
    )

    full_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=15)
    address = models.TextField()
    pincode = models.CharField(max_length=10)

    def __str__(self):
        return f"{self.full_name} - {self.pincode}"


