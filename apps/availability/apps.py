from django.apps import AppConfig


class AvailabilityConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.availability'
    verbose_name = 'Availability'
    
    def ready(self):
        import apps.availability.signals