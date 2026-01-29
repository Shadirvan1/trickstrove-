from django.urls import path,include
from . import views
from rest_framework_simplejwt.views import TokenRefreshView
urlpatterns = [
    path('register/',views.RegisterApiView.as_view(),name='register'),
    path('login/',views.LoginApiView.as_view(),name='login'),
    path('otp-verification/',views.OtpApiView.as_view(),name='otp'),
    path('otp-resend/',views.OtpResentApiView.as_view(),name='otp_resend'),
    path("token/refresh/",TokenRefreshView.as_view(),name='token_refresh')
]
