from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/<str:version>/user/', include('apps.account.urls')),
    path('api/<str:version>/home/', include('apps.product.urls')),
    path('api/<str:version>/cart/', include('apps.cart.urls')),
    path('api/<str:version>/order/', include('apps.orders.urls')),
    path('api/<str:version>/payment/', include('apps.payment.urls')),
    path('api/<str:version>/admin/user/', include('admin_apps.account_manage.urls')),
    path('api/<str:version>/admin/product/', include('admin_apps.product_manage.urls')),
    path('api/<str:version>/admin/order/', include('admin_apps.order_manage.urls')),
    path('api/<str:version>/admin/dashboard/', include('admin_apps.dashboard.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
