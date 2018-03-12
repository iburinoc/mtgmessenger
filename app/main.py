import logging
import os
import sys

from aiohttp import web, ClientSession

import hook

def add_routes(app):
    app.router.add_get('/hook', hook.hook_get)
    app.router.add_post('/hook', hook.hook_post)

def setup_client_session(app):
    async def init_session(app):
        app['client_session'] = ClientSession()
    async def close_session(app):
        await app['client_session'].close()
    app.on_startup.append(init_session)
    app.on_cleanup.append(close_session)

def setup_logging(app):
    aio_logger = logging.getLogger('aiohttp.access')
    aio_logger.setLevel(logging.INFO)

    mtgbot_logger = logging.getLogger('mtgbot')
    mtgbot_logger.setLevel(logging.INFO)

    handler = logging.StreamHandler(sys.stdout)
    aio_logger.addHandler(logging.StreamHandler(sys.stdout))
    mtgbot_logger.addHandler(logging.StreamHandler(sys.stdout))

def main():
    if len(sys.argv) < 2:
        access_token = os.environ['ACCESS_TOKEN']
    else:
        access_token = sys.argv[1]

    app = web.Application()
    app['access_token'] = access_token

    add_routes(app)
    setup_client_session(app)

    setup_logging(app)

    web.run_app(app, host='0.0.0.0', port=12000)

if __name__ == '__main__':
    main()
