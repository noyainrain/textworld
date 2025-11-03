"""Game logic."""

from collections.abc import Callable
from datetime import UTC, datetime
from functools import partial
from secrets import token_urlsafe

import sqlite3
from sqlite3 import Row

from . import context
from .core import Device, Player
from .update import update
from .util import Connection, randstr

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

    def get_player(self, player_id: str) -> Player:
        """Get the player with the given *player_id*.

        See TODO.
        """
        with self.transaction() as db:
            rows = db.execute('SELECT * FROM players WHERE id = ?', (player_id, ))
            try:
                return Player.model_validate(dict(next(rows)))
            except StopIteration:
                raise KeyError(player_id) from None

    def get_device(self, device_id: str) -> Device:
        """Get the device with the given *device_id*.

        See TODO.
        """
        with self.transaction() as db:
            rows = db.execute('SELECT * FROM devices WHERE id = ?', (device_id, ))
            try:
                return Device.model_validate(dict(next(rows)))
            except StopIteration:
                raise KeyError(device_id) from None

    def _sign_in(self) -> Device:
        with self.transaction() as db:
            player_id = randstr()
            now = self.now().isoformat()
            db.execute('INSERT INTO players (id, create_time) VALUES (?, ?)', (player_id, now))
            rows = db.execute(
                """
                INSERT INTO devices (id, create_time, token, player_id) VALUES (?, ?, ?, ?)
                RETURNING *
                """,
                (randstr(), now, token_urlsafe(), player_id))
            return Device.model_validate(dict(next(rows)))

    def authenticate(self, token: str | None = None) -> Device:
        """Authenticate a player device with *token*.

        Without a token, implicit auth, creating a guest player.

        copied form room:
		Authenticate a player with *token*.

        If authentication fails, a :exc:`LookupError` is raised.
        """
        if token is None:
            device = self._sign_in()
        else:
            with self.transaction() as db:
                rows = db.execute('SELECT * FROM devices WHERE token = ?', (token, ))
                try:
                    device = Device.model_validate(dict(next(rows)))
                except StopIteration:
                    raise LookupError(token) from None
        return device

    def transaction(self) -> Connection[Row]:
        """Plumbing: ..."""
        if not self._db:
            self._db = sqlite3.connect(self.database_url, factory=Connection)
            self._db.row_factory = Row
            self._db.execute('PRAGMA foreign_keys = 1')
            update(self._db)
        return self._db
