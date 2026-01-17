#!/usr/bin/env python
"""Create admin superuser if not exists."""
import os
import sys

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

import django
django.setup()

from accounts.models import User

email = 'admin@example.com'
password = 'admin123'

if not User.objects.filter(email=email).exists():
    User.objects.create_superuser(
        email=email,
        password=password,
        first_name='Admin',
        last_name='User'
    )
    print(f'Created admin user: {email} / {password}')
else:
    print(f'Admin user already exists: {email}')







