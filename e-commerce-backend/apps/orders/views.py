from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from decimal import Decimal

from .models import Order, OrderItem
from apps.cart.models import CartItem
from .serializers import PlaceOrderSerializer
from apps.payment.models import Address
from rest_framework import generics,viewsets

from rest_framework.decorators import action

from .serializers import OrderSerializer

class PlaceOrderAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request,version):
        serializer = PlaceOrderSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)

        user = request.user
        address_id = serializer.validated_data["address_id"]
        payment_method = serializer.validated_data["payment_method"]

        cart_items = CartItem.objects.filter(user=user)
        if not cart_items.exists():
            return Response({"detail": "Cart is empty"}, status=status.HTTP_400_BAD_REQUEST)

        order = Order.objects.create(
            user=user,
            status="PAID" if payment_method != "COD" else "PENDING",
            total_price=0
        )

        total = Decimal("0.00")
        address = Address.objects.get(id=address_id)

        
        for item in cart_items:
            subtotal = item.product.price * item.quantity

            OrderItem.objects.create(
                order=order,
                product=item.product,
                product_name=item.product.name,
                product_price=item.product.price,
                quantity=item.quantity,
                subtotal=subtotal,
                address=address
            )

            total += subtotal

        total = total * Decimal("0.9")
        order.total_price = total
        order.save()

        cart_items.delete()

        return Response({
            "message": "Order placed successfully",
            "order_id": order.id,
            "total": total
        }, status=status.HTTP_201_CREATED)



class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by("-created_at")
        

    @action(detail=True, methods=["patch"])
    def cancel(self, request,version, pk=None):
        try:
            order = self.get_queryset().get(pk=pk)
        except Order.DoesNotExist:
            return Response({"detail": "Order not found"}, status=status.HTTP_404_NOT_FOUND)

        if order.status in ["SHIPPED", "DELIVERED", "CANCELLED"]:
            return Response(
                {"detail": f"Cannot cancel order with status {order.status}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        order.status = "CANCELLED"
        order.save()

        return Response({"detail": "Order canceled successfully"}, status=status.HTTP_200_OK)
