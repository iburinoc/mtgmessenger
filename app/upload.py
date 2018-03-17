from aiohttp import web

import facebook

async def upload_post(request):
    data = await request.json()
    if 'url' not in data:
        return web.Response(text='Malformed request', status=400)

    url = data['url']
    if not url.startswith('https://img.scryfall.com'):
        return web.Response(text='Not scryfall image', status=400)

    aid = await facebook.upload_attachment(url, app=request.app)

    return web.json_response({'attachment_id': aid})
