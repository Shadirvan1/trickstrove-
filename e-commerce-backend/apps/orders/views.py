from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status, viewsets
from decimal import Decimal
from django.db import transaction
from django.shortcuts import get_object_or_404
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes, action

from .models import Order, OrderItem, OrderDelivery, OrderPayment
from .serializers import PlaceOrderSerializer, OrderSerializer
from apps.cart.models import CartItem
from apps.payment.models import Address
from .utils import razorpay_client

import hmac
import hashlib



@csrf_exempt
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def verify_razorpay_payment(request, version=None):

    data = request.data
    order_item_id = data.get("order_item_id")
    razorpay_payment_id = data.get("razorpay_payment_id")
    razorpay_signature = data.get("razorpay_signature")

    payment = get_object_or_404(
        OrderPayment,
        order_item_id=order_item_id,
        order_item__order__user=request.user
    )

    if payment.status == "PAID":
        return Response({"detail": "Payment already verified"})

    razorpay_order_id = payment.razorpay_order_id

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

    payment.status = "PAID"
    payment.razorpay_payment_id = razorpay_payment_id
    payment.save(update_fields=["status", "razorpay_payment_id"])

    return Response({"message": "Payment successful"}, status=status.HTTP_200_OK)



class CreateRazorpayOrderAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, version=None):
        item_id = request.data.get("order_item_id")

        order_item = get_object_or_404(
            OrderItem,
            id=item_id,
            order__user=request.user
        )

        payment = order_item.payment

        if payment.status == "PAID":
            return Response(
                {"detail": "Payment already completed"},
                status=status.HTTP_400_BAD_REQUEST
            )

        amount = int(order_item.subtotal * Decimal("100"))  

        razorpay_order = razorpay_client.order.create({
            "amount": amount,
            "currency": "INR",
            "payment_capture": 1,
            "receipt": f"order_item_{order_item.id}"
        })

        payment.razorpay_order_id = razorpay_order["id"]
        payment.save(update_fields=["razorpay_order_id"])

        return Response({
            "razorpay_order_id": razorpay_order["id"],
            "razorpay_key": settings.RAZORPAY_KEY_ID,
            "amount": amount,
            "currency": "INR",
            "product_name": order_item.product_name
        }, status=status.HTTP_200_OK)


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

        address = get_object_or_404(Address, id=address_id, user=user)

        with transaction.atomic():
            order = Order.objects.create(
                user=user,
                total_price=Decimal("0.00")
            )

            total_amount = Decimal("0.00")

            for cart_item in cart_items:
                subtotal = cart_item.product.price * cart_item.quantity

                order_item = OrderItem.objects.create(
                    order=order,
                    product=cart_item.product,
                    product_name=cart_item.product.name,
                    product_price=cart_item.product.price,
                    quantity=cart_item.quantity,
                    subtotal=subtotal,
                    address=address
                )

                OrderDelivery.objects.create(order_item=order_item)

                OrderPayment.objects.create(
                    order_item=order_item,
                    payment_method=payment_method,
                    status="PENDING"
                )

                total_amount += subtotal

            # Apply 10% discount
            order.total_price = total_amount * Decimal("0.90")
            order.save(update_fields=["total_price"])

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
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (
            Order.objects
            .filter(user=self.request.user)
            .prefetch_related("items", "items__delivery", "items__payment")
            .order_by("-created_at")
        )

    @action(detail=True, methods=["patch"], url_path="cancel-item/(?P<item_id>[^/.]+)")
    def cancel(self, request, version=None, pk=None, item_id=None):

        order = get_object_or_404(self.get_queryset(), pk=pk)
        item = get_object_or_404(order.items, pk=item_id)

        delivery = getattr(item, "delivery", None)
        if not delivery:
            return Response(
                {"detail": "Delivery info not found"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if delivery.status in ["SHIPPED", "DELIVERED", "CANCELLED"]:
            return Response(
                {"detail": f"Cannot cancel item with status {delivery.status}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        delivery.status = "CANCELLED"
        delivery.save(update_fields=["status"])

        payment = getattr(item, "payment", None)
        if payment and payment.status == "PAID":
            payment.status = "REFUNDED"
            payment.save(update_fields=["status"])

        return Response(
            {"detail": "Item cancelled successfully"},
            status=status.HTTP_200_OK
        )
