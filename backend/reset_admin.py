#!/usr/bin/env python
"""Reset admin credentials."""
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

import django
django.setup()

from accounts.models import User

# Delete all existing users
User.objects.all().delete()
print("Deleted all existing users")

# Create new admin
email = 'saleemsohaib092@gmail.com'
password = 'dev$#54784'

user = User.objects.create_superuser(
    email=email,
    password=password,
    first_name='Saleem',
    last_name='Sohaib'
)
print(f"\nAdmin user created successfully!")
print(f"Email: {email}")
print(f"Password: {password}")

# Verify the password works
if user.check_password(password):
    print("\n✓ Password verification: PASSED")
else:
    print("\n✗ Password verification: FAILED")











