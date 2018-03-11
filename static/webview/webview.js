(function() {
    $("#search-bar").submit(function() {
        console.log($("#search-text").val());
    });

    Handlebars.registerPartial('cost', Handlebars.templates.cost);

    var row_template = Handlebars.templates.row;

    $("#card-list").append(
        row_template({
            id: 0,
            name: 'Jace, the Mind Sculptor',
            cost: ['2', 'u', 'u'],
        })
    );
    console.log('added');
}());
