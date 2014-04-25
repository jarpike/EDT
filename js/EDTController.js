//EDT pages : /EDT/*
EDTController={
//GUI utilities
	createMenu:function(){
		localStorage.edtView=localStorage.edtView||'Day';
		return $('<a>')
		.append($('<div>').addClass('btn-group btn-group-xs btn-group-justified')
			.append($.map([
					{name:'Jour',title:'Jour',value:'Day'},
					{name:'Sem',title:'Semaine',value:'Week'},
					{name:'Tout',title:'Tout',value:'Year'}
				],
				function(a){
					return $('<a>').html(a.name).attr({title:a.title})
					.addClass("btn btn-default "+(localStorage.edtView==a.value?'active':''))
					.click(function(){
						$(this).parent().find('.active').removeClass('active');
						$(this).addClass('active');
						localStorage.edtView=a.value;
						if(location.hash.match("#EDT")){
							BootstrapMenu.hide();
							onhashchange({newURL:location.href});
						}
					})
				}
			))
		);
	},
//DOM event
	refresh:function(){
		if(navigator.onLine==false)
			if(!confirm("vous ne semblez pas connecté a internet.\nVous ne pourrez donc pas re-afficher l'emploi du temps\nContinuer ?"))return;
		for(var a in localStorage)
			if(a.match(EDT.ajax_url))localStorage.removeItem(a);
		onhashchange({newURL:location.href});
	},
	register:function(btn){
		localStorage.edtGroup=btn.title;
		location.hash="EDT/show";
	},
	UEhide:function(name,btn){
		var $ico=$(btn).find('.glyphicon');
		var closed=$ico.hasClass('glyphicon-eye-open');
		var hides=JSON.parse(localStorage.edtUEhide||'[]');
		if(closed){
			$ico.removeClass().addClass('glyphicon glyphicon-eye-close');
			hides.push(name);
		}else{
			$ico.removeClass().addClass('glyphicon glyphicon-eye-open');
			hides.splice(hides.indexOf(name), 1);
		}
		$ico.closest('.input-group').find('input').attr('disabled',closed);
		localStorage.edtUEhide=JSON.stringify(hides);
	},
	UErename:function(name,alias){
		var names=JSON.parse(localStorage.edtUEname||'{}');
		names[name]=alias;
		localStorage.edtUEname=JSON.stringify(names);
	},
//Pages
	exportPage:function(){
		var json={};
		for(attr in localStorage)if(attr.match(/^edt/))
			json[attr]=localStorage[attr];
		var url='#EDT/import/'+encodeURI(JSON.stringify(json));
		var href=location.href.replace(location.hash,'')+url;
		this.html(hydrate(EDTView.template_export,{url:url,json:json,href:href}));
	},
	importPage:function(){
		var json=Array.prototype.slice.call(arguments,0).join('/');
		if(!json)return this.html('aucun message');
		json=JSON.parse(decodeURIComponent(decodeURI(json)));
		if(confirm('Sauvegarder votre profil actuel ?\nAinsi, vous pourrez le restaurer ulterieurement.'))
			for(attr in localStorage)if(attr.match(/^edt/)){//move every edt to _edt
				localStorage['_'+attr]=localStorage[attr];
				localStorage.removeItem(attr);
			}
		//remove every edt entry
		for(attr in localStorage)if(attr.match(/^edt/))
			localStorage.removeItem(attr);
		//import json
		for(attr in json)
			localStorage[attr]=json[attr];
		//this.html(Object.keys(json).length+' imports effectués avec succes !');
		location.hash="EDT/show";
	},
	restorePage:function(){
		//remove current pref
		for(attr in localStorage)if(attr.match(/^edt/))
			localStorage.removeItem(attr);
		//update back to old ones
		for(attr in localStorage)if(attr.match(/^_edt/)){
			localStorage[attr.substr(1)]=localStorage[attr];
			localStorage.removeItem(attr);
		}
		alert('Restauration effectuée avec succes !');
		return false;
	},
	showPage:function(){
		if(!localStorage.edtGroup)
			return this.html(EDTView.noGroupMsg);
		$page=this.html(EDTView.recupMsg);
		$.ajax(EDT.ajax_url+localStorage.edtGroup,{
			success:function(xml,fromcache){
				if(!fromcache)
					localStorage.edtDate=(new Date()).getFullDate();
				var hides=JSON.parse(localStorage.edtUEhide||'[]');
				var names=JSON.parse(localStorage.edtUEname||'{}');
				var timetable=(new DOMParser()).parseFromString(xml,"text/xml").documentElement;
				var evts=EDT.parse(timetable).events.filter(function(e){return hides.indexOf(e.name)==-1;});
				var methName='showBy'+(localStorage.edtView||'Day');
				if(!EDTView[methName])return $page.html('Method "'+methName+'" not found');
				EDTView[methName].call($page,evts,names);
			},
			error:function(xhr,msg){
				$page.html(EDTView.errorMsg+msg);
			}
		});
	},
	UEPage:function(type){
		if(!localStorage.edtGroup)
			return this.html(EDTView.noGroupMsg);
		$page=this.html(EDTView.recupMsg);
		$.ajax(EDT.ajax_url+localStorage.edtGroup,{
			success:function(xml){
				$page.html("<h1>Gestion des Matieres</h1>\
				<p>Cette page vous permet de cacher les matières que vous n'avez pas\
				et de renommer les matieres restantes.</p>");
				var hides=JSON.parse(localStorage.edtUEhide||'[]');
				var names=JSON.parse(localStorage.edtUEname||'{}');
				var timetable=(new DOMParser()).parseFromString(xml,"text/xml").documentElement;
				var UEs={};
				$.map(EDT.parse(timetable).events,function(a){if(!a.name)return;
					UEs[a.name]={hide:hides.indexOf(a.name)>=0,name:names[a.name]}
				});
				$.map(UEs,function(ue,name){
					$page.append(hydrate(EDTView.template_UE,{name:name,ue:ue}));
				});
			},
			error:function(xhr,msg){
				$page.html(EDTView.errorMsg+msg);
			}
		});
	},
	groupPage:function(){
		$page=this.html(EDTView.recupMsg);
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
						$.map(v,function(v){
							return '<button type="button" onclick="EDTController.register(this)"\
							class="btn btn-sm btn-default '+(v.id==localStorage.edtGroup?'btn-success':'')+'"\
							title="'+v.id+'" data-group="'+v.group+'" data-promo="'+v.promo+'">'+
							v.group+
							'</button>';
						}).join('')
					+'</div></td></tr>';}).join('')
				+'</table>');
			},
			error:function(xhr,msg){
				$page.html("erreur lors de la récupération des données : "+msg);
			}
		});
	},
}