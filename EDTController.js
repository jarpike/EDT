//Default home page : /
Controller={
	Page:function(type){
		if(localStorage.edtGroup)
			return location.hash="EDT/show";
		this.html("home page");
	},
	clearPage:function(){
		if(confirm('Le cache et vos préférences seront éffacés !\nContinuer ?')){
			var len=localStorage.length;
			localStorage.clear();
			alert(len+" entrées ont été éffacées");
		}
		return false;
	}
}

mapController={
//DOM function
	zoomTo:function(x,y,img){
		console.log(x,y);
		var div = img.parentElement;
		var zoom= localStorage.planZoom||1;
		if(!$(img).hasClass('img-responsive')){//fullsize
			div.scrollTop  = (y*img.naturalHeight/zoom - div.clientHeight/2);
			div.scrollLeft = (x*img.naturalWidth /zoom - div.clientWidth /2);
		}else{
			div.scrollTop  = (y*img.height - div.clientHeight/2);
		}
	},
	plan:{src:"http://www.pca.ups-tlse.fr/inter/images/PlanCampus.jpg",width:4900,height:3578,alt:"Loading ... or just crashed :p"},
	find:function(name){
		var zoom=localStorage.planZoom||1;
		var p=mapController.plan,w=p.width,h=p.height;
		var bats={
			"MRV" :{x:2150/w,y:1688/h},
			"1A"  :{x:2790/w,y:2060/h},
			"2A"  :{x:2500/w,y:1950/h},
			"3A"  :{x:3250/w,y:2060/h},
			"4A"  :{x:3570/w,y:2162/h},
			"1R1" :{x:2850/w,y:2255/h},
			"1R3" :{x:2760/w,y:2255/h},
			"1TP1":{x:2800/w,y:2133/h},
			"3TP2":{x:3000/w,y:2133/h},
			"U1"  :{x:3290/w,y:1940/h},
			"U2"  :{x:3170/w,y:1777/h},
			"U3"  :{x:3040/w,y:1777/h},
			"U4"  :{x:2870/w,y:1777/h},
		};
		var amphis={
			ampere         :'3A',
			baillaud       :'U4',
			borel          :'U2',
			concorde       :'U4',
			cotton         :'3A',
			curie          :'3A',
			daurat         :'U3',
			debroglie      :'U2',
			denjoy         :'U1',
			enstein        :'3TP2',
			fermat         :'1A',
			frenet         :'U2',
			grignard       :'2A',
			langevin       :'3A',
			lechatelier    :'2A',
			leclercdusablon:'4A',
			mathis         :'U1',
			molliard       :'3TP2',
			schwartz       :'4A',
			shannon        :'1R3',
			stieltjes      :'U4',
			turing         :'1A',
			vandel         :'U4',
		};
		var name2=name.replace(/\s/g,'').toLowerCase();
		for(var amphi in amphis)
			if(name.match(name2))
				return {name:name,pos:bats[amphis[amphi]]};
		
		for(var bat in bats)
			if(name.match(bat))
				return {name:name,pos:bats[bat]};
	},
	resize:function(e){$("#imcont").css({maxHeight:innerHeight-50+'px'})},
//Pages
	Page:function(){
		var zoom=localStorage.planZoom||1;
		var p=mapController.plan;
		var div=this.html($('<div id="imcont" style="overflow:scroll;">').append(
			$('<img class="img-responsive">').attr(p)
			.attr({width:p.width/zoom,height:p.height/zoom})
			.click(function(e){
				var img = this;
				var o = $(img).offset();
				var x=(e.pageX - o.left)/img.width ;
				var y=(e.pageY - o.top )/img.height;
				//must be after x,y so "zoomTo" get the minimized width/height
				$(img).toggleClass('img-responsive');//switch fit<->fullsize image
				mapController.zoomTo(x,y,img);
			})
		));
		(onresize=mapController.resize)();
		return div;
	},
	searchPage:function(salle){
		var div=mapController.Page.call(this);
		var found,salle=decodeURI(salle);
		if((found=mapController.find(salle))){
			var img=$(div).find('img')[0];
			$(img).toggleClass('img-responsive');//switch fit<->fullsize image
			mapController.zoomTo(found.pos.x,found.pos.y,img);
			this.append('<b style="position:absolute;left:0;top:0;">lol</b>');
			console.log(found);
		}else{
			alert(salle+" : introuvable");
			return false;
		}
	}
}

