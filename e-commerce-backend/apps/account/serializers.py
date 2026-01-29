from rest_framework import serializers
from .models import CoustomUser
from django.contrib.auth import authenticate
from django.utils.timezone import now
from datetime import timedelta
from rest_framework_simplejwt.tokens import RefreshToken


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = CoustomUser
        fields = ['username', 'email', 'password', 'password2', 'phone_number']

    def validate_phone_number(self, value):
        if len(value) < 6 or len(value) > 15:
            raise serializers.ValidationError("Give a correct number")
        return value

    def validate_password(self, value):
        if len(value) < 4 or len(value) > 24:
            raise serializers.ValidationError("Password must be 4–24 characters")
        if value == "1234":
            raise serializers.ValidationError("You can't set 1234 as password")
        return value

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({'password': "Passwords do not match"})
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        password = validated_data.pop('password')
        user = CoustomUser(**validated_data)
        user.set_password(password)
        user.save()
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(
            request=self.context.get('request'),
            username=data.get('username'),
            password=data.get('password')
        )

        if not user:
            raise serializers.ValidationError({'non_field_errors': ['Invalid username or password']})
        if not user.is_verified:
            raise serializers.ValidationError({'non_field_errors': ['First please verify email']})

        refresh = RefreshToken.for_user(user)

        return {
            'user_id': user.id,
            'email': user.email,
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'isAdmin': user.is_staff
        }


class OtpSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)

    def validate(self, data):
        email = data.get('email')
        otp = data.get('otp')

        try:
            user = CoustomUser.objects.get(email=email)
        except CoustomUser.DoesNotExist:
            raise serializers.ValidationError({'email': ['Please register first']})

        if not user.otp:
            raise serializers.ValidationError({'otp': ['Please resend OTP']})

        if not user.otp_created_at or now() > user.otp_created_at + timedelta(minutes=5):
            raise serializers.ValidationError({'otp': ['OTP expired']})

        if otp != user.otp:
            raise serializers.ValidationError({'otp': ['Invalid OTP']})

        data['user'] = user
        return data


class ResendSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        try:
            user = CoustomUser.objects.get(email=value)
        except CoustomUser.DoesNotExist:
            raise serializers.ValidationError("Invalid email")

        if user.is_verified:
            raise serializers.ValidationError("User already verified")

        return value
