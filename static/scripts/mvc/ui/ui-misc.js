define(["utils/utils","mvc/ui/ui-select-default","mvc/ui/ui-slider","mvc/ui/ui-options","mvc/ui/ui-drilldown","mvc/ui/ui-buttons","mvc/ui/ui-modal"],function(a,b,c,d,e,f,g){var h=Backbone.View.extend({tagName:"label",initialize:function(a){this.model=a&&a.model||new Backbone.Model(a),this.tagName=a.tagName||this.tagName,this.setElement($("<"+this.tagName+"/>")),this.listenTo(this.model,"change",this.render,this),this.render()},title:function(a){this.model.set("title",a)},value:function(){return this.model.get("title")},render:function(){return this.$el.removeClass().addClass("ui-label").addClass(this.model.get("cls")).html(this.model.get("title")),this}}),i=Backbone.View.extend({initialize:function(a){this.model=a&&a.model||new Backbone.Model({message:null,status:"info",cls:"",persistent:!1,fade:!0}).set(a),this.listenTo(this.model,"change",this.render,this),this.render()},update:function(a){this.model.set(a)},render:function(){this.$el.removeClass().addClass("ui-message").addClass(this.model.get("cls"));var a=this.model.get("status");if(this.model.get("large")?this.$el.addClass(("success"==a&&"done"||"danger"==a&&"error"||a)+"messagelarge"):this.$el.addClass("alert").addClass("alert-"+a),this.model.get("message")){if(this.$el.html(this.messageForDisplay()),this.$el[this.model.get("fade")?"fadeIn":"show"](),this.timeout&&window.clearTimeout(this.timeout),!this.model.get("persistent")){var b=this;this.timeout=window.setTimeout(function(){b.model.set("message","")},3e3)}}else this.$el.fadeOut();return this},messageForDisplay:function(){return _.escape(this.model.get("message"))}}),j=i.extend({messageForDisplay:function(){return this.model.get("message")}}),k=Backbone.View.extend({initialize:function(a){this.model=a&&a.model||new Backbone.Model({type:"text",placeholder:"",disabled:!1,readonly:!1,visible:!0,cls:"",area:!1,color:null,style:null}).set(a),this.tagName=this.model.get("area")?"textarea":"input",this.setElement($("<"+this.tagName+"/>")),this.listenTo(this.model,"change",this.render,this),this.render()},events:{input:"_onchange"},value:function(a){return void 0!==a&&this.model.set("value","string"==typeof a?a:""),this.model.get("value")},render:function(){var a=this;this.$el.removeClass().addClass("ui-"+this.tagName).addClass(this.model.get("cls")).addClass(this.model.get("style")).attr("id",this.model.id).attr("type",this.model.get("type")).attr("placeholder",this.model.get("placeholder")).css("color",this.model.get("color")||"").css("border-color",this.model.get("color")||"");var b=this.model.get("datalist");return $.isArray(b)&&b.length>0&&this.$el.autocomplete({source:function(b,c){c(a.model.get("datalist"))},change:function(){a._onchange()}}),this.model.get("value")!==this.$el.val()&&this.$el.val(this.model.get("value")),_.each(["readonly","disabled"],function(b){a.model.get(b)?a.$el.attr(b,!0):a.$el.removeAttr(b)}),this.$el[this.model.get("visible")?"show":"hide"](),this},_onchange:function(){this.value(this.$el.val()),this.model.get("onchange")&&this.model.get("onchange")(this.model.get("value"))}}),l=Backbone.View.extend({initialize:function(a){this.model=a&&a.model||new Backbone.Model(a),this.setElement($("<div/>").append(this.$info=$("<div/>")).append(this.$hidden=$("<div/>"))),this.listenTo(this.model,"change",this.render,this),this.render()},value:function(a){return void 0!==a&&this.model.set("value",a),this.model.get("value")},render:function(){return this.$el.attr("id",this.model.id),this.$hidden.val(this.model.get("value")),this.model.get("info")?this.$info.show().html(this.model.get("info")):this.$info.hide(),this}}),m=Backbone.View.extend({initialize:function(a){this.model=a&&a.model||new Backbone.Model(a),this.setElement($("<div/>").append(this.$info=$("<div/>")).append(this.$file=$("<input/>").attr("type","file"))),this.listenTo(this.model,"change",this.render,this),this.render()},submit:function(){},render:function(){return this.$el.attr("id",this.model.id),this.$file.val(this.model.get("value")),this.model.get("info")?this.$info.show().html(this.model.get("info")):this.$info.hide(),this}});return{Button:f.ButtonDefault,ButtonIcon:f.ButtonIcon,ButtonCheck:f.ButtonCheck,ButtonMenu:f.ButtonMenu,ButtonLink:f.ButtonLink,Input:k,Label:h,Message:i,UnescapedMessage:j,Upload:m,Modal:g,RadioButton:d.RadioButton,Checkbox:d.Checkbox,Radio:d.Radio,Select:b,Hidden:l,Slider:c,Drilldown:e}});
//# sourceMappingURL=../../../maps/mvc/ui/ui-misc.js.map