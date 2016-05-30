from rest_framework import generics, permissions
from .serializers import UserSerializer, UserDetailSerializer, UserPostSerializer, PostSerializer
from django.contrib.auth.models import User
from .models import Post
from rest_framework.authentication import TokenAuthentication
from .permissions import UserSafePermission


class UserList(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [
        permissions.AllowAny
    ]


class UserDetail(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserDetailSerializer
    lookup_field = 'username'
    permission_classes = [
        UserSafePermission
    ]
    authentication_classes = [
        TokenAuthentication
    ]


class UserPostList(generics.ListCreateAPIView):
    serializer_class = UserPostSerializer
    permission_classes = [
        UserSafePermission
    ]
    authentication_classes = [
        TokenAuthentication
    ]

    def get_queryset(self):
        user = self.request.user
        return user.posts.all().order_by('-created_at')


class PostList(generics.ListAPIView):
    queryset = Post.objects.all().order_by('-created_at')
    serializer_class = PostSerializer
    permission_classes = [
        permissions.AllowAny
    ]

