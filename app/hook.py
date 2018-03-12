import asyncio
from aiohttp import web

async def hook_get(request):
    params = request.query
    if params.get('hub.verify_token', None) != 'test_token':
        return web.Response(text='Invalid verification token', status=403)
    return web.Response(text=params.get('hub.challenge', None))

async def hook_post(request):
    request.loop.create_task(do_the_thing('hello'))
    return web.Response(text='done')

async def do_the_thing(out):
    await asyncio.sleep(1)
    print(out)
