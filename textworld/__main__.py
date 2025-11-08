"""Command-line interface."""

import asyncio
from asyncio import CancelledError, Event
import logging
from logging import getLogger
import sys

from .server import serve

async def main() -> int:
    """Run Text World."""
    logging.basicConfig(format='%(asctime)s %(levelname)s %(name)s %(message)s', level=logging.INFO)
    logger = getLogger(__name__)

    try:
        server = serve()
    except OSError as e:
        print(f'⚠️ Failed to start the web server ({e})', file=sys.stderr)
        return 1
    logger.info('Started the web server at %s', server.url)

    try:
        await Event().wait()
    except CancelledError:
        pass
    finally:
        server.close()
        logger.info('Stopped the web server')

    # Treat cancellation as usage error
    print('canceled', file=sys.stderr)
    return 2

if __name__ == '__main__':
    sys.exit(asyncio.run(main()))
