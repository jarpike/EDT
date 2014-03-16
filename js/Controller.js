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
		location.reload();
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
		this.html('<p>Cette page vous permet de modifier l\'aspect visuel de myAgenda</p>\
		<p><textarea class="form-control">'+(localStorage.customCSS||"")+'</textarea></p>\
		<p><a class="btn btn-primary" onclick="Controller.css($(\'textarea\').val())">Enregistrer</a></p>');
	},
	jsPage:function(type){
		this.html('<p>Cette page vous permet de modifier le comportement de myAgenda</p>\
		<p><textarea class="form-control">'+(localStorage.customJS||"")+'</textarea></p>\
		<p><a class="btn btn-primary" onclick="Controller.js($(\'textarea\').val())">Enregistrer</a></p>');
	},
}
/*
CSS Example :

.event a{color:black;opacity:0.5;}
.event button{color:black;}
*/

/*
Plugin example :

EDTController.showBy.onshow=function(e){$('#easter').remove();$('body').append('<div id="easter" style="position:absolute;right:0;bottom:0;">'+easter(e,e.length)+'</div>');}
function easter(e,i){if(i>2)return '';
	if(i==0)return '<img src="http://i.imgur.com/Pn5NYql.gif">';
	if(i==1)return '<img src="http://i.imgur.com/tgjoBet.png">';
	if(i==2 && (e[1].date-e[0].date>4*60*60*1000))return '<img src="http://3.bp.blogspot.com/-Fx6jXoUC6MU/UR0fzlAEGNI/AAAAAAABzmU/Sw2mxyhtJOA/s1600/dinklage.gif">';
}
*/