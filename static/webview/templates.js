(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['cost'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<i class=\"ms ms-"
    + container.escapeExpression(((helper = (helper = helpers.val || (depth0 != null ? depth0.val : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"val","hash":{},"data":data}) : helper)))
    + " ms-cost ms-shadow\"></i>\n";
},"useData":true});
templates['row'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.invokePartial(partials.cost,depth0,{"name":"cost","hash":{"val":depth0},"data":data,"indent":"            ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "");
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<li id=\"row-"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" onclick=\""
    + alias4(((helper = (helper = helpers.row_fun || (depth0 != null ? depth0.row_fun : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"row_fun","hash":{},"data":data}) : helper)))
    + "("
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + ")\" class=\"cs-card-row list-group-item px-2\">\n    <span>\n        "
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "\n    </span>\n    <span style=\"float: right;\">\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.cost : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "        <span class=\"pl-1\">\n        <i id=\"share-"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" onclick=\""
    + alias4(((helper = (helper = helpers.share_fun || (depth0 != null ? depth0.share_fun : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"share_fun","hash":{},"data":data}) : helper)))
    + "("
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + ")\" class=\"material-icons\" style=\"vertical-align: middle;\">send</i>\n        </span>\n    </span>\n</li>\n";
},"usePartial":true,"useData":true});
})();