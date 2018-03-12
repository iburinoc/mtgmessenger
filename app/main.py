import os
import sys

from aiohttp import web

import hook

def add_routes(app):
    app.router.add_get('/hook', hook.hook_get)
    app.router.add_post('/hook', hook.hook_post)

def main():
    if len(sys.argv) < 2:
        access_token = os.environ['ACCESS_TOKEN']
    else:
        access_token = sys.argv[1]

    app = web.Application()
    app['access_token'] = access_token

    add_routes(app)

    web.run_app(app, host='0.0.0.0', port=12000)

if __name__ == '__main__':
    main()

