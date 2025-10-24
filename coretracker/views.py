from rest_framework import generics, permissions, status
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import *
from .models import *
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
import openai
from django.conf import settings
from django.http import JsonResponse


# ✅ AI Summarization View (works with openai==0.28.0)
class SummarizeNotesView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        note_contents = request.data.get("note_contents", [])
        if not note_contents:
            return Response({"error": "No note content provided"}, status=400)

        text_to_summarize = "\n".join(note_contents)

        openai.api_key = settings.OPENAI_API_KEY

        try:
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant."},
                    {"role": "user", "content": f"Summarize this text:\n{text_to_summarize}"}
                ],
                max_tokens=150,
                temperature=0.7,
            )
            summary = response.choices[0].message["content"].strip()
            return Response({"summary": summary})

        except Exception as e:
            print("❌ OpenAI Error:", str(e))
            return Response({"error": str(e)}, status=500)


# ✅ Register new user
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


# ✅ JWT login
class LoginView(TokenObtainPairView):
    pass


# ✅ Skill CRUD
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


# ✅ Notes CRUD
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


# ✅ Hour logs CRUD
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


# ✅ Profile View
class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = request.user.profile
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)

    def put(self, request):
        profile = request.user.profile
        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ✅ Change Password
class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        new_password = request.data.get("new_password")

        if not new_password:
            return Response({"error": "New password required"}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()
        return Response({"message": "Password updated successfully"}, status=status.HTTP_200_OK)


# Set your API key
openai.api_key = settings.OPENAI_API_KEY

def summarize_note_view(request, note_id):
    try:
        # Get the note
        note = Note.objects.get(id=note_id)
        
        # Ask OpenAI to summarize it
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": f"Summarize this note: {note.content}"}],
            max_tokens=150
        )
        
        summary = response.choices[0].message.content
        
        return JsonResponse({
            "note": note.content,
            "summary": summary
        })
    
    except Note.DoesNotExist:
        return JsonResponse({"error": "Note not found"}, status=404)
    
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)