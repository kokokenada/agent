import uuid

from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()


class Chat(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class ChatParticipant(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE, related_name="participants")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="chats_participated")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = (("chat", "user"),)

    def __str__(self):
        return f"{self.user.name} in {self.chat.name}"


class ChatMessage(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE, related_name="messages")
    sender_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="messages_sent")
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.name}: {self.content}"
