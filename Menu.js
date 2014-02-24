var myMenu={
	brand:{
		myAgenda:"#",
	},
	left :{
		EDT:{
			'Afficher :':{
				Tout:"#EDT/show/all",
				Mois:"#EDT/show/month",
				Semaine:"#EDT/show/week",
				Jour:"#EDT/show/day",
				YOLO:"#EDT/show/yolo",
			},
			'Paramètres :':{
				Changer_de_Groupe:"#EDT/set/group",
				Reset:"#EDT/set/clear",
			},
		},
		DM:"#DM",
		Charge:"#Graph",
		Actu:"#Actu",
	},
	right:{
		Search:$('<form>')
			.addClass('navbar-form')
			.append($('<input>').attr({type:"search",name:"room",placeholder:"Recherche salle"}).addClass('form-control'))
			.submit(function(){
				BootstrapMenu.hide();location.hash='room/search/'+this.room.value;return false;
			})
	}
}

function BootstrapMenu(menu){
	function entry2bootstrap(entry,name,rec){
		if(entry.constructor==$)
			return $('<li>').append(entry);
		if(entry.constructor==String){
			if(entry[0]=='<')return $('<li>').html(entry);//custom html tag
			return $('<li>').append($('<a>').attr('href',entry).click(BootstrapMenu.hide).html(name.replace(/_/g,' ')));
		}
		if(entry.constructor==Object){
			if(rec>0)return [
				$('<li class="divider">'),//divider
				$('<li class="dropdown-header">').html(name),//section name
				].concat(entries2bootstrap(entry,1+rec));//sub-entries
			return $('<li>').addClass('dropdown')
				.append($('<a data-toggle="dropdown">').attr('href','#').addClass('dropdown-toggle').html(name+' <b class="caret"></b>'))
				.append($('<ul>').addClass('dropdown-menu').append(entries2bootstrap(entry,1+rec)));
		}
	}
	function entries2bootstrap(entries,rec){
		return $.map(entries,function(v,n){
			return entry2bootstrap(v,n.replace(/_/g,' '),rec);
		});
	}
	var brand=menu.brand?Object.keys(menu.brand)[0]:'';
	var left =entries2bootstrap(menu.left ,0);
	var right=entries2bootstrap(menu.right,0);
	//navbar-right
	var bar='<span class="icon-bar"/>';
	return $('<div class="container">')
	.append($('<div class="navbar-header">')
		.append($('<button type="button" data-toggle="collapse" data-target=".navbar-collapse">').addClass('navbar-toggle').html(bar+bar+bar))
		.append(brand?$('<a>').addClass('navbar-brand').attr('href',menu.brand[brand]).click(BootstrapMenu.hide).html(brand):'')
	).append($('<div>').addClass('collapse navbar-collapse')
		.append($('<ul>').addClass('nav navbar-nav navbar-left' ).append(left ))
		.append($('<ul>').addClass('nav navbar-nav navbar-right').append(right))
	)
}
BootstrapMenu.hide=function(event){
	$('.navbar-collapse').removeClass('in');
}