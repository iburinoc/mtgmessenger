var cards = [];

function get_card_image(card) {
    return (card.card_faces === undefined ||
        card.image_uris !== undefined ?
        card : card.card_faces[0]).image_uris.normal;
}

function share_card(idx) {
    var card = cards[idx];
    var message = {
        attachment: {
            type: 'template',
            payload: {
                template_type: 'media',
                elements: [{
                    media_type: 'image',
                    buttons: [{
                        type: 'web_url',
                        url: card.scryfall_uri,
                        title: 'Scryfall',
                    }]
                }],
            },
        },
    };

    // Upload attachment
    $.ajax({
        url: '/api/upload',
        method: 'POST',
        data: JSON.stringify({
            card_id: card['id'],
        }),
        contentType: 'application/json',
    }).done(function(resp) {
        console.log('aid: ' + resp.attachment_id);
        message.attachment.payload.elements[0].attachment_id = resp.attachment_id;

        MessengerExtensions.beginShareFlow(
            function(share_response) {
                if (share_response.is_sent) {
                    MessengerExtensions.requestCloseBrowser(
                        function(){},
                        function(){});
                }
            },
            function(errorCode, errorMessage) {},
            message,
            'current_thread');
    });

}

function row_click(idx) {
    var rowid = '#row-'+idx;
    var collapseid = '#collapse-'+idx;
    return function(event) {
        var row = $(rowid);
        var collapse = $(collapseid);
        var img = collapse.find('img');
        var open = !collapse.hasClass('show');
        //var open = !row.hasClass('active');

        img.attr('src', get_card_image(cards[idx]));

        $('.cs-card-collapse')
            .not(collapseid)
            .collapse('hide');

        if (open) {
            //row.addClass('active');
            collapse.collapse('show');
        } else {
            //row.removeClass('active');
            collapse.collapse('hide');
        }
    }
}

function share_click(idx) {
    return function(event) {
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
    var regex = /{[WUBRGXYZCP/0-9]*}/g;
    var costs = cost.match(regex);
    return costs === null ? [] :
        costs.map(cost => cost
                .slice(1, -1)
                .toLowerCase())
            .map(cost =>
                ({
                    cost: cost.replace('/', '').replace('p', ''),
                    hybrid: cost.indexOf('/') !== -1 && cost.indexOf('p') === -1,
                    phyrexian: cost.indexOf('/p') !== -1,
                }));
}

function parse_card(card, idx) {
    var data = {
        name: card.name,
        id: idx,
    };
    var front = (card.card_faces === undefined ?
            card :
            card.card_faces[0]);
    data.cost = parse_manacost(front.mana_cost);

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
        var el = $(build_card_row(parse_card(card, idx)))
            .appendTo(list)
            .click(row_click(idx));

        el.find('.cs-send').click(share_click(idx));
        el.find('.collapse').on('shown.bs.collapse', function (e) {
            $('html,body').animate({
                scrollTop: el.offset().top
            }, 250);
        });
    });
}

function scryfall_search(query) {
    $.ajax({
        url: 'https://api.scryfall.com/cards/search',
        data: {
            q: query,
            include_extras: true,
            order: 'set',
            dir: 'desc',
        }
    }).done(function(resp) {
        cards = resp.data.sort(function(a, b) {
            return (a.name <= b.name) ? -1 : 1;
        });
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
