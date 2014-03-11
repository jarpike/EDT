//Default home page : /
//$.get("http://api.bootswatch.com/",function(rep){console.log(JSON.parse(rep))})
Controller={
//DOM
	createMenu:function(){
		return $('<a>').append(
			$('<div class="btn-group btn-group-xs">')
			.append($.map([
					{name:'Tout',click:null},
					{name:'EDT',click:null},
					{name:'Plan',click:null},
					{name:'Cache',click:null}
				],function(a){
					return $('<button class="btn btn-default" type="button">'+a.name+'</button>').click(a.click)
				})
			)
		);
	},
	clearAll:function(){
		if(confirm('Le cache et vos préférences seront éffacés !\nContinuer ?')){
			var len=localStorage.length;
			localStorage.clear();
			alert(len+" entrées ont été éffacées");
		}
		return false;
	},
//Pages
	Page:function(type){
		if(localStorage.edtGroup)
			return location.hash="EDT/show";
		this.load('html/home.html');
	},
}
