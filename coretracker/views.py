from rest_framework import generics, permissions
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import UserSerializer, SkillSerializer, NoteSerializer, HourSerializer
from .models import *

# Register new user
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

# JWT login (uses built-in view)
from rest_framework_simplejwt.views import TokenObtainPairView
class LoginView(TokenObtainPairView):
    pass

# Skill CRUD for logged-in user
class SkillListCreateView(generics.ListCreateAPIView):
    serializer_class = SkillSerializer
    permission_classes = [permissions.IsAuthenticated]


    def get_queryset(self):
        return Skill.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class SkillRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SkillSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Skill.objects.filter(user=self.request.user)

# Notes CRUD
class NoteListCreateView(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Note.objects.filter(skill__user=self.request.user)

class NoteRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Note.objects.filter(skill__user=self.request.user)

# Hour logs CRUD
class HourListCreateView(generics.ListCreateAPIView):
    serializer_class = HourSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Hour.objects.filter(skill__user=self.request.user)

class HourRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = HourSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Hour.objects.filter(skill__user=self.request.user)
