from rest_framework import serializers
from apps.product.models import Product

class EditProductSerializer(serializers.ModelSerializer):
   
    class Meta:
        model = Product
        fields = "__all__"
        

class CreateProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = "__all__"
        


