from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import *


class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'full_name', 'email', 'role', 'is_active')
    ordering = ('date_joined',)
    filter_horizontal = ()
    list_filter = ()
    filter_horizontal = ('groups', 'user_permissions')


admin.site.register(User, CustomUserAdmin)