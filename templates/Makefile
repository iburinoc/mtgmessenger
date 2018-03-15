HANDLEJS=../static/webview/templates.js
INDEX=../static/webview/index.html

.PHONY: handlebars index extversion $(INDEX)

VERSION=1

PAT=

all: handlebars index

handlebars: $(HANDLEJS)

index: $(INDEX)

$(HANDLEJS): $(wildcard *.handlebars)
	handlebars $^ -f $@

$(INDEX): index.html
	sed "s/VERSION/$(VERSION)/g" $< > $@

extversion:
	curl -X POST -H "Content-Type: application/json" -d '{ \
		"home_url": { \
			"url": "https://mtgbot.seanp.xyz/webview/index.html?v=$(VERSION)", \
			"webview_height_ratio": "tall", \
			"in_test": false, \
		} \
	}' "https://graph.facebook.com/v2.6/me/messenger_profile?access_token=$(PAT)"
