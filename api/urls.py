# from auths import views as UserViews
# from django.urls import path
# from rest_framework_simplejwt.views import TokenRefreshView


# urlpatterns = [
#     # user urls
#     path('user/token/', UserViews.MyTokenObtainPairView.as_view()),
#     path('user/token/refresh/', TokenRefreshView.as_view()),

#     path('user/password-reset/<email>/', UserViews.PasswordRestEmailVerifyAPIView.as_view()),
#     path('user/password-change/', UserViews.ChangePasswordAPIView.as_view()),
#     path('user-list/', UserViews.UserListAPIView.as_view()),
#     path('user-detail/', UserViews.UserDetailAPIView.as_view()),
#     path('create-user/', UserViews.UserCreateAPIView.as_view()),
    
#     # 
    
# ]

from auths import views as UserViews
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView


urlpatterns = [
    # user urls
    path('auth/login/', UserViews.MyTokenObtainPairView.as_view()),
    path('auth/token/refresh/', TokenRefreshView.as_view()),

    path('auth/reset-password/', UserViews.PasswordRestEmailVerifyAPIView.as_view()),
    path('auth/change-password/', UserViews.ChangePasswordAPIView.as_view()),
    path('users', UserViews.UserListAPIView.as_view()),
    path('users/{id}', UserViews.UserDetailAPIView.as_view()),
    path('users/create', UserViews.UserCreateAPIView.as_view()),
    
    # 
    
]
