from django.conf.urls import url, include
from .api import UserDetail, UserList
from .api import PostList, UserPostList
from rest_framework.authtoken import views

user_urls = [
    url(r'^[\/](?P<username>[0-9a-zA-Z_-]+)/posts$', UserPostList.as_view(), name='userpost-list'),
    url(r'^[\/](?P<username>[0-9a-zA-Z_-]+)$', UserDetail.as_view(), name='user-detail'),
    url(r'^$', UserList.as_view(), name='user-list')
]

post_urls = [
    url(r'^$', PostList.as_view(), name='post-list')
]

urlpatterns = [
    url(r'^users', include(user_urls)),
    url(r'^posts', include(post_urls)),
    url(r'^login', views.obtain_auth_token),
]
