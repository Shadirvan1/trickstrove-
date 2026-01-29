from django.urls import path
from . import views
urlpatterns = [
    path('add/',views.AddItem.as_view()),
    path('minus/',views.MinusQuantityApiView.as_view()),
    path('addquantity/',views.AddQuantityApiView.as_view()),
    path('get/',views.GetCartApiView.as_view()),
    path('remove/',views.RemoveApiView.as_view()),
    
]
