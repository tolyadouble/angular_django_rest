import unittest
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from django.test import Client
from rest_framework import status
from django.test.client import encode_multipart
from django.core.urlresolvers import reverse_lazy


class TestUserSerializer(unittest.TestCase):

    def setUp(self):
        self.client = Client()

    def test_create_wrong_pass(self):
        user_data = {
            'username': 'test2',
            'email': 'test2@test.te',
            'first_name': 'test',
            'last_name': 'test',
            'password': 'test',
            'confirm_password': 'test2'
        }
        response = self.client.post(reverse_lazy('user-list'), user_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['password'][0], 'Passwords should be the same.')

    def test_create_ok(self):
        user_data = {
            'username': 'test3',
            'email': 'test3@test.te',
            'first_name': 'test',
            'last_name': 'test',
            'password': 'test',
            'confirm_password': 'test'
        }
        response = self.client.post(reverse_lazy('user-list'), user_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.get(username='test3').username, 'test3')


class TestUserDetailSerializer(unittest.TestCase):

    def setUp(self):
        self.user = User.objects.create_user('test4')
        self.token = Token.objects.get(user=self.user).key
        self.client = Client()

    def test_update(self):
        user_data = {
            'email': 'test4@test.te',
            'first_name': 'test4',
            'last_name': 'test4',
        }
        header = {'HTTP_AUTHORIZATION': 'Token {}'.format(self.token)}
        user_data = encode_multipart('BoUnDaRyStRiNg', user_data)
        content_type = 'multipart/form-data; boundary=BoUnDaRyStRiNg'
        response = self.client.patch(reverse_lazy('user-detail', kwargs={'username': 'test4'}), user_data,
                                     content_type,
                                     **header)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(User.objects.get(username='test4').email, 'test4@test.te')
        self.assertEqual(User.objects.get(username='test4').first_name, 'test4')
        self.assertEqual(User.objects.get(username='test4').last_name, 'test4')


class TestUserPostSerializer(unittest.TestCase):

    def setUp(self):
        self.user = User.objects.create_user('test5')
        self.token = Token.objects.get(user=self.user).key

        self.client = Client()

    def test_create(self):
        post_data = {
            'author': self.user,
            'title': 'test',
            'body': 'test',
        }
        header = {'HTTP_AUTHORIZATION': 'Token {}'.format(self.token)}
        response = self.client.post(reverse_lazy('userpost-list', kwargs={'username': 'test5'}), post_data, **header)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.get(username='test5').posts.count(), 1)





