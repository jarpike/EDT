//Default home page : /
//$.get("http://api.bootswatch.com/",function(rep){console.log(JSON.parse(rep))})
Controller={
//DOM
	createMenu:function(){
		return $('<a>').append(
			$('<div>').addClass('btn-group btn-group-xs btn-group-justified')
			.append($.map([
					{title:"Cache",ico:'dashboard',click:Controller.clearCache},
					{title:"EDT"  ,ico:'calendar' ,click:Controller.clearEDT},
					{title:"Tout" ,ico:'asterisk' ,click:Controller.clearAll},
				],function(a){
					return $('<a>').addClass('btn btn-default').attr({title:a.title})
					.html('<span class="glyphicon glyphicon-'+a.ico+'"></span>').click(a.click)
				})
			)
		);
	},
	clearAll:function(){
		if(!confirm("Cette action est irreversible !\nContinuer ?"))return;
		var len=localStorage.length;
		localStorage.clear();
		alert(len+" entrées ont été éffacées");
	},
	clearEDT:function(){
		if(!confirm("Effacer vos préférences de l'emploi du temps ?"))return;
		for(var pref in localStorage)
			if(pref.match(/^edt/))localStorage.removeItem(pref);
	},
	clearCache:function(){
		if(!confirm("Vider le cache ?"))return;
		for(var pref in localStorage)
			if(pref.match(/^(\.\/|http)/))localStorage.removeItem(pref);
	},
//Pages
	Page:function(type){
		if(localStorage.edtGroup)
			return location.hash="EDT/show";//TODO call directly the function 
		this.load('home.html');
	},
}
