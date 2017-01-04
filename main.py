import sys

import server
import sender

def main():
	if len(sys.argv) < 2:
		print 'Pass in ACCESS_TOKEN as first parameter'
		return

	send = sender.Sender(sys.argv[1], simple=True)
	server.send = send

	try:
		server.app.run(port=12000)
	except:
		send.stop()

		raise

if __name__ == '__main__':
	main()

