"""Game logic."""

import sqlite3
from sqlite3 import Row

from . import context
from .update import update
from .util import Connection

class Game:
    """Co-op text adventure game.

    The game is automatically set as the active :data:`context.game`.

    .. attribute:: database_url

       ...
    """

    def __init__(self, *, database_url: str = 'textworld.db') -> None:
        self.database_url = database_url
        self._db: Connection[Row] | None = None

        try:
            context.game.get()
        except LookupError:
            context.game.set(self)
        else:
            raise RuntimeError('Duplicate context game')

    def transaction(self) -> Connection[Row]:
        """Plumbing: ..."""
        if not self._db:
            self._db = sqlite3.connect(self.database_url, factory=Connection)
            self._db.row_factory = Row
            update(self._db)
        return self._db
