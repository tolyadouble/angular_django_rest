from django.contrib import admin
from .models import Post


class PostAdmin(admin.ModelAdmin):
    list_display = [x.name for x in Post._meta.get_fields()]

admin.site.register(Post, PostAdmin)
