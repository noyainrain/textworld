# pylint: disable=missing-docstring

import logging

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
        self.game = Game()

class GameTest(TestCase):
    def test_init(self) -> None:
        game = context.game.get(None)
        self.assertEqual(game, self.game)
