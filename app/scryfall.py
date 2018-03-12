import logging

NAMED='https://api.scryfall.com/cards/named'
SEARCH='https://api.scryfall.com/cards/search'

async def query_card(params, app):
    session = app['client_session']
    async with session.get(NAMED,
            params=params,
            timeout=60) as resp:
        data = await resp.json()
        logging.getLogger('mtgbot')\
                .info('scryfall query: %s, res: %s', params, resp.status)
        return data if resp.status == 200 else None
