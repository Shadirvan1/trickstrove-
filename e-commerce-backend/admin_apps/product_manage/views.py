from rest_framework.generics import ListCreateAPIView,RetrieveUpdateAPIView,CreateAPIView
from rest_framework.permissions import AllowAny
from rest_framework import views,status
from rest_framework.response import Response
from apps.product.models import Product
from apps.product.serializer import ProductSerializer
from .serializer import EditProductSerializer,CreateProductSerializer
from rest_framework.parsers import MultiPartParser, FormParser,JSONParser
from rest_framework.permissions import IsAdminUser


class GetAllProductApiView(ListCreateAPIView):
    permission_classes = [IsAdminUser]
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    
class GetOneProductApiview(RetrieveUpdateAPIView):
    permission_classes = [IsAdminUser]
    queryset =  Product.objects.all()
    lookup_field = 'pk'
    serializer_class = EditProductSerializer
    parser_classes = (MultiPartParser, FormParser,JSONParser)

class CreateProductApiView(views.APIView):
    permission_classes = [IsAdminUser]
    def post(self, request, *args, **kwargs):
        serializer = CreateProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Product created successfully", "product": serializer.data},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

