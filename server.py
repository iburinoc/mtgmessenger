from flask import Flask, Response, request

app = Flask(__name__)

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
	print args
	return '', 200

if __name__ == '__main__':
	app.run(port=12000, debug=True)

