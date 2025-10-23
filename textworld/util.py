"""Various utilities."""

from __future__ import annotations

from asyncio import CancelledError, Task
from collections.abc import Awaitable, Callable, Mapping
from configparser import ConfigParser
from importlib import resources
from os import PathLike
import random
import sqlite3
from string import ascii_lowercase
from typing import Generic, Protocol, TypeVar

import tornado

T_co = TypeVar("T_co", covariant=True)
M_co = TypeVar('M_co', bound=Mapping[str, object], covariant=True)

def randstr(length: int = 16, *, characters: str = ascii_lowercase) -> str:
    """Generate a random string with the given *length*.

    The result is comprised of the given set of *characters*.
    """
    # To be suitable for IDs, the default length l is chosen such that
    # 1 - exp(-n * (n - 1) / (2 * c ** l)) <= p, where the probability of collision p = 1‰, the
    # presumed number of entities n = 1000000 and the size of the character set c = 26. (see
    # https://en.wikipedia.org/wiki/Birthday_problem)
    return ''.join(random.choice(characters) for _ in range(length))

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

RowFactory = Callable[[sqlite3.Cursor, tuple[object, ...]], T_co]

class SupportsLenAndGetItem(Protocol):
    # pylint: disable=missing-class-docstring
    def __len__(self) -> int: ...
    def __getitem__(self, key: int) -> object: ...

class Cursor(sqlite3.Cursor, Generic[T_co]):
    """Database cursor with row type annotations."""

    row_factory: RowFactory[T_co] # type: ignore[assignment]

    # Iter type is wrong / Any (and thus list()) because of
    # https://github.com/python/mypy/issues/16492

    def __next__(self) -> T_co:
        row: T_co = super().__next__()
        return row

class Connection(sqlite3.Connection, Generic[T_co]):
    """Database connection with row type annotations."""

    row_factory: RowFactory[T_co]

    def execute(self, sql: str,
                parameters: SupportsLenAndGetItem | Mapping[str, object] = ()) -> Cursor[T_co]:
        # pylint: disable=missing-function-docstring
        return super().cursor(factory=Cursor).execute(sql, parameters)

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
