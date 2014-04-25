//Default home page : /
//$.get("http://api.bootswatch.com/",function(rep){console.log(JSON.parse(rep))})
Controller={
//DOM
	createMenu:function(){
		return $('<a>').append(
			$('<div>').addClass('btn-group btn-group-xs btn-group-justified')
			.append($.map([
					{name:"RAZ" ,click:Controller.clear},
					{name:"CSS" ,href :'#/css'},
					{name:"JS"  ,href :'#/js'},
				],function(a){
					return $('<a>').addClass('btn btn-default').html(a.name).attr('href',a.href).click(a.click)
				})
			)
		);
	},
	clear:function(){
		if(!confirm("Effacer toutes vos préférences ? (Cette action est irreversible)"))return;
		var len=localStorage.length;
		localStorage.clear();
		alert(len+" préférences ont été éffacées");
		location.href='./';
	},
	css:function(css){
		$('#customCSS').html(localStorage.customCSS=css);
	},
	js:function(js){
		try{eval(js);}catch(e){return alert(e);}
		$('#customJS').html(localStorage.customJS=js);
	},
//Pages
	Page:function(type){
		if(!localStorage.edtGroup)return this.load('home.html');
		return location.hash="EDT/show";//TODO call directly the function 
	},
	cssPage:function(type){
		this.html('<h1>Style CSS</h1><p>Cette page vous permet de modifier l\'aspect visuel de myAgenda</p>\
		<p>Style de base : <select onchange="$(\'textarea\').val(this.value?\'@import url(\'+this.value+\');\':\'\')" id="bootwatch" class="form-control input-sm"></select></p>\
		<p><textarea class="form-control">'+(localStorage.customCSS||"")+'</textarea></p>\
		<p><a class="btn btn-primary" onclick="Controller.css($(\'textarea\').val())">Enregistrer</a></p>');
		$.get('http://api.bootswatch.com/3/',function(a){$('#bootwatch').html('');[{name:'Aucun',cssMin:''}].concat(JSON.parse(a).themes).forEach(function(t){$('#bootwatch').append($('<option>').html(t.name).val(t.cssMin.replace('bootswatch.com/','netdna.bootstrapcdn.com/bootswatch/3.1.1/')))})})
	},
	jsPage:function(type){
		this.html('<h1>Script JS</h1><p>Cette page vous permet de modifier le comportement de myAgenda</p>\
		<p><textarea class="form-control">'+(localStorage.customJS||"")+'</textarea></p>\
		<p><a class="btn btn-primary" onclick="Controller.js($(\'textarea\').val())">Enregistrer</a></p>');
	},
}
