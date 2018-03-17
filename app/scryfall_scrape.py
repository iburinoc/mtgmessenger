import aiohttp
import asyncio
import asyncio_redis
import logging
import msgpack
import os
import sys
import urllib

import facebook
import scryfall

FB_SECRET = sys.argv[1] if len(sys.argv) > 1 else os.environ['ACCESS_TOKEN']

logger = logging.getLogger('mtgbot.scrape')

async def process_card(card, http_session, redis_session):
    # use scryfall id to identify cards
    cid = card['id'].encode('utf-8')
    val = await redis_session.get(cid)

    uri = scryfall.get_image_uri(card)
    ver = urllib.parse.urlparse(uri).query.encode('utf-8')

    if val:
        (old_aid, old_ver) = msgpack.unpackb(val)

        if old_ver == ver:
            logger.debug('Not updating: %s, %s', card['name'], old_aid)
            # nothing to do
            return

    aid = await facebook.upload_attachment(uri, http_session, FB_SECRET)
    logger.debug('Updated: %s, %s', card['name'], aid)

    await redis_session.set(cid, msgpack.packb((aid, ver)))

async def scrape_cards(http_session, redis_session):
    loop = asyncio.get_event_loop()
    i = 1
    while True:
        logger.info('Getting: %d', i)
        data = await scryfall.get_cards_page(i, http_session)
        if not data:
            break

        futures = [
            process_card(card, http_session, redis_session)
            for card in data['data']]

        await asyncio.wait(futures)

        logger.info('Done page: %d', i)
        if not data['has_more']:
            break
        i+=1

async def main():
    try:
        http_session = aiohttp.ClientSession()
        redis_session = await asyncio_redis.Connection.create(
                host='localhost',
                port=6379,
                encoder=asyncio_redis.encoders.BytesEncoder())

        logger.setLevel(logging.DEBUG)
        logger.addHandler(logging.StreamHandler(sys.stdout))

        await scrape_cards(http_session, redis_session)
    finally:
        if http_session:
            await http_session.close()
        if redis_session:
            redis_session.close()

loop = asyncio.get_event_loop()
loop.run_until_complete(main())
