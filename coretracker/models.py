from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

# Skill model
class Skill(models.Model):
    DIFFICULTY_CHOICES = [
        ('Easy', 'Easy'),
        ('Medium', 'Medium'),
        ('Hard', 'Hard')
    ]
    STATUS_CHOICES = [
        ('Not Started', 'Not Started'),
        ('Started', 'Started'),
        ('In Progress', 'In Progress'),
        ('Completed', 'Completed')
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)  
    name = models.CharField(max_length=100)                 
    resource_type = models.CharField(max_length=50)         
    platform = models.CharField(max_length=50)              
    hours_spent = models.FloatField(default=0)               
    difficulty = models.CharField(max_length=10, choices=DIFFICULTY_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Not Started')
    created_at = models.DateTimeField(auto_now_add=True)    
    updated_at = models.DateTimeField(auto_now=True)  
    certification_name = models.CharField(max_length=100, blank=True)
    certification_link = models.URLField(blank=True)
    certification_image = models.ImageField(upload_to='certificates/', blank=True, null=True)
      

    def __str__(self):
        return f"{self.name} ({self.user.username})"


# Note model 
class Note(models.Model):
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE, related_name='notes')
    content = models.TextField()            
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Note for {self.skill.name}"


# Hour model
class Hour(models.Model):
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE, related_name='hour_logs')
    hours = models.FloatField()             # Hours spent on this day
    date = models.DateField(auto_now_add=True)
    note = models.TextField(blank=True, null=True)  # Optional comment

    def __str__(self):
        return f"{self.hours} hrs on {self.date} for {self.skill.name}"

# profile
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    profile_image = models.ImageField(upload_to='profile_images/', blank=True, null=True)
    bio = models.CharField(max_length=500, blank=True)

    def __str__(self):
        return self.user.username


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()