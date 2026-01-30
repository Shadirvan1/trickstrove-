from django.test import TestCase
from apps.product.models import Product

class ProductModelTest(TestCase):

    def setUp(self):
        self.product = Product.objects.create(
            name="Rolex Submariner",
            brand="Rolex",
            category="Luxury Watch",
            price=12000.00,
            quantity=5,
            description="A premium luxury watch",
            image="watches/test.jpg",  
            activity="active"
        )

    def test_product_creation(self):
        self.assertEqual(self.product.name, "Rolex Submariner")
        self.assertEqual(self.product.brand, "Rolex")
        self.assertEqual(self.product.activity, "active")

    def test_string_representation(self):
        
        self.assertEqual(
            str(self.product),
            "Rolex Submariner - Rolex"
        )
