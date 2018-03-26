(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['cost'] = template({"1":function(container,depth0,helpers,partials,data) {
    return "ms-split";
},"3":function(container,depth0,helpers,partials,data) {
    return "ms-p";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "<i class=\"ms ms-"
    + container.escapeExpression(((helper = (helper = helpers.cost || (depth0 != null ? depth0.cost : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"cost","hash":{},"data":data}) : helper)))
    + " ms-cost ms-shadow\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.hybrid : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.phyrexian : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\"></i>\n";
},"useData":true});
templates['row'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.invokePartial(partials.cost,depth0,{"name":"cost","data":data,"indent":"            ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "");
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<li id=\"row-"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"cs-card-row list-group-item px-2\">\n    <span>\n        "
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "\n    </span>\n    <span style=\"float: right;\">\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.cost : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "        <span class=\"pl-1\">\n        <i id=\"share-"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\"\n            class=\"cs-send material-icons\" style=\"vertical-align: middle;\">send</i>\n        </span>\n    </span>\n    <div id=\"collapse-"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"cs-card-collapse collapse\">\n            <img src=\"\" style=\"object-fit: contain; max-width: 100%;\"></img>\n    </div>\n</li>\n";
},"usePartial":true,"useData":true});
})();