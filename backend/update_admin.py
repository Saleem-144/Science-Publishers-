#!/usr/bin/env python
"""Update admin credentials."""
import os
import sys

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

import django
django.setup()

from accounts.models import User

# Delete old admin if exists
User.objects.filter(email='admin@example.com').delete()

# Check if new admin exists
new_email = 'saleemsohaib092@gmail.com'
new_password = 'dev$#54784'

user, created = User.objects.get_or_create(
    email=new_email,
    defaults={
        'first_name': 'Admin',
        'last_name': 'User',
        'is_staff': True,
        'is_superuser': True,
        'is_active': True,
    }
)

user.set_password(new_password)
user.is_staff = True
user.is_superuser = True
user.is_active = True
user.save()

print(f'Admin credentials updated!')
print(f'Email: {new_email}')
print(f'Password: {new_password}')







