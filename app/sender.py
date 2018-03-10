import re
import urllib
import requests
import ujson
from queue import Queue, Empty
from threading import Event

matcher = re.compile(r'\[\[(.*)\]\]')

class Sender(object):
    def __init__(self, access_key, simple=False):
        self.access_key = access_key
        self.queue = Queue()
        self.stopped = Event()

        if simple:
            self.post = self._handle

    def post(self, user_id, body):
        self.queue.put((user_id, body))

    def run(self):
        while not self.stopped.is_set():
            try:
                uid, body = self.queue.get(True, 0.1)
                self._handle(uid, body)
            except Empty:
                pass

    def stop(self):
        self.stopped.set()

    def _handle(self, user_id, body):
        for match in matcher.finditer(body):
            self._send(user_id, match.group(1))

    def _send(self, user_id, name):
        body = {
            'recipient': {
                'id': user_id
            },
            'message': {
                'attachment': {
                    'type': 'image',
                    'payload': {
                        'url': 'http://gatherer.wizards.com/Handlers/Image.ashx?' + \
                            urllib.parse.urlencode({'name': name, 'type': 'card'})
                    }
                }
            }
        }

        requests.post('https://graph.facebook.com/v2.6/me/messages',
            data=ujson.dumps(body),
            params={'access_token': self.access_key},
            headers={'Content-Type': 'application/json'})
