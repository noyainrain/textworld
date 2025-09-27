# pylint: disable=missing-docstring

from http import HTTPStatus

from tornado.httpclient import AsyncHTTPClient

from textworld.server import serve

from .test_game import TestCase

class ServerTestCase(TestCase):
    async def asyncSetUp(self) -> None:
        await super().asyncSetUp()
        self.server = serve(host='localhost', port=16160)
        self.addCleanup(self.server.close)

class ClientTest(ServerTestCase):
    async def test_get(self) -> None:
        response = await AsyncHTTPClient().fetch(self.server.url, raise_error=False)
        # TESTING
        print('HEADERS', response.headers)
        print('BODY', response.body)
        self.assertEqual(response.code, HTTPStatus.OK)
