# pylint: disable=missing-docstring

from asyncio import create_task, sleep
from unittest import IsolatedAsyncioTestCase

from textworld.util import cancel

class CancelTest(IsolatedAsyncioTestCase):
    async def test(self) -> None:
        task = create_task(sleep(1))
        await cancel(task)
        self.assertTrue(task.cancelled())
