"""Various utilities."""

from __future__ import annotations

from collections.abc import Awaitable, Mapping
from typing import Generic, TypeVar

import tornado

M_co = TypeVar('M_co', bound=Mapping[str, object], covariant=True)

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
