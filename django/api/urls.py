from django.urls import path, include
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register('users', views.UserViewSet, 'user')
router.register('favorite-coins', views.FavoriteCoinViewSet, 'favorite-coins')
router.register('account', views.AccountViewSet, 'account')
router.register('order', views.OrderViewSet, 'order')

urlpatterns = [
    path('', include(router.urls)),
    path('o/', include('oauth2_provider.urls', namespace='oauth2_provider')),
    path('oauth2-info/', views.AuthInfo.as_view()),
    path('balance', views.BalanceViewSet.as_view()),
    path('/chat', views.lobby)
]