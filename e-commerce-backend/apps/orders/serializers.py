from rest_framework import serializers
from apps.payment.models import Address
from .models import OrderPayment
from .models import OrderDelivery
from rest_framework import serializers
from .models import Order, OrderItem
from apps.product.models import Product
from .models import Order
from apps.payment.serializer import AddressSerializer
class PlaceOrderSerializer(serializers.Serializer):
    address_id = serializers.IntegerField()
    payment_method = serializers.ChoiceField(choices=["UPI", "CARD", "COD"])

    def validate_address_id(self, value):
        user = self.context['request'].user
        if not Address.objects.filter(id=value, user=user).exists():
            raise serializers.ValidationError("Invalid address")
        return value


class OrderPaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderPayment
        fields = [
            "status",
            "updated_at"
        ]


class OrderDeliverySerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderDelivery
        fields = [
            'id',
            "status",
            "tracking_id"
        ]
from .models import OrderItem

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)
    product_image = serializers.ImageField(source="product.image", read_only=True)
    product_category = serializers.CharField(source="product.category.name", read_only=True)

    payment = OrderPaymentSerializer(read_only=True)
    delivery = OrderDeliverySerializer(read_only=True)

    address = AddressSerializer(read_only=True)

    class Meta:
        model = OrderItem
        fields = [
            "id",
            "product_name",
            "product_image",
            "product_category",
            "product_price",
            "quantity",
            "subtotal",
            "address",
            "payment",
            "delivery",
            "created_at"
        ]



class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user = serializers.StringRelatedField()

    class Meta:
        model = Order
        fields = [
            "id",
            "user",
            "total_price",
            "created_at",
            "items"
        ]
