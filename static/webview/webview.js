var cards = [];

function row_click(idx) {
    $(".cs-card-row").removeClass('active');
    $("#row-" + idx).toggleClass('active');
}

function share_click(idx) {
    console.log('share ' + idx);
}

Handlebars.registerPartial('cost', Handlebars.templates.cost);
function build_card_row(card) {
    var row_template = Handlebars.templates.row;
    return row_template({
            id: card.id,
            name: card.name,
            cost: card.cost,
            row_fun: 'row_click',
            share_fun: 'share_click',
        })
}

function parse_manacost(cost) {
    var regex = /{[WUBRG/0-9]*}/g;
    var costs = cost.match(regex);
    return costs === null ? [] :
        costs.map(cost => cost
        .slice(1, -1)
        .replace('/', '')
        .toLowerCase());
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
        list.append(build_card_row(
            parse_card(card, idx)));
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

/*
$("#card-list").append(
    row_template({
        id: 0,
        name: 'Jace, the Mind Sculptor',
        cost: ['2', 'u', 'u'],
        row_fun: 'row_click',
        share_fun: 'share_click',
    })
);
*/
$("#search-bar").submit(function() {
    var query = $("#search-text").val();
    console.log(query);
    scryfall_search(query);
    document.activeElement.blur();
    return false;
});
