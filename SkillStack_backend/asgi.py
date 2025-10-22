# ASGI- Asynchronous Server Gateway Interface entry point for SkillStack_backend project.
import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'SkillStack_backend.settings')

application = get_asgi_application()
