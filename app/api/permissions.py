from rest_framework import permissions


class UserSafePermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated() and view.kwargs['username'] == request.user.username

