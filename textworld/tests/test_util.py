# pylint: disable=missing-docstring

from asyncio import create_task, sleep
from importlib import resources
from unittest import IsolatedAsyncioTestCase, TestCase

from textworld.util import cancel, read_config

class CancelTest(IsolatedAsyncioTestCase):
    async def test(self) -> None:
        task = create_task(sleep(1))
        await cancel(task)
        self.assertTrue(task.cancelled())

class ReadConfigTest(TestCase):
    def test(self) -> None:
        with resources.as_file(resources.files(f'{__package__}.res') / 'cat2.ini') as path:
            config = read_config(path)
        try:
            options = dict(config['cat'])
        except KeyError:
            self.fail()
        cat = {'age': '7'}
        self.assertEqual(options, cat)
