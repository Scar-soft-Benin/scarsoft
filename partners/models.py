from django.db import models

class Partner(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    logo = models.ImageField(upload_to='partners/logos/')  # Stores images in media/partners/logos/
    website = models.URLField(blank=True, null=True)  # Optional website link
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
