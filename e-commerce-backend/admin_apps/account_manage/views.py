from django.shortcuts import render
from rest_framework import viewsets,generics,views
from apps.account.models import CoustomUser
from .serializer import Account_manageSerializer
from rest_framework.permissions import IsAdminUser
# Create your views here.

class UserFetchApiView(viewsets.ModelViewSet):
    permission_classes = [IsAdminUser]
    queryset =  CoustomUser.objects.all()
    serializer_class = Account_manageSerializer
