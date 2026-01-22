from rest_framework import serializers
from .models import CartItem

from apps.product.serializer import ProductSerializer
from rest_framework import serializers
from .models import CartItem

class CartSerializer(serializers.ModelSerializer):

    class Meta:
        model = CartItem
        fields = ['product', 'quantity']

    def validate_quantity(self, value):
        if value < 1:
            raise serializers.ValidationError(
                "Please select quantity minimum 1"
            )
        return value

    def validate(self, data):
        product = data['product']
        quantity = data['quantity']

        if quantity > product.quantity:
            raise serializers.ValidationError({
                "quantity": ["Out of stock"]
            })

        return data

class GetCartSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    class Meta:
        model = CartItem
        fields = ['product','quantity']