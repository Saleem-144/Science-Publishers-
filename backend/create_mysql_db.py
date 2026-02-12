#!/usr/bin/env python
"""Create MySQL database for Science Publishers."""
import MySQLdb
import os

# Database configuration
DB_CONFIG = {
    'host': 'localhost',
    'port': 3306,
    'user': 'root',
    'password': 'admin123',  # XAMPP default is empty, change if you set password
    'database': 'science_publishers',
}

def create_database():
    """Create MySQL database if it doesn't exist."""
    try:
        # Connect without specifying database
        connection = MySQLdb.connect(
            host=DB_CONFIG['host'],
            port=DB_CONFIG['port'],
            user=DB_CONFIG['user'],
            password=DB_CONFIG['password']
        )
        
        cursor = connection.cursor()
        
        # Create database with UTF8MB4 encoding
        create_db_query = f"""
        CREATE DATABASE IF NOT EXISTS {DB_CONFIG['database']}
        CHARACTER SET utf8mb4
        COLLATE utf8mb4_unicode_ci;
        """
        
        cursor.execute(create_db_query)
        connection.commit()
        
        print(f"✅ Database '{DB_CONFIG['database']}' created successfully!")
        
        cursor.close()
        connection.close()
        
        return True
        
    except MySQLdb.Error as e:
        print(f"❌ Error creating database: {e}")
        print("\nTroubleshooting:")
        print("1. Make sure MySQL server is running")
        print("2. Check your MySQL root password")
        print("3. If you set a password during installation, update the 'password' in this script")
        return False

if __name__ == '__main__':
    print("=" * 60)
    print("Creating MySQL Database")
    print("=" * 60)
    print()
    
    if create_database():
        print()
        print("=" * 60)
        print("✅ Database setup complete!")
        print("=" * 60)
        print()
        print("Next steps:")
        print("1. Set environment variables for MySQL")
        print("2. Run: python manage.py migrate")
        print("3. Run: python manage.py loaddata data_export.json")
    else:
        print("\n❌ Failed to create database. Please check the error above.")
















