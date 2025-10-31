"""Core concepts."""

from datetime import datetime

from pydantic import BaseModel

from . import context

class Player(BaseModel): # type: ignore[explicit-any]
    """Player of the game.

    See TODO.
    """

    id: str
    create_time: datetime

class Device(BaseModel): # type: ignore[explicit-any]
    """Player device.

    See TODO.
    """

    id: str
    create_time: datetime
    token: str
    player_id: str

    def get_player(self) -> Player:
        """Get the device owner."""
        return context.game.get().get_player(self.player_id)
