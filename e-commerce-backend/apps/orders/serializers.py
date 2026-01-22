from rest_framework import serializers
from apps.payment.models import Address
from rest_framework import serializers
from .models import Order, OrderItem
from apps.product.models import Product

class PlaceOrderSerializer(serializers.Serializer):
    address_id = serializers.IntegerField()
    payment_method = serializers.ChoiceField(choices=["UPI", "CARD", "COD"])

    def validate_address_id(self, value):
        user = self.context['request'].user
        if not Address.objects.filter(id=value, user=user).exists():
            raise serializers.ValidationError("Invalid address")
        return value



class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)
    product_image = serializers.ImageField(source="product.image", read_only=True)
    product_category = serializers.CharField(source="product.category", read_only=True)
    
    class Meta:
        model = OrderItem
        fields = [
            "id",
            "product_name",
            "product_image",
            "product_category",
            "product_price",
            "quantity",
            "subtotal"
        ]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "status",
            "total_price",
            "created_at",
            "items"
        ]

