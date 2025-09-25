# pylint: disable=missing-docstring

from asyncio import create_task
from tornado.httpclient import AsyncHTTPClient

from textworld.util import cancel
from textworld.__main__ import main

from .test_game import TestCase

class MainTest(TestCase):
    async def test(self) -> None:
        task = create_task(main())
        try:
            await AsyncHTTPClient().fetch('http://localhost:8080/')
        except OSError:
            self.fail()
        finally:
            await cancel(task)
