from django.urls import path
from . import views
urlpatterns = [
    path('products/',views.HomeApiView.as_view()),
    path('products/<int:pk>/',views.SingleProductApiView.as_view()),
]
