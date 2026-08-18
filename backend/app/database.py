import os

import psycopg
from psycopg.rows import dict_row


def get_connection():
    return psycopg.connect(
        host=os.getenv("POSTGRES_HOST", "localhost"),
        port=os.getenv("POSTGRES_PORT", "5433"),
        dbname=os.getenv("POSTGRES_DB", "ai_operations"),
        user=os.getenv("POSTGRES_USER", "ai_user"),
        password=os.getenv("POSTGRES_PASSWORD", "ai_password"),
        row_factory=dict_row,
    )