from django.db import models
from apps.product.models import Product
from apps.account.models import CoustomUser
from apps.payment.models import Address

class Order(models.Model):
    user = models.ForeignKey(
        CoustomUser,
        on_delete=models.CASCADE,
        related_name="orders"
    )
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order #{self.id}"

class OrderItem(models.Model):
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name="items"
    )

    product = models.ForeignKey(
        Product,
        on_delete=models.PROTECT
    )

    address = models.ForeignKey(
        Address,
        on_delete=models.PROTECT,
        null=True,
        blank=True

    )

    product_name = models.CharField(max_length=255)
    product_price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField()
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)

    created_at = models.DateTimeField(auto_now_add=True,null=True,blank=True)
    updated_at = models.DateTimeField(auto_now=True,null=True,blank=True)

    def __str__(self):
        return self.product_name




class OrderDelivery(models.Model):

    DELIVERY_STATUS_CHOICES = [
        ("PENDING", "Pending"),
        ("SHIPPED", "Shipped"),
        ("DELIVERED", "Delivered"),
        ("CANCELLED", "Cancelled"),
    ]

    order_item = models.OneToOneField(
        OrderItem,
        on_delete=models.CASCADE,
        related_name="delivery"
    )

    status = models.CharField(
        max_length=20,
        choices=DELIVERY_STATUS_CHOICES,
        default="PENDING"
    )

    tracking_id = models.CharField(
        max_length=100,
        null=True,
        blank=True
    )

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.order_item.product_name} | {self.status}"


class OrderPayment(models.Model):

    PAYMENT_STATUS_CHOICES = [
        ("PENDING", "Pending"),
        ("PAID", "Paid"),
        ("REFUNDED", "Refunded"),
    ]
    PAYMENT_METHOD_CHOICES = [
        ("COD", "Cash On Delivery"),
        ("UPI", "UPI"),
        ("CARD", "Credit / Debit Card"),
        ("NETBANKING", "Net Banking"),
        ("WALLET", "Wallet"),
    ]

    order_item = models.OneToOneField(
        OrderItem,
        on_delete=models.CASCADE,
        related_name="payment"
    )

    status = models.CharField(
        max_length=20,
        choices=PAYMENT_STATUS_CHOICES,
        default="PENDING"
    )
    payment_method = models.CharField(
        max_length=35,
        choices = PAYMENT_METHOD_CHOICES,
        default="COD"
    )
    razorpay_order_id = models.CharField(
        max_length=100, null=True, blank=True
    )
    razorpay_payment_id = models.CharField(
        max_length=100, null=True, blank=True
    )

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.order_item.product_name} | {self.status}"

