"""
Management command to seed sample corporate affiliations data.
"""

from django.core.management.base import BaseCommand
from django.core.files.base import ContentFile
from journals.models import CorporateAffiliation
import urllib.request
import ssl


class Command(BaseCommand):
    help = 'Seed sample corporate affiliations with logos'

    # Sample affiliations with their logo URLs (using logo.clearbit.com - more reliable)
    SAMPLE_AFFILIATIONS = [
        {
            'name': 'Crossref',
            'url': 'https://www.crossref.org',
            'logo_url': 'https://logo.clearbit.com/crossref.org',
            'display_order': 1,
        },
        {
            'name': 'DOAJ',
            'url': 'https://doaj.org',
            'logo_url': 'https://logo.clearbit.com/doaj.org',
            'display_order': 2,
        },
        {
            'name': 'PubMed',
            'url': 'https://pubmed.ncbi.nlm.nih.gov',
            'logo_url': 'https://logo.clearbit.com/nih.gov',
            'display_order': 3,
        },
        {
            'name': 'Elsevier',
            'url': 'https://www.elsevier.com',
            'logo_url': 'https://logo.clearbit.com/elsevier.com',
            'display_order': 4,
        },
        {
            'name': 'Springer Nature',
            'url': 'https://www.springernature.com',
            'logo_url': 'https://logo.clearbit.com/springernature.com',
            'display_order': 5,
        },
        {
            'name': 'ORCID',
            'url': 'https://orcid.org',
            'logo_url': 'https://logo.clearbit.com/orcid.org',
            'display_order': 6,
        },
        {
            'name': 'Google Scholar',
            'url': 'https://scholar.google.com',
            'logo_url': 'https://logo.clearbit.com/google.com',
            'display_order': 7,
        },
        {
            'name': 'ResearchGate',
            'url': 'https://www.researchgate.net',
            'logo_url': 'https://logo.clearbit.com/researchgate.net',
            'display_order': 8,
        },
    ]

    def download_image(self, url, name):
        """Download image from URL and return ContentFile."""
        try:
            # Create SSL context that doesn't verify certificates (for simplicity)
            ctx = ssl.create_default_context()
            ctx.check_hostname = False
            ctx.verify_mode = ssl.CERT_NONE
            
            req = urllib.request.Request(
                url,
                headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
            )
            with urllib.request.urlopen(req, context=ctx, timeout=10) as response:
                data = response.read()
                # Get file extension from URL or default to png
                ext = url.split('.')[-1].split('?')[0]
                if ext not in ['png', 'jpg', 'jpeg', 'svg', 'webp']:
                    ext = 'png'
                filename = f"{name.lower().replace(' ', '_')}.{ext}"
                return ContentFile(data, name=filename)
        except Exception as e:
            self.stdout.write(self.style.WARNING(f'Could not download logo for {name}: {e}'))
        return None

    def handle(self, *args, **options):
        self.stdout.write('Seeding corporate affiliations...\n')
        
        created_count = 0
        skipped_count = 0
        
        for aff_data in self.SAMPLE_AFFILIATIONS:
            name = aff_data['name']
            
            # Check if already exists
            if CorporateAffiliation.objects.filter(name=name).exists():
                self.stdout.write(f'  Skipped: {name} (already exists)')
                skipped_count += 1
                continue
            
            # Create affiliation
            affiliation = CorporateAffiliation(
                name=name,
                url=aff_data['url'],
                display_order=aff_data['display_order'],
                is_active=True,
            )
            
            # Try to download and attach logo
            logo_file = self.download_image(aff_data['logo_url'], name)
            if logo_file:
                affiliation.logo = logo_file
            
            affiliation.save()
            self.stdout.write(self.style.SUCCESS(f'  Created: {name}'))
            created_count += 1
        
        self.stdout.write('')
        self.stdout.write(self.style.SUCCESS(
            f'Done! Created: {created_count}, Skipped: {skipped_count}'
        ))

