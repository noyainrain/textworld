"""Database update logic."""

from sqlite3 import Row

from .util import Connection

def update(db: Connection[Row]) -> None:
    """Plumbing: Update the database *db*."""
    with db:
        db.execute('CREATE TABLE IF NOT EXISTS players (id PRIMARY KEY, create_time)')
        db.execute(
            """
            CREATE TABLE IF NOT EXISTS devices (
                id PRIMARY KEY,
                create_time,
                token,
                player_id REFERENCES players
            )
            """)
