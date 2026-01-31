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


import hmac
import hashlib
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def verify_razorpay_payment(request, version=None):

    data = request.data

    razorpay_order_id = data.get("razorpay_order_id")
    razorpay_payment_id = data.get("razorpay_payment_id")
    razorpay_signature = data.get("razorpay_signature")
    order_item_id = data.get("order_item_id")

    generated_signature = hmac.new(
        settings.RAZORPAY_KEY_SECRET.encode(),
        f"{razorpay_order_id}|{razorpay_payment_id}".encode(),
        hashlib.sha256
    ).hexdigest()

    if generated_signature != razorpay_signature:
        return Response(
            {"detail": "Payment verification failed"},
            status=status.HTTP_400_BAD_REQUEST
        )

    payment = OrderPayment.objects.get(order_item_id=order_item_id)
    payment.status = "PAID"
    payment.razorpay_payment_id = razorpay_payment_id
    payment.save(update_fields=["status", "razorpay_payment_id"])

    return Response({"message": "Payment successful"})




class CreateRazorpayOrderAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, version=None):
        item_id = request.data.get("order_item_id")

        item = get_object_or_404(
            OrderItem,
            id=item_id,
            order__user=request.user
        )

        payment = item.payment

        if payment.status == "PAID":
            return Response(
                {"detail": "Payment already completed"},
                status=status.HTTP_400_BAD_REQUEST
            )

        amount = int(item.subtotal * Decimal("100"))  # paise

        razorpay_order = razorpay_client.order.create({
            "amount": amount,
            "currency": "INR",
            "payment_capture": 1
        })

        payment.razorpay_order_id = razorpay_order["id"]
        payment.save(update_fields=["razorpay_order_id"])

        return Response({
            "razorpay_order_id": razorpay_order["id"],
            "razorpay_key": settings.RAZORPAY_KEY_ID,
            "amount": amount,
            "currency": "INR",
            "product_name": item.product_name
        })


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