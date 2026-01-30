from django.test import TestCase
from apps.account.models import CoustomUser
from apps.product.models import Product
from apps.payment.models import Address
from apps.orders.models import (
    Order,
    OrderItem,
    OrderDelivery,
    OrderPayment
)


class OrderModelsTest(TestCase):

    def setUp(self):
        
        self.user = CoustomUser.objects.create_user(
            username="order",
            password="test123"
        )

       
        self.product = Product.objects.create(
            name="Rolex Submariner",
            brand="Rolex",
            category="Luxury",
            price=10000,
            quantity=10,
            description="Luxury Watch",
            image="watches/test.jpg"
        )

        
        self.address = Address.objects.create(
            user=self.user,
            full_name="John Doe",
            phone="9999999999",
            address="123 Street",
            pincode="560001"
        )

      
        self.order = Order.objects.create(
            user=self.user,
            total_price=10000
        )

        
        self.order_item = OrderItem.objects.create(
            order=self.order,
            product=self.product,
            address=self.address,
            product_name=self.product.name,
            product_price=self.product.price,
            quantity=1,
            subtotal=10000
        )

        
        self.delivery = OrderDelivery.objects.create(
            order_item=self.order_item
        )

       
        self.payment = OrderPayment.objects.create(
            order_item=self.order_item
        )

    # ---------------- ORDER ----------------

    def test_order_creation(self):
        self.assertEqual(self.order.user, self.user)
        self.assertEqual(self.order.total_price, 10000)

    def test_order_string(self):
        self.assertEqual(str(self.order), f"Order #{self.order.id}")

    def test_user_has_orders(self):
        self.assertEqual(self.user.orders.count(), 1)

    # ---------------- ORDER ITEM ----------------

    def test_order_item_creation(self):
        self.assertEqual(self.order_item.order, self.order)
        self.assertEqual(self.order_item.product, self.product)
        self.assertEqual(self.order_item.quantity, 1)
        self.assertEqual(self.order_item.subtotal, 10000)

    def test_order_has_items(self):
        self.assertEqual(self.order.items.count(), 1)

    def test_order_item_string(self):
        self.assertEqual(str(self.order_item), "Rolex Submariner")

    # ---------------- DELIVERY ----------------

    def test_delivery_creation(self):
        self.assertEqual(self.delivery.order_item, self.order_item)
        self.assertEqual(self.delivery.status, "PENDING")

    def test_delivery_string(self):
        self.assertEqual(
            str(self.delivery),
            "Rolex Submariner | PENDING"
        )

    # ---------------- PAYMENT ----------------

    def test_payment_creation(self):
        self.assertEqual(self.payment.order_item, self.order_item)
        self.assertEqual(self.payment.status, "PENDING")
        self.assertEqual(self.payment.payment_method, "COD")

    def test_payment_string(self):
        self.assertEqual(
            str(self.payment),
            "Rolex Submariner | PENDING"
        )
