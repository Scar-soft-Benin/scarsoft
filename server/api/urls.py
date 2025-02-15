from userauths import views as UserViews
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView


urlpatterns = [
    path('user/token/', UserViews.MyTokenObtainPairView.as_view()),
    path('user/token/refresh/', TokenRefreshView.as_view()),

    path('user/password-reset/<email>/', UserViews.PasswordRestEmailVerifyAPIView.as_view()),
    path('user/password-change/', UserViews.ChangePasswordAPIView.as_view()),
    path('user-list/', UserViews.UserListAPIView.as_view()),
    path('user-detail/', UserViews.UserDetailAPIView.as_view()),
    path('create-user/', UserViews.UserCreateAPIView.as_view()),
    
]
