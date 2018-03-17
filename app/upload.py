import json

from aiohttp import web

import attachment_cache

async def upload_post(request):
    data = await request.json()
    if 'card_id' not in data:
        return web.Response(text='Malformed request', status=400)

    card_id = data['card_id']

    attachment_id = await attachment_cache.get_and_set(
            card_id=card_id, app=request.app)

    resp = {'attachment_id': attachment_id}
    return web.json_response(resp)
