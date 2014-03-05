var myMenu={
	brand:{
		myAgenda:"#",
	},
	left :{
		EDT:"#EDT/show",
		DM:"#DM",
//		Charge:"#Graph",
//		Actu:"#Actu",
//		Search:$('<form class="navbar-form">')
//			.append($('<input>').attr({type:"search",name:"room",placeholder:"Recherche salle"}).addClass('form-control'))
//			.submit(function(){
//				BootstrapMenu.hide();location.hash='room/search/'+this.room.value;return false;
//			})
	},
	right:{
		Options:{
			'EDT :':{
				Affichage:$('<select class="form-control">').append(['jour','semaine','mois','an'].map(function(a){return '<option '+(localStorage.edtView==a?"selected":"")+'value="'+a+'">Par '+a+"</option>"}))
					.click(function(e){e.stopPropagation();})
					.change(function(e){localStorage.edtView=$(this).val()}),
				Mon_Groupe:"#EDT/set/group",
				RAZ_Matieres:"#EDT/clear/group",
			},
			'Globale :':{
				Reset:"#/clear",
			}
		}
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