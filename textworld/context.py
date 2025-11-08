"""Context-local state.

.. data:: game

   Active game.
"""

from __future__ import annotations

from contextvars import ContextVar
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .core import Player
    from .game import Game

game: ContextVar[Game] = ContextVar('game')
player: ContextVar[Player] = ContextVar('player')
