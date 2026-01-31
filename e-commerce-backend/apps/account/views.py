from rest_framework import views, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.utils.timezone import now

from .models import CoustomUser
from .serializers import (
    UserSerializer,
    LoginSerializer,
    OtpSerializer,
    ResendSerializer,
)
from .utils import generate_otp, send_otp_email


class RegisterApiView(views.APIView):
    permission_classes = [AllowAny]

    def post(self, request, version):
        serializer = UserSerializer(data=request.data)

        if serializer.is_valid():
            email = serializer.validated_data["email"]

            user = serializer.save()

            otp = generate_otp()
            user.otp = otp
            user.otp_created_at = now()
            user.save(update_fields=["otp", "otp_created_at"])

            if not send_otp_email(email, otp):
                return Response(
                    {"error": "OTP email failed to send"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )

            return Response(
                {"message": "Registration successful, OTP sent to email"},
                status=status.HTTP_201_CREATED,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class OtpApiView(views.APIView):
    permission_classes = [AllowAny]

    def post(self, request, version):
        serializer = OtpSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                {
                    "success": False,
                    "message": "OTP verification failed",
                    "errors": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = serializer.validated_data["user"]
        user.is_verified = True
        user.otp = None
        user.save(update_fields=["is_verified", "otp"])

        return Response(
            {"success": True, "message": "OTP verified successfully"},
            status=status.HTTP_200_OK,
        )


class OtpResentApiView(views.APIView):
    permission_classes = [AllowAny]

    def post(self, request, version):
        serializer = ResendSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                {
                    "success": False,
                    "message": "Failed to resend OTP",
                    "errors": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        email = serializer.validated_data["email"]
        user = CoustomUser.objects.get(email=email)

        otp = generate_otp()
        user.otp = otp
        user.otp_created_at = now()
        user.save(update_fields=["otp", "otp_created_at"])

        send_otp_email(email, otp)

        return Response(
            {"message": "OTP resent successfully"},
            status=status.HTTP_200_OK,
        )


class LoginApiView(views.APIView):
    permission_classes = [AllowAny]

    def post(self, request, version):
        serializer = LoginSerializer(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)

        return Response(
            {
                "message": "Login successfully completed",
                "user": serializer.validated_data,
            },
            status=status.HTTP_200_OK,
        )
