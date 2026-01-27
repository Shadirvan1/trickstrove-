from django.urls import path,include
from . import views
from rest_framework.routers import DefaultRouter
router = DefaultRouter()
router.register("users",views.UserFetchApiView,basename='account_manager')

urlpatterns = [

    path("",include(router.urls)),

]
