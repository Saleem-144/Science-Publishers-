"""
Configuration module for environment-based settings.
Uses environment variables with sensible defaults for development.
"""
import os
from pathlib import Path
from dotenv import load_dotenv

# Build paths inside the project
BASE_DIR = Path(__file__).resolve().parent.parent

# Load .env from project root (if present) so get_env can read values from it
dotenv_path = BASE_DIR / '.env'
if dotenv_path.exists():
    load_dotenv(dotenv_path)
else:
    # fallback to default load (reads from current working dir)
    load_dotenv()


def get_env(key: str, default: str = None, cast: type = str):
    """Get environment variable with optional type casting."""
    value = os.environ.get(key, default)
    if value is None:
        return None
    if cast == bool:
        return value.lower() in ('true', '1', 'yes', 'on')
    if cast == list:
        return [item.strip() for item in value.split(',') if item.strip()]
    return cast(value)


# =============================================================================
# Core Django Settings
# =============================================================================

DEBUG = get_env('DEBUG', 'True', bool)
SECRET_KEY = get_env(
    'SECRET_KEY',
    'django-insecure-dev-key-change-in-production-abc123xyz789'
)
ALLOWED_HOSTS = get_env('ALLOWED_HOSTS', 'localhost,127.0.0.1', list)


# =============================================================================
# Database Configuration
# =============================================================================

# Use SQLite for development, MySQL/PostgreSQL for production
DB_ENGINE = get_env('DB_ENGINE', 'django.db.backends.sqlite3')

if DB_ENGINE == 'django.db.backends.sqlite3':
    DATABASE_CONFIG = {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
elif DB_ENGINE == 'django.db.backends.mysql':
    DATABASE_CONFIG = {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': get_env('DB_NAME', 'science_publishers'),
        'USER': get_env('DB_USER', 'root'),
        'PASSWORD': get_env('DB_PASSWORD', ''),
        'HOST': get_env('DB_HOST', 'localhost'),
        'PORT': get_env('DB_PORT', '3306'),
        'OPTIONS': {
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
            'charset': 'utf8mb4',
        },
    }
else:
    # PostgreSQL or other databases
    DATABASE_CONFIG = {
        'ENGINE': DB_ENGINE,
        'NAME': get_env('DB_NAME', 'science_publishers'),
        'USER': get_env('DB_USER', 'postgres'),
        'PASSWORD': get_env('DB_PASSWORD', 'postgres'),
        'HOST': get_env('DB_HOST', 'localhost'),
        'PORT': get_env('DB_PORT', '5432'),
    }


# =============================================================================
# JWT Configuration
# =============================================================================

JWT_ACCESS_TOKEN_LIFETIME = get_env('JWT_ACCESS_TOKEN_LIFETIME', '60', int)  # minutes
JWT_REFRESH_TOKEN_LIFETIME = get_env('JWT_REFRESH_TOKEN_LIFETIME', '1440', int)  # minutes (24h)


# =============================================================================
# CORS Configuration
# =============================================================================

CORS_ALLOWED_ORIGINS = get_env(
    'CORS_ALLOWED_ORIGINS',
    'http://localhost:3000,http://127.0.0.1:3000,http://localhost:3001,http://127.0.0.1:3001',
    list
)


# =============================================================================
# Media Configuration
# =============================================================================

MEDIA_URL = get_env('MEDIA_URL', '/media/')
MEDIA_ROOT = BASE_DIR / get_env('MEDIA_ROOT', 'media')

