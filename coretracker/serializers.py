from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Skill, Note, Hour

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

# Skill serializer
class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at']

# Note serializer
class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = '__all__'
        read_only_fields = ['created_at']

# Hour serializer
class HourSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hour
        fields = '__all__'
        read_only_fields = ['date']
