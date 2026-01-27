from django.shortcuts import render
from rest_framework import generics,status,mixins,views
from rest_framework.response import Response
from .models import CoustomUser
from .serializers import UserSerializer,LoginSerializer,OtpSerializer,ResendSerializer
from django.contrib.auth import authenticate,login,logout
from django.core.mail import send_mail
from django.conf import settings
import random
from .utils import generate_otp,sent_otp_email
from django.utils.timezone import now
from datetime import timedelta
from rest_framework.permissions import AllowAny
# Create your views here.

class RegisterApiView(views.APIView):
    permission_classes = [AllowAny]
    def post(self,request,version):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            print(email)
            #smtp for user
            user = serializer.save()
            otp = RandoOtp()
            user.otp = otp
            user.otp_created_at = now()
            user.save(update_fields=['otp','otp_created_at'])
            sent_otp_email(email,otp)
            return Response({'message':'Registration successful,OTP sent to your email address'},status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
        
def RandoOtp():
    return str(random.randint(100000,999999))

class OtpApiView(views.APIView):
    permission_classes = [AllowAny]
    def post(self, request, version):
        serializer = OtpSerializer(data=request.data)

        if not serializer.is_valid():
            return Response({
                "success": False,
                "message": "OTP verification failed",
                "errors": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        user = serializer.validated_data['user']
        user.is_verified = True
        user.otp = None
        user.save(update_fields=['is_verified', 'otp'])

        return Response({
            "success": True,
            "message": "OTP verified successfully"
        }, status=status.HTTP_200_OK)
class OtpResentApiView(views.APIView):
    permission_classes = [AllowAny]
    def post(self, request, version):
        serializer = ResendSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({'success':False,'message':'Failed to resend OTP ','errors':serializer.errors},status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data["email"]
        user = CoustomUser.objects.get(email=email)

        otp = generate_otp()

        user.otp = otp                
        user.otp_created_at = now()
        user.save(update_fields=["otp", "otp_created_at"])

        sent_otp_email(email, otp)

        return Response(
            {"message": "OTP resent successfully"},
            status=status.HTTP_200_OK,
        )
class LoginApiView(views.APIView):
    permission_classes = [AllowAny]

    def post(self,request,version):
        print("POST HIT")
     
        serializer = LoginSerializer(data=request.data,context={'request': request})
        serializer.is_valid(raise_exception=True)
        return Response({'message':'Login successfully completed','user':serializer.validated_data},
            
            status=status.HTTP_200_OK
        )
        # return Response({'message':'Failed to login','errors':serializer.errors},status=status.HTTP_400_BAD_REQUEST)
