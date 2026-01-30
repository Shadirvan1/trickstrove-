from django.test import TestCase
from django.db import IntegrityError
from apps.account.models import CoustomUser
from apps.product.models import Product
from apps.cart.models import CartItem


class CartItemModelTest(TestCase):

    def setUp(self):
        self.user = CoustomUser.objects.create_user(
            password="test123",
            username="cartuser"
        )

        self.product = Product.objects.create(
            name="Apple Watch",
            brand="Apple",
            category="Smart Watch",
            price=500,
            quantity=20,
            description="Smart watch",
            image="watches/test.jpg"
        )

        self.cart_item = CartItem.objects.create(
            user=self.user,
            product=self.product,
            quantity=2
        )

    # ---------------- BASIC CREATION ----------------

    def test_cart_item_creation(self):
        self.assertEqual(self.cart_item.user, self.user)
        self.assertEqual(self.cart_item.product, self.product)
        self.assertEqual(self.cart_item.quantity, 2)

    # ---------------- STRING METHOD ----------------

    def test_string_representation(self):
        self.assertEqual(
            str(self.cart_item),
            "cartuser - Apple Watch"
        )

    # ---------------- UNIQUE CONSTRAINT ----------------

    def test_unique_cart_item_per_user_product(self):
        """Same user cannot add same product twice"""
        with self.assertRaises(IntegrityError):
            CartItem.objects.create(
                user=self.user,
                product=self.product,
                quantity=1
            )

    # ---------------- RELATIONSHIPS ----------------

    def test_user_cart_items(self):
        self.assertEqual(self.user.cart_items.count(), 1)

    def test_product_cart_items(self):
        self.assertEqual(self.product.cart_items.count(), 1)
