# pylint: disable=missing-docstring

from .test_game import TestCase

class ServerTestCase(TestCase):
    pass

class ClientTest(ServerTestCase):
    async def test_get(self) -> None:
        pass
