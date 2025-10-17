# pylint: disable=missing-docstring

import sqlite3
from sqlite3 import Row

from textworld.update import update
from textworld.util import Connection

from .test_game import TestCase

class UpdateTest(TestCase):
    def test(self) -> None:
        db = sqlite3.connect(':memory:', factory=Connection)
        db.row_factory = Row
        update(db)

        update(db)
        rows = db.execute('SELECT * FROM sqlite_schema')
        tables: list[Row] = list(rows)
        self.assertFalse(tables)
