"""
Management command to seed sample announcements/news data.
"""

from django.core.management.base import BaseCommand
from django.utils import timezone
from journals.models import Announcement
from datetime import timedelta


class Command(BaseCommand):
    help = 'Seed sample announcements for news section'

    SAMPLE_ANNOUNCEMENTS = [
        {
            'title': 'Advancing Open Access: Our Commitment to Free Scientific Knowledge',
            'slug': 'advancing-open-access-commitment',
            'excerpt': 'At Aethra Science Publishers, we believe that scientific knowledge should be accessible to everyone. Learn about our initiatives to promote open access publishing.',
            'content': '''
<p>At Aethra Science Publishers, we are committed to making scientific knowledge freely accessible to researchers, practitioners, and the public worldwide. Open access publishing removes barriers to information and accelerates the pace of scientific discovery.</p>

<h2>Why Open Access Matters</h2>
<p>Traditional subscription-based publishing models can limit access to important research findings. By embracing open access, we ensure that:</p>
<ul>
    <li>Researchers in developing countries have equal access to the latest scientific literature</li>
    <li>Practitioners can stay updated with current evidence-based practices</li>
    <li>The general public can engage with scientific research that affects their lives</li>
    <li>Authors reach a broader audience and receive more citations</li>
</ul>

<h2>Our Open Access Initiatives</h2>
<p>We have implemented several programs to support open access publishing:</p>
<ul>
    <li><strong>APC Waivers:</strong> We offer article processing charge waivers for authors from low-income countries</li>
    <li><strong>Institutional Agreements:</strong> We partner with institutions to provide seamless open access publishing</li>
    <li><strong>Preprint Support:</strong> We encourage authors to share preprints and support their integration</li>
</ul>

<h2>Looking Forward</h2>
<p>As we continue to grow, we remain dedicated to expanding access to scientific knowledge. Join us in our mission to make research freely available to all.</p>
            ''',
            'author_name': 'Dr. Sarah Chen, Editor-in-Chief',
            'show_on_homepage': True,
            'is_published': True,
            'days_ago': 24,
        },
        {
            'title': 'Call for Papers: Special Issue on AI in Healthcare',
            'slug': 'call-for-papers-ai-healthcare',
            'excerpt': 'We invite researchers to submit their work for our upcoming special issue exploring the applications of artificial intelligence in healthcare and medicine.',
            'content': '''
<p>Aethra Science Publishers is pleased to announce a call for papers for a special issue on "Artificial Intelligence in Healthcare: Innovations, Challenges, and Future Directions."</p>

<h2>Scope of the Special Issue</h2>
<p>We welcome original research articles, reviews, and perspectives covering topics including but not limited to:</p>
<ul>
    <li>Machine learning for disease diagnosis and prognosis</li>
    <li>Natural language processing in clinical settings</li>
    <li>AI-powered drug discovery and development</li>
    <li>Computer vision in medical imaging</li>
    <li>Ethical considerations in AI healthcare applications</li>
    <li>AI for personalized medicine and treatment planning</li>
</ul>

<h2>Important Dates</h2>
<ul>
    <li><strong>Abstract Submission Deadline:</strong> March 15, 2026</li>
    <li><strong>Full Paper Submission Deadline:</strong> June 30, 2026</li>
    <li><strong>Expected Publication:</strong> December 2026</li>
</ul>

<h2>Guest Editors</h2>
<p>This special issue is edited by leading experts in the field of AI and healthcare informatics.</p>

<p>For submission guidelines and more information, please contact our editorial office.</p>
            ''',
            'author_name': 'Editorial Team',
            'show_on_homepage': True,
            'is_published': True,
            'days_ago': 11,
        },
        {
            'title': 'New Journal Launch: Journal of Applied Physics',
            'slug': 'new-journal-launch-applied-physics',
            'excerpt': 'We are excited to announce the launch of our newest journal, the Journal of Applied Physics, covering cutting-edge research in applied physics and engineering.',
            'content': '''
<p>Aethra Science Publishers is proud to announce the launch of the Journal of Applied Physics (JAP), a new peer-reviewed publication dedicated to advancing research in applied physics and engineering sciences.</p>

<h2>About the Journal</h2>
<p>The Journal of Applied Physics aims to publish high-quality original research that bridges fundamental physics with practical applications. The journal covers a broad spectrum of topics including:</p>
<ul>
    <li>Condensed matter physics and materials science</li>
    <li>Optical and photonic technologies</li>
    <li>Nanotechnology and nanoscience</li>
    <li>Energy conversion and storage</li>
    <li>Quantum technologies</li>
    <li>Computational physics</li>
</ul>

<h2>Editorial Leadership</h2>
<p>The journal is led by an internationally recognized editorial board comprising experts from leading research institutions worldwide.</p>

<h2>Submit Your Research</h2>
<p>We are now accepting submissions. Authors are encouraged to submit their innovative research for consideration. Publication fees are waived for the first year.</p>
            ''',
            'author_name': 'Publisher',
            'show_on_homepage': True,
            'is_published': True,
            'days_ago': 19,
        },
        {
            'title': 'Excellence in Peer Review Award 2025 Recipients',
            'slug': 'peer-review-award-2025-recipients',
            'excerpt': 'Congratulations to the outstanding reviewers who have been recognized for their exceptional contributions to the peer review process in 2025.',
            'content': '''
<p>We are delighted to announce the recipients of the Excellence in Peer Review Award 2025. These outstanding individuals have demonstrated exceptional dedication to maintaining the highest standards of scientific publishing.</p>

<h2>Award Recipients</h2>
<p>This year's honorees have been selected based on the quality, timeliness, and constructiveness of their reviews:</p>
<ul>
    <li><strong>Dr. Michael Thompson</strong> - University of Cambridge, UK</li>
    <li><strong>Prof. Elena Rodriguez</strong> - Max Planck Institute, Germany</li>
    <li><strong>Dr. Kenji Tanaka</strong> - University of Tokyo, Japan</li>
    <li><strong>Prof. Aisha Patel</strong> - Stanford University, USA</li>
    <li><strong>Dr. Lars Nielsen</strong> - Karolinska Institute, Sweden</li>
</ul>

<h2>The Importance of Peer Review</h2>
<p>Peer review is the cornerstone of scientific publishing. Our reviewers volunteer their time and expertise to evaluate manuscripts, provide constructive feedback, and help authors improve their work.</p>

<h2>Recognition</h2>
<p>Each recipient will receive a certificate of recognition, a complimentary publication voucher, and will be featured on our website. We thank all our reviewers for their invaluable contributions to science.</p>
            ''',
            'author_name': 'Awards Committee',
            'show_on_homepage': True,
            'is_published': True,
            'days_ago': 29,
        },
        {
            'title': 'Strategic Partnership with European Research Council',
            'slug': 'partnership-european-research-council',
            'excerpt': 'Aethra Science Publishers announces a strategic partnership with the European Research Council to enhance open access publishing for ERC-funded research.',
            'content': '''
<p>Aethra Science Publishers is pleased to announce a strategic partnership with the European Research Council (ERC) to facilitate open access publishing for ERC-funded researchers.</p>

<h2>Partnership Highlights</h2>
<p>Under this agreement:</p>
<ul>
    <li>ERC grant holders will have streamlined access to open access publishing across all Aethra journals</li>
    <li>Article processing charges for ERC-funded research will be covered through institutional agreements</li>
    <li>Enhanced visibility for ERC-funded research through dedicated collections and promotion</li>
    <li>Compliance with Plan S and other open access mandates will be simplified</li>
</ul>

<h2>Supporting Excellence in Research</h2>
<p>This partnership reflects our commitment to supporting excellent research and ensuring that groundbreaking discoveries reach the widest possible audience. The ERC funds frontier research across all fields, and we are honored to help disseminate this important work.</p>

<h2>Getting Started</h2>
<p>ERC grant holders can contact our institutional partnerships team to learn more about the benefits available under this agreement.</p>
            ''',
            'author_name': 'Admin',
            'show_on_homepage': True,
            'is_published': True,
            'days_ago': 34,
        },
    ]

    def handle(self, *args, **options):
        self.stdout.write('Seeding announcements...\n')
        
        created_count = 0
        skipped_count = 0
        
        for ann_data in self.SAMPLE_ANNOUNCEMENTS:
            slug = ann_data['slug']
            
            # Check if already exists
            if Announcement.objects.filter(slug=slug).exists():
                self.stdout.write(f'  Skipped: {ann_data["title"][:50]}... (already exists)')
                skipped_count += 1
                continue
            
            # Calculate published_at date
            published_at = timezone.now() - timedelta(days=ann_data['days_ago'])
            
            # Create announcement
            announcement = Announcement.objects.create(
                title=ann_data['title'],
                slug=slug,
                excerpt=ann_data['excerpt'],
                content=ann_data['content'].strip(),
                author_name=ann_data['author_name'],
                show_on_homepage=ann_data['show_on_homepage'],
                is_published=ann_data['is_published'],
                published_at=published_at,
            )
            
            self.stdout.write(self.style.SUCCESS(f'  Created: {ann_data["title"][:50]}...'))
            created_count += 1
        
        self.stdout.write('')
        self.stdout.write(self.style.SUCCESS(
            f'Done! Created: {created_count}, Skipped: {skipped_count}'
        ))



