from .models import Skill

def skills_processor(request):
    return {'skills': Skill.objects.all()}
