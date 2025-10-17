# pylint: disable=missing-docstring

import logging

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
        self.game = Game(database_url=':memory:')

class GameTest(TestCase):
    def test_init(self) -> None:
        game = context.game.get(None)
        self.assertEqual(game, self.game)

    def test_transaction(self) -> None:
        db = self.game.transaction()
        rows = db.execute('SELECT * FROM sqlite_schema')
        tables: list[Row] = list(rows)
        self.assertFalse(tables)
