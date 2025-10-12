# pylint: disable=missing-docstring

from asyncio import Runner
from collections.abc import Callable
from contextlib import chdir
from functools import partial
from tempfile import TemporaryDirectory
from threading import Thread
from unittest import TestCase

from selenium.webdriver import Firefox

from textworld.__main__ import main

class UITest(TestCase):
    def setUp(self) -> None:
        # Work around Pylint not considerung alternative ways to enter a context (see
        # https://github.com/pylint-dev/pylint/issues/9162)
        # pylint: disable=consider-using-with
        path = self.enterContext(TemporaryDirectory())
        self.enterContext(chdir(path))

        # References to the task and event loop are needed to cleanly terminate the thread
        runner = Runner()
        self.addCleanup(runner.close)
        loop = runner.get_loop()
        task = loop.create_task(main())

        thread = Thread(target=partial(loop.run_until_complete, task))
        thread.start()
        self.addCleanup(thread.join)
        cancel: Callable[[], bool] = task.cancel
        self.addCleanup(loop.call_soon_threadsafe, cancel)

        self.browser = Firefox()
        self.addCleanup(self.browser.quit)

    def test(self) -> None:
        pass
