from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework.filters import OrderingFilter, SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from .models import Product
from .serializer import ProductSerializer
from .filters import ProductFilter

class HomeApiView(generics.ListCreateAPIView):
    permission_classes = [AllowAny]
    queryset = Product.objects.filter(activity="active")
    serializer_class = ProductSerializer

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = ProductFilter
    search_fields = ["name", "description", "brand", "category"]
    ordering_fields = ["price"] 

class SingleProductApiView(generics.RetrieveAPIView):
    permission_classes = [AllowAny]
    queryset = Product.objects.filter(activity="active")
    serializer_class = ProductSerializer
    lookup_field = 'pk'
