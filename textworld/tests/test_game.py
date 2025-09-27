# pylint: disable=missing-docstring

import logging

from unittest import IsolatedAsyncioTestCase

class TestCase(IsolatedAsyncioTestCase):
    @classmethod
    def setUpClass(cls) -> None:
        # TESTING
        #logging.disable()
        logging.basicConfig()
