import asyncio_redis
import logging
import os
import sys

from aiohttp import web, ClientSession

import hook
import upload

def add_routes(app):
    PREFIX = '/api' if app['debug'] else ''
    app.router.add_get(PREFIX + '/hook', hook.hook_get)
    app.router.add_post(PREFIX + '/hook', hook.hook_post)

    app.router.add_post(PREFIX + '/upload', upload.upload_post)

    if app['debug']:
        app.router.add_static('/', path='../static/', name='static')

def setup_http_session(app):
    async def init_session(app):
        app['http_session'] = ClientSession(
                loop=app.loop)
    async def close_session(app):
        await app['http_session'].close()
    app.on_startup.append(init_session)
    app.on_cleanup.append(close_session)

def setup_redis_session(app):
    async def init_session(app):
        app['redis_session'] = await asyncio_redis.Connection.create(
                host='localhost',
                port=6379,
                encoder=asyncio_redis.encoders.BytesEncoder(),
                loop=app.loop)
    async def close_session(app):
        app['redis_session'].close()
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
        fb_secret = os.environ['FB_SECRET']
    else:
        fb_secret = sys.argv[1]

    app = web.Application()
    app['fb_secret'] = fb_secret
    app['debug'] = 'DEBUG' in os.environ and os.environ['DEBUG']

    add_routes(app)
    setup_http_session(app)
    setup_redis_session(app)

    setup_logging(app)

    web.run_app(app, host='0.0.0.0', port=12000)

if __name__ == '__main__':
    main()
