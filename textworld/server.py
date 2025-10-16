"""Web server."""

from contextlib import AbstractContextManager
from importlib import resources
import logging
from logging import getLogger
from pathlib import Path
from types import TracebackType
from typing import TypedDict

from tornado.httpserver import HTTPServer

from .util import Application, RequestHandler

class _Settings(TypedDict):
    url: str

class _RequestHandler(RequestHandler[_Settings]):
    def set_default_headers(self) -> None:
        self.set_header('Server', 'textworld')

    def log_exception(
        self, typ: type[BaseException] | None, value: BaseException | None, tb: TracebackType | None
    ) -> None:
        if typ and value:
            getLogger(__name__).error('Unhandled error occurred on %s %s', self.request.method,
                                      self.request.uri, exc_info=(typ, value, tb))

class _Worlds(RequestHandler[_Settings]):
    pass

class _Client(_RequestHandler):
    def get(self, *args: str, **kwargs: str) -> None:
        self.render('index.html')

def _log(handler: _RequestHandler) -> None:
    request = handler.request
    status = handler.get_status()
    if status >= 500:
        level = logging.ERROR
    elif status >= 400:
        level = logging.WARNING
    else:
        level = logging.INFO
    getLogger(__name__).log(level, '%s %s %s %s %.2fms', request.remote_ip or '-', request.method,
                            request.uri, status, request.request_time() * 1000)

class Server:
    """Game web server."""

    def __init__(self, _http: HTTPServer, _client_directory: AbstractContextManager[Path]) -> None:
        self._http = _http
        self._client_directory = _client_directory

    @property
    def url(self) -> str:
        """Server URL."""
        assert isinstance(self._http.request_callback, Application) # type: ignore[misc]
        app: Application[_Settings] = self._http.request_callback
        return app.settings['url']

    def close(self) -> None:
        """Stop the server."""
        self._http.stop()
        self._client_directory.__exit__(None, None, None)

def serve(*, host: str = '', port: int = 8080) -> Server:
    """Serve the active game over the web.

    Incoming connections are listened for on the given *host* and *port*.

    If there is a problem starting the server, an :exc:`OSError` is raised.
    """
    url_host = host or 'localhost'
    url = f'http://{url_host}:{port}/'

    client_directory = resources.as_file(resources.files(f'{__package__}.res') / 'client')
    client_path = client_directory.__enter__()
    try:
        app: Application[_Settings] = Application(
            [('/api/worlds', _Worlds), ('/.*', _Client)], compress_response=True, log_function=_log,
            template_path=client_path, static_path=client_path, url=url)
        http = app.listen(port, address=host, xheaders=True)
        return Server(http, client_directory)
    except:
        client_directory.__exit__(None, None, None)
        raise
