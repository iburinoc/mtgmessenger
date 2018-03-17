import logging

import aiohttp

ATTACHMENT_UPLOAD='https://graph.facebook.com/v2.6/me/message_attachments'
SEND_MESSAGE='https://graph.facebook.com/v2.6/me/messages'

async def upload_attachment(url, session=None, secret=None, app=None):
    if app:
        session = app['client_session']
        secret = app['access_token']
    message = {
        'message': {
            'attachment': {
                'type': 'image',
                'payload': {
                    'is_reusable': True,
                    'url': url,
                }
            }
        }
    }
    async with session.post(ATTACHMENT_UPLOAD,
            params={'access_token': secret},
            json=message) as resp:
        data = (await resp.json())['attachment_id']
        logging.getLogger('mtgbot')\
            .info('uploaded attachment: %s', data)
        return data

async def send_message(message, session=None, secret=None, app=None):
    if app:
        session = app['client_session']
        secret = app['access_token']

    async with session.post(SEND_MESSAGE,
            params={'access_token': secret},
            json=message) as resp:
        text = await resp.text()
        logging.getLogger('mtgbot')\
            .info('sent message: %s, %s', resp.status, text)
