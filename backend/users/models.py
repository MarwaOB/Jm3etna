from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator


class CustomUser(AbstractUser):
    ROLE_CHOICES = [
        ('volunteer', 'Volunteer'),
        ('organisation', 'Organisation'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='volunteer')

    phone_regex = RegexValidator(
       regex=r'^(05|06|07)\d{8}$',
       message="The phone number must start with 05, 06, or 07 and contain exactly 10 digits."
    )

    telephone = models.CharField(
       max_length=10,
       validators=[phone_regex],
       unique=True  
    )    

    groups = models.ManyToManyField(
        "auth.Group",
        related_name="customuser_groups",
        blank=True
    )

    user_permissions = models.ManyToManyField(
        "auth.Permission",
        related_name="customuser_permissions",
        blank=True
    )


class Skill(models.Model): 
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

    @staticmethod
    def create_default_skills():
        skills = [
            "Cuisine", "Nettoyage", "Service", "Gestion d’événements",
            "Aide aux personnes âgées", "Soins médicaux de base",
        ]
        for skill in skills:
            Skill.objects.get_or_create(name=skill)



class Volunteer(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    birthDate = models.DateField(null=True, blank=True)  
    hoursVolunteered = models.IntegerField(default=0)
    moneyVolunteered = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    skills = models.ManyToManyField(Skill, related_name="volunteers", blank=True)

    def __str__(self):
        return self.user.username


class Organisation(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    description = models.TextField()  
    location = models.TextField()  


class Need(models.Model):
    NEED_TYPES = [
        ('human', 'Human'),
        ('material', 'Material'),
        ('financial', 'Financial'),
    ]
    
    title = models.CharField(max_length=100)
    description = models.TextField()
    type = models.CharField(max_length=10, choices=NEED_TYPES)
    organisation = models.ForeignKey(Organisation, on_delete=models.CASCADE, related_name="needs")
    volunteers = models.ManyToManyField(Volunteer, related_name="needs", blank=True)

    def __str__(self):
        return self.title
    

class HumanNeed(models.Model):
    need = models.OneToOneField(Need, on_delete=models.CASCADE, related_name="human_need")
    requiredPeople = models.IntegerField(default=1)
    volunteersCount = models.IntegerField(default=0) 
    skill = models.ForeignKey(Skill, on_delete=models.SET_NULL, null=True, blank=True) 
    startTime = models.TimeField(null=True, blank=True) 
    endTime = models.TimeField(null=True, blank=True) 
 
    def __str__(self):
        return f"Human Need for {self.need.title} - {self.requiredPeople} people required"


class MaterialNeed(models.Model):
    need = models.OneToOneField(Need, on_delete=models.CASCADE, related_name="material_need")
    itemName = models.CharField(max_length=100)
    requiredQuantity = models.IntegerField(default=1)
    itemCount = models.IntegerField(default=0) 

    def __str__(self):
        return f"Material Need: {self.itemName} x {self.requiredQuantity} for {self.need.title}"


class FinancialNeed(models.Model):
    need = models.OneToOneField(Need, on_delete=models.CASCADE, related_name="financial_need")
    amountRequired = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    amountCollected = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    def __str__(self):
        return f"Financial Need: {self.amountRequired} for {self.need.title}"