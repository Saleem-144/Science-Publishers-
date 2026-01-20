#!/usr/bin/env python
"""View data from a specific MySQL table."""
import os
import sys
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
os.environ['DB_ENGINE'] = 'django.db.backends.mysql'
os.environ['DB_PASSWORD'] = 'admin123'
import django
django.setup()

from django.db import connection

if len(sys.argv) < 2:
    print("Usage: python view_table_data.py <table_name>")
    print("\nExample:")
    print("  python view_table_data.py accounts_user")
    print("  python view_table_data.py journals_announcement")
    sys.exit(1)

table_name = sys.argv[1]

try:
    cursor = connection.cursor()
    
    # Get table structure
    cursor.execute(f"DESCRIBE {table_name}")
    columns = cursor.fetchall()
    
    print("=" * 60)
    print(f"TABLE: {table_name}")
    print("=" * 60)
    print(f"\nColumns ({len(columns)}):")
    for col in columns:
        print(f"  - {col[0]} ({col[1]})")
    
    # Get row count
    cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
    count = cursor.fetchone()[0]
    print(f"\nTotal Rows: {count}\n")
    
    if count > 0:
        # Get first 10 rows
        cursor.execute(f"SELECT * FROM {table_name} LIMIT 10")
        rows = cursor.fetchall()
        
        print("Sample Data (First 10 rows):")
        print("-" * 60)
        for i, row in enumerate(rows, 1):
            print(f"\nRow {i}:")
            for j, col in enumerate(columns):
                value = row[j] if j < len(row) else None
                if value is None:
                    value = "NULL"
                elif isinstance(value, (str, bytes)) and len(str(value)) > 50:
                    value = str(value)[:50] + "..."
                print(f"  {col[0]}: {value}")
    
    cursor.close()
    
except Exception as e:
    print(f"❌ Error: {e}")
    print("\nMake sure:")
    print("1. Table name is correct")
    print("2. MySQL is running")
    print("3. Database connection is working")



