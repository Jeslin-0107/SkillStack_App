from rest_framework import serializers
from django.contrib.auth.models import User
from .models import *

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        return user


# User registration serializer
class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)  # hide password in responses

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        return user


# Updated Profile serializer
class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    is_verified = serializers.BooleanField(source='user.is_active', read_only=True)

    class Meta:
        model = Profile
        fields = ['username', 'email', 'is_verified', 'profile_image', 'bio']
        read_only_fields = ['username', 'email', 'is_verified']

    def update(self, instance, validated_data):
        # Update profile image and bio
        instance.bio = validated_data.get('bio', instance.bio)
        if validated_data.get('profile_image'):
            instance.profile_image = validated_data.get('profile_image', instance.profile_image)
        instance.save()
        return instance


# Skill serializer
class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at']


# Note serializer
class NoteSerializer(serializers.ModelSerializer):
    skill_name = serializers.CharField(source='skill.name', read_only=True)

    class Meta:
        model = Note
        fields = ['id', 'skill', 'skill_name', 'content', 'created_at']
        read_only_fields = ['created_at']


# Hour serializer
class HourSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hour
        fields = '__all__'
        read_only_fields = ['date']
