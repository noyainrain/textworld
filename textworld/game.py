"""Game logic."""

from . import context

class Game:
    """Co-op text adventure game.

    The game is automatically set as the active :data:`context.game`.
    """

    def __init__(self) -> None:
        try:
            context.game.get()
        except LookupError:
            context.game.set(self)
        else:
            raise RuntimeError('Duplicate context game')
