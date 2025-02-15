from rest_framework import permissions

from rest_framework.permissions import BasePermission

from .models import User

class IsAdminOrManager(BasePermission):
    """
    Autorise l'Admin à tout faire et limite les actions du Manager.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and (
            request.user.role == User.ADMIN or request.user.role == User.MANAGER
        )


class CanAddRrecruitmentPermission(permissions.BasePermission):
    """ Nous vérifions si l'utilisateur a le droit d'ajouter des recrutements"""
    def has_permission(self, request, view):
        return request.user.has_perm('auth.add_recruitment')