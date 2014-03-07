//Default home page : /
Controller={
	Page:function(type){
		if(localStorage.edtGroup)
			return location.hash="EDT/show";
		this.html([
			'<div class="alert alert-info alert-dismissable"><button type="button" class="close" data-dismiss="alert">&times;</button><b>Information : </b>Cet page ne sera plus affichée lorsque vous aurez selectionné un groupe</div>',
			'<div class="jumbotron">',
			'	<h1>Bienvenue sur myAgenda !</h1>',
			"	<p>Cette appliquations a pour but de simplifier l'access des etudiants a leurs emplois du temps.</p>",
			'	<p><a href="#EDT/set/group" class="btn btn-primary btn-lg" role="button">Choisir mon groupe »</a></p>',
			'</div>',
			'<div class="container">',
			'<div class="row">',
			'	<div class="col-md-4 charico"><span class="well glyphicon glyphicon-phone"   ></span>',
			"		<h2>Multi-Plateforme</h2><p>myAgenda s'adapte a une tres grande variétés de support : iPhone/iPad, Smartphone/Tablette Android, Mac/PC, PS3, Wii, FreeBox, Google Glass, iWatch, Grill pain connecté...</p></div>",
			'	<div class="col-md-4 charico"><span class="well glyphicon glyphicon-wrench"  ></span>',
			"		<h2>Personalisable</h2><p>L'apparence ainsi que le comportement peuvent etre personnalisés selons vos préférences.</p></div>",
			'	<div class="col-md-4 charico"><span class="well glyphicon glyphicon-user"    ></span>',
			"		<h2>Unique</h2><p>Toute vos modifications (ajout/suppression de matiere) n'affecterons que vous, n'hesitez donc pas a vous faire plaisir !</p></div>",
			"</div>",
			'<div class="row">',
			'	<div class="col-md-4 charico"><span class="well glyphicon glyphicon-calendar"></span>',
			"		<h2>Le parfait gestionnaire</h2><p>N'oubliez plus aucun DM en ajoutant depuis votre emplois du temp, les DM a faire pour chaque matiere </p></div>",
			'	<div class="col-md-4 charico"><span class="well glyphicon glyphicon-cloud"   ></span>',
			"		<h2>Connecté, mais pas trop</h2><p>La partie \"active\" de myAgenda (sychronisation des données de l'emplois du temp) est hebergé sur les serveur de Google. Cependant, myAgenda reste totalement utilisable sans une connexion à internet !</p></div>",
			'	<div class="col-md-4 charico"><span class="well glyphicon glyphicon-comment" ></span>',
			"		<h2>Vos impressions comptes</h2><p>Toute idées, remarque ou suggestions constructive pouvant aider améliorer l'ergonomie ou l'utilité de myAgenda sont les bienvenues !</p></div>",
			"</div>",
			"</div>",
		].join(''));
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

MapController={
//DOM function
	zoomTo:function(x,y,img){
		var div = img.parentElement;
		var zoom= localStorage.planZoom||1;
		if(!$(img).hasClass('img-responsive')){//fullsize
			div.scrollTop  = (y*img.naturalHeight/zoom - div.clientHeight/2);
			div.scrollLeft = (x*img.naturalWidth /zoom - div.clientWidth /2);
			$("#marker").css({display:"inherit"});
		}else{
			div.scrollTop  = (y*img.height - div.clientHeight/2);
			$("#marker").css({display:'none'});
		}
	},
	plan:{src:"http://www.pca.ups-tlse.fr/inter/images/PlanCampus.jpg",width:4900,height:3578,alt:"Loading ... or just crashed :p"},
	find:function(name){
		var zoom=localStorage.planZoom||1;
		var p=MapController.plan,w=p.width,h=p.height;
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
				return {name:amphi,pos:bats[amphis[amphi]]};
		
		for(var bat in bats)
			if(name.match(bat))
				return {name:bat,pos:bats[bat]};
	},
	resize:function(e){$("#imcont").css({maxHeight:innerHeight-50+'px'})},
//Pages
	Page:function(cb){
		$('#page').parent().removeClass().addClass('container-fluid')
		var zoom=localStorage.planZoom||1;
		var p=MapController.plan;
		var div=this.html($('<div id="imcont">').append(
			$('<img class="img-responsive">').attr(p)
			.attr({width:p.width/zoom,height:p.height/zoom})
			.click(function(e){
				var img = this;
				var o = $(img).offset();
				var x=(e.pageX - o.left)/img.width ;
				var y=(e.pageY - o.top )/img.height;
				//must be after x,y so "zoomTo" get the minimized width/height
				$(img).toggleClass('img-responsive');//switch fit<->fullsize image
				MapController.zoomTo(x,y,img);
			})
			.load(cb?cb:$.noop)
		).append('<span id="marker"></span>'));
		(onresize=MapController.resize)();
		return div;
	},
	zoomPage:function(salle){
		var num=prompt("Saisir un recul pour la map (defaut : 1, recommandé : 2)",localStorage.planZoom||2);
		if(isNaN(num))alert(num+" n'est pas un numero valide");
		else localStorage.planZoom=num;
		return false;
	},
	searchPage:function(salle){
		var found,salle=decodeURI(salle);
		if(!(found=MapController.find(salle))){
			alert(salle+" : introuvable");
			return false;
		}
		var div=MapController.Page.call(this,function(loaded){
			var img=$(div).find('img')[0];
			$(img).toggleClass('img-responsive');//switch fit<->fullsize image
			MapController.zoomTo(found.pos.x,found.pos.y,img);
			$('#marker').html('<b style="font-size: 3em;">&#8598;</b> <span>'+salle+'</span>')
				.css({left:found.pos.x*img.width,top:found.pos.y*img.height-15})
		});
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
	getInfo:function(json){
		json=JSON.parse(decodeURI(json));
		var msg="";
		for(var a in json)msg+=a+":"+json[a]+'\n';
		alert(msg);
	},
	addDM:function(name){
		var myDM={
			title:prompt('Saisir un titre'),
			UE   :name,
			date :1*(new Date()),
			desc :prompt('Saisir une description'),
			lv   :confirm('Marquer ce devoir comme important ?')?3:1,
			done :false
		};
		var dms=JSON.parse(localStorage.DM||'[]');
		dms.push(myDM);
		localStorage.DM=JSON.stringify(dms);
	},
	showByDay:function(events,names){
		var now=new Date();
		now=new Date(6*60*60*1000+1*now);//+6h shifted date
		events=events.filter(function(e){return e.date.getWeek()==now.getWeek() && e.date.getDay()==now.getDay()});
		if(!events.length)return this.html("<h2>Pas cours aujourd'hui :)</h2>");
		this.html('<h2>'+now.toLocaleDateString()+'</h2>');
		events.forEach(function(e){
			e.salle=e.room.replace(/FSI ?\/ ?/g,'').replace(/"/g,"");
			$('#page').append($('.templateContainer[name=byDay]').html().replace(/{{(.*?)}}/g,function(a,b){return eval(b);}))
		});
	},
	showByWeek:function(events,names){
		var now=new Date();
		now=new Date(2*24*60*60*1000+1*now);//+2d shifted date
		events=events.filter(function(e){return e.date.getWeek()==now.getWeek()});
		if(!events.length)return this.html("<h2>Aucun cours cette semaine</h2>");
		this.html('<h2>Cette semaine :</h2>');
		events.forEach(function(e){
			e.salle=e.room.replace(/FSI ?\/ ?/g,'').replace(/"/g,"");
			$('#page').append($('.templateContainer[name=byWeek]').html().replace(/{{(.*?)}}/g,function(a,b){return eval(b);}))
		});
	},
	showByMonth:function(events,names){
		var now=new Date();
		events=events.filter(function(e){return e.date.getMonth()==now.getMonth()});
		if(!events.length)return this.html("<h2>Aucun cours ce mois ci</h2>");
		this.html('<h2>Ce mois ci :</h2>');
		events.forEach(function(e){
			e.salle=e.room.replace(/FSI ?\/ ?/g,'').replace(/"/g,"");
			$('#page').append($('.templateContainer[name=byMonth]').html().replace(/{{(.*?)}}/g,function(a,b){return eval(b);}))
		});
	},
	showByYear:function(events,names){
		this.html('<h2>Emplois du temp complet :</h2>');
		events.forEach(function(e){
			e.salle=e.room.replace(/FSI ?\/ ?/g,'').replace(/"/g,"");
			$('#page').append($('.templateContainer[name=byYear]').html().replace(/{{(.*?)}}/g,function(a,b){return eval(b);}))
		});
	},
//Pages
	showPage:function(){
		if(!localStorage.edtGroup)
			return this.html('<h1>Oups ! Aucun group choisi !</h1><h1><small>Pourquoi ne pas aller en <a href="#EDT/set/group">choisir</a> un ?</small></h1>');
		this.html('<h2>Récupération des données ...</h2>');
		$page=this;
		$.ajax(EDT.ajax_url+localStorage.edtGroup,{
			success:function(xml){
				var hides=JSON.parse(localStorage.edtUEhide||'[]');
				var names=JSON.parse(localStorage.edtUEname||'{}');
				var timetable=(new DOMParser()).parseFromString(xml,"text/xml").documentElement;
				var evts=EDT.parse(timetable).events.filter(function(e){return hides.indexOf(e.name)==-1;});
				var methName='showBy'+(localStorage.edtView||"Year");
				try{
				EDTController[methName].call($page,evts,names);
				}catch(e){alert(methName)}
			},
			error:function(xhr,msg){
				$page.html("erreur lors de la récupération de l'emplois du temp : "+msg);
			}
		});
	},
	clearPage:function(type){
		if(type=="UE"){
			localStorage.edtUEhide="[]";
			alert("Toute vos UE sont de nouveau affichées.");
		}else
		if(type=="all"){
			if(confirm('effacer toute vos préférences ?')){
				for(var pref in localStorage)
					if(pref.match(/^edt/))localStorage.removeItem(pref);
				location.hash="";
				alert("Préférence reinitialisées");
			}
		}else alert(type)
		return false;
	},
	setPage:function(type){
		if(type=='group'){
			$page=this;
			$page.html('<div class="progress progress-striped active"><div class="progress-bar" style="width: 100%">Chargement de la liste des groups ...</div></div>');
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
							$.map(v,function(v){return '<button type="button" class="btn btn-sm btn-default '+(v.id==localStorage.edtGroup?'btn-success':'')+'" data-id="'+v.id+'" data-group="'+v.group+'" data-promo="'+v.promo+'" onclick="EDTController.register(this)">'+v.group+'</button>';}).join('')
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
			return '<button type="button" onclick="DMController.done('+pos+',this)" class="btn btn-default"><span class="well glyphicon glyphicon glyphicon-trash"></span></button>';
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