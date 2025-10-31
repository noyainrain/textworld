"""Game logic."""

from collections.abc import Callable
from datetime import UTC, datetime
from functools import partial

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

    .. attribute:: now

       Function that returns the current UTC date and time.
    """

    def __init__(self, *, database_url: str = 'textworld.db',
                 now: Callable[[], datetime] = partial(datetime.now, UTC)) -> None:
        self.database_url = database_url
        self.now = now
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
            self._db.execute('PRAGMA foreign_keys = 1')
            update(self._db)
        return self._db
