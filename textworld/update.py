"""Database update logic."""

from sqlite3 import Row

from .util import Connection

def update(db: Connection[Row]) -> None:
    """Plumbing: Update the database *db*."""
    with db:
        pass
