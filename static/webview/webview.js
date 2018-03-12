var cards = [];

function share_card(idx) {
    // Upload attachment
    $.ajax({
        url: 'https://mtgbot.seanp.xyz/api/upload/',
        method: 'POST',
    });
    var card = cards[idx];
    var message = {
        attachment: {
            type: 'template',
            payload: {
                template_type: 'generic',
            },
        },
    };
    function build_element(card_face) {
        return {
            title: card_face.name,
            image_url: card_face.image_uris.normal,
            buttons: [{
                type: 'web_url',
                url: card.scryfall_uri,
                title: 'Scryfall',
            }]
        };
    }
    if (card.card_faces === undefined)
        message.attachment.payload.elements = [
            build_element(card),
        ];
    else
        message.attachment.payload.elements = card
            .card_faces
            .map(build_element);

    MessengerExtensions.beginShareFlow(
        function(share_response) {
            if (share_response.is_sent)
                MessengerExtensions.requestBrowserClose();
        },
        function(errorCode, errorMessage) {},
        message,
        'current_thread');
}

function row_click(idx) {
    console.log(idx);
    return function(event) {
        $(".cs-card-row").removeClass('active');
        $("#row-" + idx).toggleClass('active');
    }
}

function share_click(idx) {
    return function(event) {
        console.log('share ' + idx);

        event.stopPropagation();

        share_card(idx);
    }
}

Handlebars.registerPartial('cost', Handlebars.templates.cost);
function build_card_row(card) {
    var row_template = Handlebars.templates.row;
    return row_template({
            id: card.id,
            name: card.name,
            cost: card.cost,
        })
}

function parse_manacost(cost) {
    var regex = /{[WUBRG/0-9]*}/g;
    var costs = cost.match(regex);
    return costs === null ? [] :
        costs.map(cost => cost
                .slice(1, -1)
                .toLowerCase())
            .map(cost =>
                ({
                    cost: cost.replace('/', ''),
                    hybrid: cost.indexOf('/') !== -1,
                }));
}

function parse_card(card, idx) {
    var data = {
        name: card.name,
        id: idx,
    };
    var cost = (card.card_faces === undefined ?
            card.mana_cost :
            card.card_faces[0].mana_cost);
    data.cost = parse_manacost(cost);

    return data;
}

function update_list() {
    var list = $('#card-list');

    list.empty();
    if (cards.length == 0) {
        $("#no-results").show();
    } else {
        $("#no-results").hide();
    }

    cards.forEach(function(card, idx) {
        $(build_card_row(parse_card(card, idx)))
            .appendTo(list)
            .click(row_click(idx))
            .find('.cs-send').click(share_click(idx));
    });
}

function scryfall_search(query) {
    $.ajax({
        url: 'https://api.scryfall.com/cards/search',
        data: {
            q: query,
            include_extras: true,
        }
    }).done(function(resp) {
        cards = resp.data;
        update_list();
    }).fail(function() {
        cards = [];
        update_list();
    });
}

$("#search-bar").submit(function() {
    var query = $("#search-text").val();
    scryfall_search(query);
    document.activeElement.blur();
    return false;
});
