from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from rest_framework.validators import UniqueValidator
from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.models import User
from django.core.mail import send_mail
from .models import Post


class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(allow_blank=False, validators=[UniqueValidator(queryset=User.objects.all())])
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    password = serializers.CharField(write_only=True, required=True)
    confirm_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'password', 'confirm_password',)

    def create(self, validated_data):
        password = validated_data.get('password', None)
        confirm_password = validated_data.get('confirm_password', None)
        if password and confirm_password and password == confirm_password:
            validated_data.pop('password')
            validated_data.pop('confirm_password')
            user = User.objects.create_user(**validated_data)
            user.set_password(password)
            user.save()
            send_mail(
                'Hello, Welcome to the Wall APP ',
                'Here is the message.',
                'messanger@web_app.com',
                [user.email],
                fail_silently=False
            )
            return user
        raise ValidationError({
                'password': ['Passwords should be the same.']
        })


class UserDetailSerializer(serializers.ModelSerializer):
    username = serializers.CharField(read_only=True)
    email = serializers.EmailField(required=True, validators=[UniqueValidator(queryset=User.objects.all())])
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name',)

    def update(self, instance, validated_data):
        instance.email = validated_data.get('email', instance.username)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.save()
        update_session_auth_hash(self.context.get('request'), instance)
        return instance


class UserPostSerializer(serializers.ModelSerializer):
    author = UserSerializer(required=False)
    title = serializers.CharField(required=True)
    body = serializers.CharField(required=True)

    class Meta:
        model = Post

    def create(self, validated_data):
        validated_data['author'] = self.context['request'].user
        post = Post.objects.create(**validated_data)
        return post


class PostSerializer(serializers.ModelSerializer):
    author = UserSerializer(required=False)

    class Meta:
        model = Post
