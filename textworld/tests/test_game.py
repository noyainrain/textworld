# pylint: disable=missing-docstring

import logging

from datetime import UTC, datetime
from sqlite3 import Row
from unittest import IsolatedAsyncioTestCase

from textworld import context
from textworld.game import Game

class TestCase(IsolatedAsyncioTestCase):
    @classmethod
    def setUpClass(cls) -> None:
        # TESTING
        #logging.disable()
        logging.basicConfig()

    def setUp(self) -> None:
        self._now = datetime(2025, 9, 18, tzinfo=UTC)
        # OQ should it be public like in streamfarer? why, we can always get it with game.now()?
        # (maybe the idea was to mirror tick...)
        def now() -> datetime:
            return self._now
        self.game = Game(database_url=':memory:', now=now)

class GameTest(TestCase):
    def test_init(self) -> None:
        game = context.game.get(None)
        self.assertEqual(game, self.game)

    def test_authenticate_without_token(self) -> None:
        device = self.game.authenticate()
        self.assertEqual(device, self.game.get_device(device.id))
        self.assertEqual(device.create_time, self.game.now())
        player = device.get_player()
        self.assertEqual(player.create_time, self.game.now())

    def test_transaction(self) -> None:
        db = self.game.transaction()
        rows = db.execute('SELECT * FROM sqlite_schema')
        tables: list[Row] = list(rows)
        self.assertTrue(tables)
