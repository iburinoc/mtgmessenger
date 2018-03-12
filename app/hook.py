import logging

import asyncio
from aiohttp import web

import facebook
import scryfall

async def hook_get(request):
    params = request.query
    token = params.get('hub.verify_token', None)
    logging.getLogger('mtgbot').info(
        'verification token: %s', token)
    if token != 'test_token':
        return web.Response(text='Invalid verification token', status=403)
    return web.Response(text=params.get('hub.challenge', None))

async def hook_post(request):
    data = await request.json()
    for item in data.get('entry', []):
        if 'messaging' not in item:
            continue
        for message in item['messaging']:
            uid = message['sender']['id']
            name = message['message']['text']

            request.loop.create_task(
                    send_card(uid, name, request.app))
    return web.Response()

async def send_card(uid, name, app):
    card = await scryfall.query_card({'fuzzy': name}, app)

    message = {
        'messaging_type': 'RESPONSE',
        'recipient': {
            'id': uid,
        },
    }

    logging.getLogger('mtgbot').info('uid: %s, name: %s, card: %s', uid, name, card)
    if card:
        attachment_id = await facebook.upload_attachment(
            card['image_uris']['normal'], app)

        logging.getLogger('mtgbot').info('card %s, attachment id %s', name, attachment_id)

        message['message'] = {
            'attachment': {
                'type': 'template',
                'payload': {
                    'template_type': 'media',
                    'elements': [{
                        'media_type': 'image',
                        'attachment_id': attachment_id,
                        'buttons': [{
                            'type': 'web_url',
                            'url': card['scryfall_uri'],
                            'title': 'Scryfall',
                            }],
                    }],
                },
            },
        }
    else:
        message['message'] = {
            'text': 'Card {} not found'.format(name)
        }

    await facebook.send_message(message, app)
