from django.core.management.base import BaseCommand
from journals.models import CTAButton

class Command(BaseCommand):
    help = 'Seed initial CTA buttons for the homepage'

    def handle(self, *args, **kwargs):
        buttons = [
            {
                'slug': 'editorial-board',
                'label': 'Become a Editorial Board Member',
                'notification_email': 'editorial@example.com'
            },
            {
                'slug': 'reviewer',
                'label': 'Become a Reviewer',
                'notification_email': 'reviewer@example.com'
            },
            {
                'slug': 'call-for-editors',
                'label': 'Call For Editors',
                'notification_email': 'editors@example.com'
            },
            {
                'slug': 'section-editor',
                'label': 'Become a section Editor',
                'notification_email': 'section-editor@example.com'
            },
        ]

        for btn_data in buttons:
            button, created = CTAButton.objects.get_or_create(
                slug=btn_data['slug'],
                defaults={
                    'label': btn_data['label'],
                    'notification_email': btn_data['notification_email']
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created button: {button.label}'))
            else:
                self.stdout.write(self.style.WARNING(f'Button already exists: {button.label}'))

