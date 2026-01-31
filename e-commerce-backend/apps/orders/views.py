from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from decimal import Decimal
from django.db import transaction
from .models import Order, OrderItem,OrderDelivery,OrderPayment
from apps.cart.models import CartItem
from .serializers import PlaceOrderSerializer
from apps.payment.models import Address
from rest_framework import generics,viewsets
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from .serializers import OrderSerializer

class PlaceOrderAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, version=None):
        serializer = PlaceOrderSerializer(
            data=request.data,
            context={"request": request}
        )
        serializer.is_valid(raise_exception=True)

        user = request.user
        address_id = serializer.validated_data["address_id"]
        payment_method = serializer.validated_data["payment_method"]

        cart_items = CartItem.objects.select_related("product").filter(user=user)
        if not cart_items.exists():
            return Response(
                {"detail": "Cart is empty"},
                status=status.HTTP_400_BAD_REQUEST
            )

        address = Address.objects.get(id=address_id)

        with transaction.atomic():

            order = Order.objects.create(
                user=user,
                total_price=Decimal("0.00")
            )

            total_amount = Decimal("0.00")

            for item in cart_items:
                subtotal = item.product.price * item.quantity

                order_item = OrderItem.objects.create(
                    order=order,
                    product=item.product,
                    product_name=item.product.name,
                    product_price=item.product.price,
                    quantity=item.quantity,
                    subtotal=subtotal,
                    address=address
                )

                OrderDelivery.objects.create(
                    order_item=order_item
                )

                OrderPayment.objects.create(
                    order_item=order_item,
                    payment_method=payment_method,
                    status="PENDING"
                )

                total_amount += subtotal

            total_amount *= Decimal("0.90")
            order.total_price = total_amount
            order.save()

            cart_items.delete()


        return Response(
            {
                "message": "Order placed successfully",
                "order_id": order.id,
                "total_amount": order.total_price,
                "payment_method": payment_method
            },
            status=status.HTTP_201_CREATED
        )

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer

    def get_queryset(self):
        user = self.request.user
        return (
            Order.objects
            .filter(user=user)
            .prefetch_related("items", "items__delivery", "items__payment")
            .order_by("-created_at")
        )

    @action(detail=True, methods=["patch"], url_path="cancel-item/(?P<item_id>[^/.]+)")
    def cancel(self, request, version, pk=None, item_id=None):

        order = get_object_or_404(self.get_queryset(), pk=pk)
        item = get_object_or_404(order.items, pk=item_id)

        if not hasattr(item, "delivery"):
            return Response(
                {"detail": "Delivery info not found"},
                status=status.HTTP_400_BAD_REQUEST
            )

        delivery = item.delivery

        if delivery.status in ["SHIPPED", "DELIVERED", "CANCELLED"]:
            return Response(
                {"detail": f"Cannot cancel item with status {delivery.status}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        delivery.status = "CANCELLED"
        delivery.save(update_fields=["status"])

        if hasattr(item, "payment"):
            payment = item.payment
            if payment.status == "PAID":
                payment.status = "REFUNDED"
                payment.save(update_fields=["status"])

        return Response(
            {"detail": "Item cancelled successfully"},
            status=status.HTTP_200_OK
        )