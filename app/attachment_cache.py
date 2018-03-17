import logging
import msgpack
import urllib

import facebook
import scryfall

async def get_aid(card_id, redis_session=None, app=None):
    if app:
        redis_session = app['redis_session']

    if not redis_session:
        return None

    if isinstance(card_id, str):
        card_id = card_id.encode('utf-8')
    entry = await redis_session.get(card_id)

    if not entry:
        return None

    (aid, ver) = msgpack.unpackb(entry)
    return aid.decode('utf-8')

async def get_and_set(card=None,
        card_id=None,
        redis_session=None,
        http_session=None,
        fb_secret=None,
        app=None):
    if app:
        redis_session = app['redis_session']
        http_session = app['http_session']
        fb_secret = app['fb_secret']

    if card:
        card_id = card['id']

    if not card_id:
        return None

    if isinstance(card_id, str):
        card_id = card_id.encode('utf-8')

    aid = await get_aid(card_id, redis_session)

    logging.getLogger('mtgbot')\
            .info('Cache entry: %s, %s', card_id, aid)

    if not aid:
        # if we don't have the actual card, now we need to fetch it from scryfall
        if not card:
            card = await scryfall.card_by_id(card_id, http_session)
        # need to actually make one
        uri = scryfall.get_image_uri(card)
        aid = facebook.upload_attachment(uri, http_session, fb_secret)

        ver = urllib.parse.urlparse(uri).query.encode('utf-8')
        await redis_session.set(card_id.encode('utf-8'),
                msgpack.packb((aid, ver)))
    return aid
