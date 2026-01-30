from django.urls import path,include
from . import views
from rest_framework.routers import DefaultRouter
router = DefaultRouter()
router.register('orders',views.OrderViewSet , basename='orders')
urlpatterns = [
    path('place/',views.PlaceOrderAPIView.as_view()),

    path('',include(router.urls)),
]
