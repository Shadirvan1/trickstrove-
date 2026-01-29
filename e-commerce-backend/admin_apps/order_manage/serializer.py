
from rest_framework import serializers

class DeliveryStatusSerializer(serializers.Serializer):
    status = serializers.CharField()
    delivery_id = serializers.IntegerField()

      
