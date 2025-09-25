"""Various utilities."""

from __future__ import annotations

from asyncio import CancelledError, Task
from collections.abc import Awaitable, Mapping
from configparser import ConfigParser
from importlib import resources
from os import PathLike
from typing import Generic, TypeVar

import tornado

M_co = TypeVar('M_co', bound=Mapping[str, object], covariant=True)

async def cancel(task: Task[object]) -> None:
    """Cancel a *task*."""
    task.cancel()
    try:
        await task
    except CancelledError:
        pass

def read_config(*paths: PathLike[str] | str | tuple[str, str]) -> ConfigParser:
    """Read configuration from *paths*.

    For convenience, a path can point to a package resource as a tuple with the items *anchor* and
    *path*, which specifies the *path* to a resource in the package at the given *anchor*.

    Unreadable filesystem paths are ignored. If there is a problem importing a package, an
    :exc:`ImportError` is raised. If there is a problem reading a resource, an :exc:`OSError` is
    raised.

    If there is a problem parsing a config file, a :exc:`configparser.ParsingError` is raised.
    """
    # Ensure all parsing problems are covered by ParsingError
    config = ConfigParser(strict=False, interpolation=None)
    for path in paths:
        if isinstance(path, tuple):
            with (resources.files(path[0]) / path[1]).open() as f:
                config.read_file(f)
        else:
            config.read(path)
    return config

class HTTPServerRequest(tornado.httputil.HTTPServerRequest):
    """HTTP request with type annotations for connection details."""

    remote_ip: str | None

class RequestHandler(tornado.web.RequestHandler, Generic[M_co]):
    """HTTP request handler with enhanced type annotations.

    A default implementation for handling streamed request data is also provided.
    """

    application: Application[M_co]
    request: HTTPServerRequest

    def __init__(
        self, application: Application[M_co], request: HTTPServerRequest, **kwargs: object
    ) -> None:
        super().__init__(application, request, **kwargs)

    def get(self, *args: str, **kwargs: str) -> Awaitable[None] | None:
        # pylint: disable=missing-function-docstring
        return super().get(*args, **kwargs)

    def data_received(self, chunk: bytes) -> Awaitable[None] | None:
        pass

class Application(tornado.web.Application, Generic[M_co]):
    """Web application with type annotations for settings."""

    # __init__() cannot be annotated adequately, because Unpack does not support type variables yet
    # (see https://github.com/python/typing/issues/1399)

    settings: M_co # type: ignore[assignment]
