from django.urls import path
from .views import *
urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path("profile/", ProfileView.as_view(), name="profile"),
    path("change-password/", ChangePasswordView.as_view(), name="change-password"),
    path('summarize-notes/', SummarizeNotesView.as_view(), name='summarize-notes'),



    path('skills/', SkillListCreateView.as_view(), name='skill-list-create'),
    path('skills/<int:pk>/', SkillRetrieveUpdateDeleteView.as_view(), name='skill-detail'),

    path('notes/', NoteListCreateView.as_view(), name='note-list-create'),
    path('notes/<int:pk>/', NoteRetrieveUpdateDeleteView.as_view(), name='note-detail'),

    path('hours/', HourListCreateView.as_view(), name='hour-list-create'),
    path('hours/<int:pk>/', HourRetrieveUpdateDeleteView.as_view(), name='hour-detail'),
]
