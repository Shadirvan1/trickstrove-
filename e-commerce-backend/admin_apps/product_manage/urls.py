from django.urls import path
from . import views

urlpatterns = [
    path("products/", views.GetAllProductApiView.as_view(), name="all-products"),
    path("products/<int:pk>/", views.GetOneProductApiview.as_view(), name="one-products"),
    path("createproduct/", views.CreateProductApiView.as_view()),
]
