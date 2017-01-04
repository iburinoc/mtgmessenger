import sys
import ujson
from flask import Flask, Response, request

import sender

app = Flask(__name__)
send = None

@app.route("/hook", methods=['GET', 'POST'])
def hook():
	if request.method == 'GET':
		return hook_get(request.args)
	else:
		return hook_post(request.args)

def hook_get(args):
	if args.get('hub.verify_token') != 'test_token':
		return 'Invalid verification token', 403
	return args.get('hub.challenge'), 200

def hook_post(args):
	if send:
		data = ujson.loads(request.data)
		for item in data['entry']:
			if 'messaging' not in item:
				continue
			uid = item['messaging']['sender']['id']
			name = item['messaging']['message']['text']

			send.post(uid, name)

	return '', 200

if __name__ == '__main__':
	app.run(port=12000, debug=True)

