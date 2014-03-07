var views=[
	{name:'Par jour',value:'Day'},
	{name:'Par semaine',value:'Week'},
	{name:'Par mois',value:'Month'},
	{name:'Tout',value:'Year'}
];
var zoom=[
	{name:'&#189;',value:2 },
	{name:'1'     ,value:1 },
	{name:'2'     ,value:.5},
];
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
		Options:{
			'EDT :':{
				Affichage:$('<select class="form-control">').append(views.map(function(a){return $('<option value="'+a.value+'">').html(a.name)})).val(localStorage.edtView)
					.click(function(e){e.stopPropagation();})
					.change(function(e){
						localStorage.edtView=$(this).val();
						if(location.hash=="#EDT/show")onhashchange({newURL:location.href});
					}),
				Mon_Groupe:"#EDT/set/group",
				RAZ_Matieres:"#EDT/clear/UE",
				RAZ_EDT:"#EDT/clear/all",
			},
			'Map zoom :':{
				//todo refactor
				Zoom:$('<a>').append($('<div class="btn-group">').append($.map(zoom,function(a){
					return $('<button type="button" class="'+(localStorage.planZoom==a.value?'active':'')+' btn btn-default">').html(a.name)
						.click(function(){
							$(this).parent().find('.active').removeClass('active');
							$(this).addClass('active');
							localStorage.planZoom=a.value;
							if(location.hash.match("#Map"))onhashchange({newURL:location.href});
							});
				}))),
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