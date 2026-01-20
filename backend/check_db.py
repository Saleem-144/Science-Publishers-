#!/usr/bin/env python
"""Check which database is currently being used."""
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
import django
django.setup()

from django.conf import settings
from django.db import connection

db = settings.DATABASES['default']

print("=" * 60)
print("CURRENT DATABASE CONFIGURATION")
print("=" * 60)
print(f"Engine: {db['ENGINE']}")
print(f"Name: {db['NAME']}")
print(f"User: {db.get('USER', 'N/A')}")
print(f"Host: {db.get('HOST', 'N/A')}")
print(f"Port: {db.get('PORT', 'N/A')}")
print()

# Test connection
try:
    connection.ensure_connection()
    cursor = connection.cursor()
    
    if 'sqlite' in db['ENGINE']:
        cursor.execute("SELECT sqlite_version();")
        version = cursor.fetchone()
        print(f"✅ SQLite Version: {version[0]}")
    elif 'mysql' in db['ENGINE']:
        cursor.execute("SELECT VERSION();")
        version = cursor.fetchone()
        print(f"✅ MySQL Version: {version[0]}")
        cursor.execute("SELECT DATABASE();")
        db_name = cursor.fetchone()
        print(f"✅ Current Database: {db_name[0]}")
    
    cursor.close()
    print()
    print("=" * 60)
    print("✅ Database connection successful!")
    print("=" * 60)
except Exception as e:
    print(f"❌ Connection error: {e}")




