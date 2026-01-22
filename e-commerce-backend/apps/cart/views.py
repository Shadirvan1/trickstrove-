from rest_framework.views import APIView
from rest_framework import status,generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from apps.account.models import CoustomUser
from .models import CartItem
from .serializer import CartSerializer,GetCartSerializer
from django.db.models import Q,F
class AddItem(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, version=None):
        serializer = CartSerializer(data=request.data,context={'request': request})
        serializer.is_valid(raise_exception=True)

        product = serializer.validated_data['product']
        quantity = serializer.validated_data['quantity']

        cart_item, created = CartItem.objects.get_or_create(
            user=request.user,
            product=product,
        )

        if created:
            cart_item.quantity = quantity
        else:
            cart_item.quantity += quantity

        cart_item.save()

        return Response(
            {
                'message': 'Product added to cart',
                'product': product.name,
                'quantity': cart_item.quantity
            },
            status=status.HTTP_200_OK
        )
class GetCartApiView(generics.ListAPIView):
    serializer_class = GetCartSerializer
    def get_queryset(self):
        return CartItem.objects.filter(user=self.request.user).select_related('product')
    

class MinusQuantityApiView(APIView):
    def post(self,request,version):
        serializer = CartSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        product = serializer.validated_data['product']
        CartItem.objects.filter(Q(user=request.user) & Q(product=product)).update(quantity = F("quantity")-1)
        CartItem.objects.filter(Q(user=request.user) & Q(quantity__lte = 0)).delete()
        return Response({"message":'Minus successfully'},status = status.HTTP_200_OK)
        
class AddQuantityApiView(APIView):
    def post(self,request,version):
        serializer = CartSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        product = serializer.validated_data['product']
        CartItem.objects.filter(Q(user=request.user) & Q(product=product)).update(quantity = F("quantity")+1)
        return Response({"message":'added successfully'},status = status.HTTP_200_OK)
class RemoveApiView(APIView):
    def post(self,request,version):
        serializer = CartSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        product = serializer.validated_data['product']
        CartItem.objects.filter(product=product,user=request.user).delete()
        return Response({'message':"deleted successfully"},status=status.HTTP_204_NO_CONTENT)
    