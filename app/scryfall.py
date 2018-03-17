import logging

NAMED='https://api.scryfall.com/cards/named'
SEARCH='https://api.scryfall.com/cards/search'
CARDS='https://api.scryfall.com/cards'

async def query_card(params, session):
    async with session.get(NAMED,
            params=params,
            timeout=60) as resp:
        data = await resp.json()
        logging.getLogger('mtgbot')\
                .info('scryfall query: %s, res: %s', params, resp.status)
        return data if resp.status == 200 else None

async def get_cards_page(page, session):
    async with session.get(CARDS,
            params={'page': page},
            timeout=60) as resp:
        data = await resp.json()
        return data if resp.status == 200 else None

async def card_by_id(card_id, session):
    if isinstance(card_id, bytes):
        card_id = card_id.decode('utf-8')
    async with session.get('{}/{}'.format(CARDS, card_id),
            timeout=60) as resp:
        data = await resp.json()
        return data if resp.status == 200 else None

def get_image_uri(card):
    if 'image_uris' not in card and 'card_faces' in card:
        card_face = card['card_faces'][0]
    else:
        card_face = card
    return card_face['image_uris']['normal']
