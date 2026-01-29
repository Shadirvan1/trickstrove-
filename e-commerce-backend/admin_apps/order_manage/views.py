from django.shortcuts import render
from rest_framework import generics,views
from rest_framework.response import Response
from apps.orders.models import OrderItem
from apps.orders.serializers import OrderItemSerializer
from .serializer import DeliveryStatusSerializer
from apps.orders.models import OrderDelivery
from rest_framework import status
from rest_framework.permissions import IsAdminUser

# Create your views here.

class GetOrdersApiView(generics.ListAPIView):
    permission_classes = [IsAdminUser]
    def get_queryset(self):
        return OrderItem.objects.all()
    serializer_class = OrderItemSerializer
    
class OrdersApiView(views.APIView):
    permission_classes = [IsAdminUser]
    def patch(self,request,version,pk=None):
        serializer = DeliveryStatusSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        delivery_id = serializer.validated_data['delivery_id']
        delivevry_status = serializer.validated_data['status']
        OrderDelivery.objects.filter(id = delivery_id).update(status=delivevry_status)
        return Response({"message":"Updated successfully"},status=status.HTTP_200_OK)