//EDT pages : /EDT/*
EDTController={
//DOM event
	hideUE:function(name){
		var hide=JSON.parse(localStorage.edtUEhide||'[]');
		hide.push(name);
		localStorage.edtUEhide=JSON.stringify(hide);
		onhashchange({newURL:location.href});
	},
	renameUE:function(name){
		var val = prompt("Entrez un nouveau nom pour "+name);
		if(!val)return;
		var names=JSON.parse(localStorage.edtUEname||'{}');
		names[name]=val;
		localStorage.edtUEname=JSON.stringify(names);
		onhashchange({newURL:location.href});
	},
	update:function(){
		var crc=0;
		localStorage[EDT.ajax_url+localStorage.edtGroup].split('').forEach(
			function(c,i){crc+=c.charCodeAt(0)*i});
	},
	register:function(btn){
		var d=btn.dataset;
		localStorage.edtGroup=d.id;
		location.hash="EDT/show";
	},
	addDM:function(name){
	
	},
//Pages
	showPage:function(){
		if(!localStorage.edtGroup)
			return this.html('<h1>oups ! Aucun group choisi !</h1><h1><small>Pourquoi ne pas aller en <a href="#EDT/set/group">choisir</a> un ?</small></h1>');
		this.html('Récupération des données');
		$.ajax(EDT.ajax_url+localStorage.edtGroup,{
			success:function(xml){
				var names=JSON.parse(localStorage.edtUEname||'{}');
				var hides=JSON.parse(localStorage.edtUEhide||'[]');
				var timetable=(new DOMParser()).parseFromString(xml,"text/xml").documentElement;
				$('#page').html('');
				EDT.parse(timetable).events.forEach(function(e){
					if(hides.indexOf(e.name)>=0)return;
					var salle=e.room.replace(/FSI ?\/ ?/g,'').replace(/"/g,"");
					$('#page').append('<div>'+[
							e.date.getMonth()+1+'/'+(e.date.getDate()   <10?'0':'')+e.date.getDate(),
							e.date.getHours()  +'h'+(e.date.getMinutes()<10?'0':'')+e.date.getMinutes(),
							'<div class="btn-group">'+
								'<button type="button" class="btn btn-link dropdown-toggle" data-toggle="dropdown">'+(names[e.name]||e.name||'?')+' <span class="caret"></span></button>'+
								'<ul class="dropdown-menu">'+
									'<li><a onclick="EDTController.hideUE(\''+e.name+'\')">Cacher</a></li>'+
									'<li><a onclick="EDTController.renameUE(\''+e.name+'\')">Renommer</a></li>'+
									'<li><a onclick="EDTController.addDM(\''+e.name+'\')">Ajouter DM</a></li>'+
								'</ul></div>'+
							'<a href="#map/search/'+salle+'">'+salle+'</a>',
	//						'<i>'+e.type+'</i>',
						].join(' ')+'</div>')
				})
			},
			error:function(xhr,msg){
				$page.html("erreur lors de la récupération de l'emplois du temp : "+msg);
			}
		});
	},
	clearPage:function(){
		if(confirm('effacer toute vos préférences ?')){
			for(var pref in localStorage)
				if(pref.match(/^edt/))localStorage.removeItem(pref);
			location.hash="";
			alert("Préférence reinitialisées");
		}
	},
	setPage:function(type){
		if(type=='group'){
			$page=this;
			$page.html("Chargement de la liste des groups ...");
			$.ajax(EDT.ajax_url,{
				success:function(html){
					//group by cursus name
					var groups={};
					$(html).find(".ttlink")
						.filter(function(){return this.attributes.href.value[0]=='g'})
						.each(function(){
							var id=this.attributes.href.value.match(/\d+/)[0];
							var name=this.text.replace(/_/g,' ').replace(/Groupe: /g,'').split(' - ');
							if(groups[name[0]]==undefined)groups[name[0]]=[];
							groups[name[0]].push({id:id,promo:name[0],group:(name[1]||"1.1").replace(/G\s?/g,'')});
						});
					//format group as html
					$page.html('<table class="table table-striped table-condensed">'+
						$.map(groups,function(v,n){return '<tr><td>'+n+'</td><td><div class="btn-group">'+
							$.map(v,function(v){return '<button type="button" class="btn btn-sm btn-default '+(v.id==localStorage.edtGroup?'active':'')+'" data-id="'+v.id+'" data-group="'+v.group+'" data-promo="'+v.promo+'" onclick="EDTController.register(this)">'+v.group+'</button>';}).join('')
						+'</div></td></tr>';}).join('')
					+'</table>');
				},
				error:function(xhr,msg){
					$page.html("erreur lors de la récupération des données : "+msg);
				}
			});
		}
	},
}

myDM={
title:'Icosahedre',
UE   :'IG3D',
date :1*(new Date()),
desc :'Ca va rusher ca mere',
lv   :1,
done :false
};

//DM pages : /DM/*
DMController={
	done:function(pos,btn){
		$(btn).closest('tr').fadeOut(function(){
			var dms=JSON.parse(localStorage.DM||'[]');
			dms.splice(pos, 1);
			localStorage.DM=JSON.stringify(dms);
			onhashchange({newURL:location.href});
		});
	},
//Pages
	Page:function(){
		var dms=JSON.parse(localStorage.DM||'[]');
		if(!dms.length)return this.html("<h2>Aucun Devoirs Maison ... <small>Pour le moment</small></h2>");
		function ctrl(pos){
			return '<button type="button" onclick="DMController.done('+pos+',this)" class="btn btn-default"><span class="glyphicon glyphicon glyphicon-trash"></span></button>';
		}
		this.html('<h2>Liste des DM :</h2>'+
			'<table class="table table-condensed">'+
			'<thead><tr><td>#</td><td>Titre</td><td>UE</td><td>Date</td><td>etat</td><td width="1%"></td></tr></thead>'+
			'<tbody>'+
			dms.map(function(dm,pos){if(!dm)return '';//previously deleted entry
				return '<tr class="'+(dm.done?'active':['success','info','warning','danger'][dm.lv])+'"><td>'+
					[pos,dm.title,dm.UE,(new Date(dm.date)).toLocaleDateString()+'',dm.desc,ctrl(pos)].join('</td><td>')+'</td></tr>';
			}).join('')+
			'</tbody></table>');
	}
}