
from rest_framework import generics, permissions
from django.contrib.auth.models import Permission
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from .serializers import UserSerializer, MyTokenObtainPairSerialiser, UserProfileSerializer
from django.shortcuts import render
from .permissions import CanAddRrecruitmentPermission, IsAdminOrManager

from django.contrib.auth.hashers import check_password
from .utils import send_otp_email

User = get_user_model()


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerialiser


class UserCreateAPIView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser, CanAddRrecruitmentPermission]

    def perform_create(self, serializer):
        user = serializer.save()

        # Attribution des permissions dynamiques
        if user.role == User.MANAGER:
            if self.request.data.get('add_recruitment'):
                permission = Permission.objects.get(codename='add_recruit')
                user.user_permissions.add(permission)

            user.save()


class UserListAPIView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]


class UserDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]



class PasswordRestEmailVerifyAPIView(generics.RetrieveAPIView):
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer

    def get_object(self):
        email = self.kwargs['email']
        user = User.objects.filter(email=email).first()

        if user:
            link = send_otp_email(
                user=user,
                otp_type="create-new-password",
                template_name="password_reset",
                subject="Password Reset Request"
            )
            print("Password Reset Link:", link)
        return user


class ChangePasswordAPIView(generics.CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        user_id = request.data.get('user_id')
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')

        if not user_id:
            return Response({"message": "User ID is missing.", "icon": "error"}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.get(id=user_id)
        if user is not None:
            if check_password(old_password, user.password):
                user.set_password(new_password)
                user.save()
                return Response({"message": "Password changed successfully", "icon": "success"})
            else:
                return Response({"message": "Old password is incorrect", "icon": "warning"})
        else:
            return Response({"message": "User does not exists", "icon": "error"})
