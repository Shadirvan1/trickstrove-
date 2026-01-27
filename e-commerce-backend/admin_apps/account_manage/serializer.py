from rest_framework import serializers
from apps.account.models import CoustomUser
from apps.orders.models import Order
from apps.orders.serializers import OrderItemSerializer,OrderSerializer,OrderPaymentSerializer,OrderDeliverySerializer

class Account_manageSerializer(serializers.ModelSerializer):
    class Meta:
        model = CoustomUser
        fields = "__all__"

class UserOrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True,read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "status",
            "total_price",
            "created_at",
            "items"
            ]
        

