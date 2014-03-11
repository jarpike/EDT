//EDT pages : /EDT/*
EDTController={
//DOM event
	createMenu:function(){
		if(localStorage.edtView==undefined)localStorage.edtView='Week';
		return $('<a>')
		.append($('<div class="btn-group">')
			.append($.map([
					{name:'J',title:'Jour',value:'Day'},
					{name:'S',title:'Semaine',value:'Week'},
					{name:'M',title:'Mois',value:'Month'},
					{name:'A',title:'Tout',value:'Year'}
				],
				function(a){
					return $('<button type="button">').html(a.name).attr({title:a.title})
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
//Pages
	recupMsg:'<div class="progress progress-striped active"><div class="progress-bar" style="width: 100%">Récuperation des données ...</div></div>',
	showPage:function(){
		if(!localStorage.edtGroup)
			return this.html('<h1>Oups ! Aucun group choisi !</h1><h1><small>Pourquoi ne pas aller en <a href="#EDT/group">choisir</a> un ?</small></h1>');
		$page=this.html(EDTController.recupMsg);
		$.ajax(EDT.ajax_url+localStorage.edtGroup,{
			success:function(xml){
				var hides=JSON.parse(localStorage.edtUEhide||'[]');
				var names=JSON.parse(localStorage.edtUEname||'{}');
				var timetable=(new DOMParser()).parseFromString(xml,"text/xml").documentElement;
				var evts=EDT.parse(timetable).events.filter(function(e){return hides.indexOf(e.name)==-1;});
				var methName='showBy'+localStorage.edtView;
				$.ajax('html/EDT_'+localStorage.edtView+'.html',{success:function(html){
					var pre="";
					$(html).each(function(){
						if(this.tagName=='SCRIPT')eval.call($page,this.innerHTML);
						if(this.tagName=='PRE')pre=(this.innerHTML);
					});
					if(EDTController[methName])
						EDTController[methName].call($page,evts,names,pre);
					else
						$page.html('Method "'+methName+'" not found');
				}});
			},
			error:function(xhr,msg){
				$page.html("erreur lors de la récupération de l'emploi du temps : "+msg);
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
				alert("Préférence réinitialisées");
			}
		}else alert(type)
		return false;
	},
	groupPage:function(){
		$page=this.html(EDTController.recupMsg);
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
	},
}