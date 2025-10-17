# pylint: disable=missing-docstring

import logging

from unittest import IsolatedAsyncioTestCase

from textworld.game import Game

class TestCase(IsolatedAsyncioTestCase):
    @classmethod
    def setUpClass(cls) -> None:
        # TESTING
        #logging.disable()
        logging.basicConfig()

    def setUp(self) -> None:
        self.game = Game()
