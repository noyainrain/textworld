"""Web server."""

import logging
from logging import getLogger
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

class _Client(_RequestHandler):
    def get(self, *args: str, **kwargs: str) -> None:
        # TESTING
        # raise ValueError('lol')
        pass

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

    def __init__(self, _http: HTTPServer) -> None:
        self._http = _http

    @property
    def url(self) -> str:
        """Server URL."""
        assert isinstance(self._http.request_callback, Application) # type: ignore[misc]
        app: Application[_Settings] = self._http.request_callback
        return app.settings['url']

    def close(self) -> None:
        """Stop the server."""
        self._http.stop()

def serve(*, host: str = '', port: int = 8080) -> Server:
    """Serve the active game over the web.

    Incoming connections are listened for on the given *host* and *port*.

    If there is a problem starting the server, an :exc:`OSError` is raised.
    """
    url_host = host or 'localhost'
    url = f'http://{url_host}:{port}/'

    app: Application[_Settings] = Application([('/.*', _Client)], compress_response=True,
                                              log_function=_log, url=url)
    http = app.listen(port, address=host, xheaders=True)
    return Server(http)
