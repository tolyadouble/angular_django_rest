import unittest
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from django.test import Client
from app.api.models import Post
from rest_framework import status
from django.core.urlresolvers import reverse_lazy
import collections


class TestUserPostList(unittest.TestCase):

    def setUp(self):
        self.user = User.objects.create_user('test')
        self.token = Token.objects.get(user=self.user).key

        Post.objects.create(author=self.user, title='test', body='test')

        self.client = Client()

    def test_get_queryset(self):
        header = {'HTTP_AUTHORIZATION': 'Token {}'.format(self.token)}
        response = self.client.get(reverse_lazy('userpost-list', kwargs={'username': 'test'}), {}, **header)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(isinstance(response.data[0], collections.OrderedDict))



