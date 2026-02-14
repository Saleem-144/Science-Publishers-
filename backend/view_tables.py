#!/usr/bin/env python
"""View all tables and their data in MySQL database."""
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
os.environ['DB_ENGINE'] = 'django.db.backends.mysql'
os.environ['DB_PASSWORD'] = 'admin123'
import django
django.setup()

from django.db import connection

print("=" * 60)
print("MYSQL DATABASE TABLES")
print("=" * 60)
print()

# Get all tables
cursor = connection.cursor()
cursor.execute("SHOW TABLES")
tables = cursor.fetchall()

print(f"Total Tables: {len(tables)}\n")

for i, table in enumerate(tables, 1):
    table_name = table[0]
    print(f"{i}. {table_name}")
    
    # Get row count
    cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
    count = cursor.fetchone()[0]
    print(f"   Rows: {count}")
    
    # Get table structure (first few columns)
    cursor.execute(f"DESCRIBE {table_name}")
    columns = cursor.fetchall()
    print(f"   Columns: {len(columns)}")
    if columns:
        print(f"   Sample columns: {', '.join([col[0] for col in columns[:3]])}")
    print()

cursor.close()

print("=" * 60)
print("To view specific table data, use:")
print("  python view_table_data.py <table_name>")
print("=" * 60)


















