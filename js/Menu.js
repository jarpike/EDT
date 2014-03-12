var myMenu={
	brand:{
		myAgenda:"#",
	},
	left :{
		EDT:"#EDT/show",
		DM:"#DM",
		Map:"#Map",
	},
	right:{
		'-cog':{
			'EDT :':{
				Affichage:EDTController.createMenu,
				Mon_Groupe:"#EDT/group",
				Mes_Matieres:"#EDT/UE",
			},
			'Map zoom :':{
				Zoom:MapController.createZoomMenu,
			},
			'Map handler :':{
				Handle:MapController.createHandlerMenu,
			},
			'Remise à zéro :':{
				RAZ:Controller.createMenu,
			},
		}
	}
}

function BootstrapMenu(menu){
	function entry2bootstrap(entry,name,rec){
		if(name[0]=='-')name='<span class="glyphicon glyphicon'+name+'"></span>';
		
		if(entry.constructor==Function)
			entry=entry();
		if(entry.constructor==$)
			return $('<li>').append(entry);
		if(entry.constructor==String){
			
			if(entry[0]=='<'){console.log(entry);return TEST=$('<li>').html(entry);}//custom html tag
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