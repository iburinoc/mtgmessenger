import os
import sys

import server
import sender

def main():
    if len(sys.argv) < 2:
        access_token = os.environ['ACCESS_TOKEN']
    else:
        access_token = sys.argv[1]

    send = sender.Sender(access_token, simple=True)
    server.send = send

    try:
        server.app.run('0.0.0.0', port=8000)
    except:
        send.stop()

        raise

if __name__ == '__main__':
    main()

