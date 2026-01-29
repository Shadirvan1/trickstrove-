from django.urls import path,include
from . import views

urlpatterns = [
    path("getorders/",views.GetOrdersApiView.as_view()),
    path("update/<int:pk>/",views.OrdersApiView.as_view())
]
