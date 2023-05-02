from django.db import migrations
from django.contrib.auth import get_user_model
from users.constants import SYSTEM_USER_ID


def create_system_user(apps, schema_editor):
    User = get_user_model()
    User.objects.create(id=SYSTEM_USER_ID, name='ai_system_user', email='ai_system_user@example.com', password="never", is_active=True)


def remove_system_user(apps, schema_editor):
    User = get_user_model()
    User.objects.filter(id=SYSTEM_USER_ID).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(create_system_user, remove_system_user),
    ]
