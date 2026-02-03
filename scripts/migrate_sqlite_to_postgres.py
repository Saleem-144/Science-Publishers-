"""
Migration helper: migrate data from the committed SQLite DB to a PostgreSQL instance.

Usage:
  python scripts/migrate_sqlite_to_postgres.py

What it does:
  - Loads (or interactively creates) a `.env` file with DB credentials.
  - Starts Postgres via `docker-compose up -d db` (requires Docker + docker-compose installed).
  - Waits until Postgres becomes available.
  - Dumps current data from SQLite using `manage.py dumpdata` into `dumpdata.json`.
  - Updates environment in this process to point Django at Postgres and runs `manage.py migrate`.
  - Loads the dumped data into Postgres using `manage.py loaddata`.

Notes / safety:
  - Excludes `auth.permission` and `contenttypes` from dump to avoid conflicts.
  - Keep backups of `db.sqlite3` and `dumpdata.json` before running.
  - This script attempts to preserve data, but complex relations or apps without natural keys
    may require manual adjustments.
"""

import subprocess
import sys
import time
from pathlib import Path
import os
import json

from dotenv import load_dotenv, set_key, dotenv_values

PROJECT_ROOT = Path(__file__).resolve().parent.parent
BACKEND_MANAGE = PROJECT_ROOT / 'backend' / 'manage.py'
ENV_PATH = PROJECT_ROOT / '.env'
DUMP_FILE = PROJECT_ROOT / 'dumpdata.json'


def ask(prompt, default=None, secret=False):
    if default:
        prompt = f"{prompt} [{default}]: "
    else:
        prompt = f"{prompt}: "
    try:
        if secret:
            # no getpass import on some environments; fallback to input
            from getpass import getpass
            val = getpass(prompt)
        else:
            val = input(prompt)
    except Exception:
        val = input(prompt)
    if not val:
        return default
    return val


def ensure_env():
    # Load existing .env if present
    values = {}
    if ENV_PATH.exists():
        values = dotenv_values(ENV_PATH)
        load_dotenv(ENV_PATH)
    else:
        # start with empty
        open(ENV_PATH, 'a').close()

    # Required vars
    required = {
        'DB_ENGINE': 'django.db.backends.postgresql',
        'DB_NAME': 'science_publishers',
        'DB_USER': 'sp_user',
        'DB_PASSWORD': None,
        'DB_HOST': 'localhost',
        'DB_PORT': '5432',
    }

    changed = False
    for k, default in required.items():
        if not values.get(k):
            if default is None:
                val = ask(f"Enter value for {k}", default='')
            else:
                val = ask(f"Enter value for {k}", default=str(default))
            if not val:
                print(f"Error: {k} is required. Aborting.")
                sys.exit(1)
            set_key(str(ENV_PATH), k, val)
            values[k] = val
            changed = True

    # Also ensure SECRET_KEY and DEBUG exist (don't overwrite if present)
    if not values.get('SECRET_KEY'):
        sk = ask('Enter SECRET_KEY (or leave blank to generate a placeholder)', default='')
        if not sk:
            sk = 'please-change-me-to-a-secure-secret-in-production'
        set_key(str(ENV_PATH), 'SECRET_KEY', sk)
        values['SECRET_KEY'] = sk

    if not values.get('DEBUG'):
        set_key(str(ENV_PATH), 'DEBUG', 'False')
        values['DEBUG'] = 'False'

    return values


def run(cmd, env=None, check=True, cwd=None):
    print(f"> {cmd}")
    completed = subprocess.run(cmd, shell=True, env=env, cwd=cwd)
    if check and completed.returncode != 0:
        print(f"Command failed: {cmd}")
        sys.exit(1)
    return completed.returncode


def start_postgres_compose():
    print("Starting Postgres service via docker-compose...")
    run('docker compose up -d db', cwd=str(PROJECT_ROOT))


def wait_for_postgres(values, timeout=120):
    import socket
    host = values.get('DB_HOST', 'localhost')
    port = int(values.get('DB_PORT', 5432))
    print(f"Waiting for Postgres at {host}:{port} (timeout {timeout}s)")
    start = time.time()
    while time.time() - start < timeout:
        try:
            with socket.create_connection((host, port), timeout=3):
                print("Postgres is accepting connections")
                return True
        except Exception:
            time.sleep(2)
    print("Timed out waiting for Postgres")
    return False


def dump_sqlite():
    if not BACKEND_MANAGE.exists():
        print('manage.py not found; are you in the project root?')
        sys.exit(1)
    if DUMP_FILE.exists():
        print(f"Existing {DUMP_FILE} found; renaming to {DUMP_FILE}.bak")
        DUMP_FILE.rename(DUMP_FILE.with_suffix('.json.bak'))

    cmd = f"python {BACKEND_MANAGE} dumpdata --natural-foreign --natural-primary --exclude auth.permission --exclude contenttypes --indent 2 > {DUMP_FILE}"
    # run in project root so Django uses correct settings
    run(cmd, cwd=str(PROJECT_ROOT))
    print(f"Data dumped to {DUMP_FILE}")


def migrate_and_load(values):
    # Ensure environment for subprocess includes our .env values
    env = os.environ.copy()
    # load .env values into env
    for k, v in dotenv_values(ENV_PATH).items():
        if v is not None:
            env[k] = v

    # Run migrations
    cmd_migrate = f"python {BACKEND_MANAGE} migrate --noinput"
    run(cmd_migrate, env=env, cwd=str(PROJECT_ROOT))

    # Load data
    cmd_loaddata = f"python {BACKEND_MANAGE} loaddata {DUMP_FILE}"
    run(cmd_loaddata, env=env, cwd=str(PROJECT_ROOT))


def main():
    print('SQLite → PostgreSQL migration helper')
    print('  * This script will create/overwrite a `.env` file in the project root with DB settings if needed.')
    print('  * It uses docker-compose to start a Postgres container (service name: db).')
    print('  * Make a backup of db.sqlite3 before proceeding.')

    values = ensure_env()

    print('\nCurrent database settings to be used:')
    for k in ('DB_ENGINE', 'DB_NAME', 'DB_USER', 'DB_HOST', 'DB_PORT'):
        print(f"  - {k} = {values.get(k)}")

    confirm = ask('Proceed with starting Postgres and migrating data? (yes/no)', default='no')
    if confirm.lower() not in ('y', 'yes'):
        print('Aborted by user.')
        sys.exit(0)

    start_postgres_compose()

    ok = wait_for_postgres(values)
    if not ok:
        print('Postgres did not start in time. Check Docker logs and retry.')
        sys.exit(1)

    print('\nDumping data from SQLite...')
    dump_sqlite()

    print('\nRunning migrations and loading data into Postgres...')
    migrate_and_load(values)

    print('\nMigration complete.')
    print('  - sqlite file retained at db.sqlite3 (do not delete until you verify everything).')
    print(f'  - dump file: {DUMP_FILE}')
    print('\nNext steps:')
    print('  - Inspect your site in Postgres-backed mode by running your server with the environment in .env')
    print('  - After verification you may remove db.sqlite3 and any temporary files.')
    print('\nCommands you can run now:')
    print('```bash')
    print('docker-compose up -d db')
    print('python backend/manage.py migrate')
    print('python backend/manage.py loaddata dumpdata.json')
    print('python backend/manage.py runserver 0.0.0.0:8000')
    print('```')


if __name__ == '__main__':
    main()
