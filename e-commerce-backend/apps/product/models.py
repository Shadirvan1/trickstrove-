from django.db import models

# Create your models here.
from django.db import models
from apps.account.models import CoustomUser

class Product(models.Model):
    name = models.CharField(max_length=255)
    brand = models.CharField(max_length=255)
    category = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField()
    description = models.TextField()
    image = models.ImageField(upload_to='watches/') 
    ACTIVITY_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
    ]
    activity = models.CharField(max_length=10, choices=ACTIVITY_CHOICES, default='active')

    def __str__(self):
        return f"{self.name} - {self.brand}"

