from django.shortcuts import render
from rest_framework import views
from apps.product.models import Product
from django.db.models import Count,Sum
from apps.orders.models import OrderDelivery,Order,OrderItem
from rest_framework.response import Response
from apps.account.models import CoustomUser
from rest_framework.permissions import IsAdminUser

# Create your views here.

class DashBoardDataApiView(views.APIView):
    permission_classes = [IsAdminUser]
    def get(sel,request,version ):
        total_products = Product.objects.aggregate(total_products = Count("id"))
        orders = OrderDelivery.objects.values('status').annotate(product_count=Count('id'))
        overall_orders = OrderDelivery.objects.aggregate(overall_orders = Count("id"))
        total_revenue = OrderDelivery.objects.filter(status = "DELIVERED").aggregate(total_revenue=Sum('order_item__product_price'))
        pending_revenue = OrderDelivery.objects.exclude(status ="DELIVERED").aggregate(pending_revenue=Sum("order_item__product_price"))
        total_users = CoustomUser.objects.aggregate(total_users=Count("id"))
        
        return Response({"total_products":total_products["total_products"],
                         "order_details":orders,
                         "overall_orders":overall_orders["overall_orders"],
                         "total_revenue":total_revenue["total_revenue"],
                         "pending_revenue":pending_revenue["pending_revenue"],
                         "total_users":total_users["total_users"],
                         

                         
                         })