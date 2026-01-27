from django.shortcuts import render
from rest_framework import viewsets,generics,views,status
from apps.account.models import CoustomUser
from .serializer import Account_manageSerializer
from rest_framework.permissions import IsAdminUser
from rest_framework.decorators import action
from .serializer import UserOrderSerializer
from apps.orders.models import Order,OrderItem
from apps.orders.serializers import OrderItemSerializer
from rest_framework.response import Response
# Create your views here.

class UserFetchApiView(viewsets.ModelViewSet):
    permission_classes = [IsAdminUser]
    queryset = CoustomUser.objects.all()
    serializer_class = Account_manageSerializer

    @action(detail=True,methods=['get'])
    def orders(self,request,version,pk=None):
        user = self.get_object()
        
       
        orders = OrderItem.objects.filter(order__user=user)
        serializer = OrderItemSerializer(orders,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)
    @action(detail=True,methods=['patch'])
    def togleuser(self,request,version,pk=None):
        user = self.get_object()
        if user.id == request.user.id:
            return Response({"errors":"You can't toggle your own active"},status=status.HTTP_403_FORBIDDEN)
        user.is_active = not user.is_active
        user.save()
        return Response({"message":"Toggeld user activity"},status=status.HTTP_200_OK)
    