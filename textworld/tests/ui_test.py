# pylint: disable=missing-docstring

from asyncio import Runner
from collections.abc import Callable
from contextlib import chdir
from functools import partial
import os
from tempfile import TemporaryDirectory
from threading import Thread
from unittest import TestCase

from selenium.webdriver import Firefox, Remote
from selenium.webdriver.common.options import ArgOptions
from selenium.webdriver.remote.client_config import ClientConfig

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

        if sauce_user := os.environ.get('SAUCE_USERNAME'):
            sauce_key = os.environ.get('SAUCE_ACCESS_KEY')
            region = os.environ.get('SAUCE_REGION')
            url = f'https://ondemand.{region}.saucelabs.com/wd/hub'
            client_config = ClientConfig(url, username=sauce_user, password=sauce_key)
            options = ArgOptions()
            # SELENIUM_BROWSER only for js, not really used by python lib
            options.set_capability('browserName', os.environ.get('SAUCE_BROWSER', 'firefox'))
            options.set_capability('platformName', os.environ.get('SAUCE_PLATFORM', 'linux'))
            # name, build, tags
            sauce_options = {'tunnelName': os.environ.get('SAUCE_TUNNEL_NAME'), 'name': self.id(),
                             'build': os.environ.get('SAUCE_BUILD')}
            options.set_capability('sauce:options', sauce_options)
            # OQ how to not pass url twice?
            self.browser = Remote(url, options=options, client_config=client_config)
        else:
            self.browser = Firefox()
        self.addCleanup(self.browser.quit)

    def test(self) -> None:
        pass
