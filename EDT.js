var EDT = {
	showPage:function(type){
		if(!localStorage.myGroup)
			return '<h1>oups ! Aucun group choisi !</h1><h1><small>Pourquoi ne pas aller en <a href="#EDT/set/group">choisir</a> un ?</small></h1>'
		$.get(EDT.ajax_url+localStorage.myGroup,{},function(xml){
			var timetable=(new DOMParser()).parseFromString(xml,"text/xml").documentElement;
			$('#page').html('');
			EDT.parse(timetable).events.forEach(function(e){
				$('#page').append('<div>'+[
						e.date.getMonth()+'/'+e.date.getDate(),
						e.date.getHours()+'h'+e.date.getMinutes(),
						'<div class="btn-group btn-group-sm"><button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">'+e.name+' <span class="caret"></span></button><ul class="dropdown-menu"><li><a>hide</a></li></ul></div>'+
						'<a>'+e.room.replace(/FSI \/ /,'')+'</a>',
//						'<i>'+e.type+'</i>',
					].join(' ')+'</div>')
			})
		});
	},
	setPage:function(type){
		if(type=='clear'){
			if(!confirm('effacer toute vos préférences ?'))return "Ok, rien n'a été supprimé";
			for(var my in localStorage)
				if(my.match(/^my/))delete localStorage[my];
			return "Préférence reinitialisées";
		}
		if(type=='group'){
			$.get(EDT.ajax_url,function(html){
				$('#page').html("Chargement de la liste des groups ...");
				var groups={};
				$(html).find(".ttlink")
					.filter(function(){return this.attributes.href.value[0]=='g'})
					.each(function(){
						var id=this.attributes.href.value.match(/\d+/)[0];
						var name=this.text.replace(/_/g,' ').replace(/Groupe: /g,'').split(' - ');
						if(groups[name[0]]==undefined)groups[name[0]]=[];
						groups[name[0]].push({id:id,promo:name[0],group:(name[1]||"1.1").replace(/G\s?/g,'')});
					});
				$('#page').html('<table class="table table-striped table-condensed">'+
					$.map(groups,function(v,n){return '<tr><td>'+n+'</td><td><div class="btn-group">'+
						$.map(v,function(v){return '<button type="button" class="btn btn-sm btn-default '+(v.id==localStorage.myGroup?'active':'')+'" data-id="'+v.id+'" data-group="'+v.group+'" data-promo="'+v.promo+'" onclick="EDT.register(this)">'+v.group+'</button>';}).join('')
					+'</div></td></tr>';}).join('')
				+'</table>');
			});
		}
	},
	
	ajax_url:'http://univ-tlse.appspot.com/edt/',
//internal methodes
	register:function(btn){
		var d=btn.dataset;
		if(!confirm('Etes-vous bien en '+d.promo+' Groupe '+d.group+' ? (#'+d.id+')'))return;
		localStorage.myGroup=d.id;
		if(confirm('Groupe enregistré !\nAfficher votre nouvel emplois du temps ?'))location.hash="EDT/show/all";
	},
	parse:function(xml){
		function qsa(elem,path) {
			var e=elem.querySelectorAll(path);
			return e?[].slice.call(e).map(function (a) {return a.textContent;}):[];
		}
		function getEventDate(event,weeks){
			for(var c=0;c<event.week.length;c++){
				if(event.week[c]!='Y')continue;
				for(var w in weeks){
					if(weeks[w].event!=c)continue;
					var t=event.time.match(/\d+/g);
					return new Date(weeks[w].date*1 + event.nday*864e5 + (t[0]*60+t[1]*1)*6e4);
				}
			}
		}
		//ASSERT:only one 'Y' per span>alleventweeks
		var weeks=[].slice.call(xml.querySelectorAll('span')).map(function (w) {
			return {
				date:new Date(w.attributes['date'].value.split('/').reverse().join('/')),
				event:qsa(w,'alleventweeks')[0].indexOf('Y')
			};
		});
		//ASSERT:only one 'Y' per event
		//TODO:handle multiple 'Y' per event
		var events=[].slice.call(xml.querySelectorAll('event')).map(function (e) {
			var event={
				nday:qsa(e,'day')[0],
				time:qsa(e,'starttime')[0],
				type:qsa(e,'category')[0],
				week:qsa(e,'rawweeks')[0],
				room:qsa(e,'resources>room  >item').join('\n'),
				prof:qsa(e,'resources>staff >item').join('\n'),
				note:qsa(e,'resources>notes >item').join(''),
				name:qsa(e,'resources>module>item')[0]//poly module ?! why.jpg
			};
			//poly event test => 0 found => see ASSERT
			if(event.week.match(/Y/g,'').length>1)console.warn('poly event',event);
			event.date=getEventDate(event,weeks);
			return event;
		}).sort(function (a,b){return a.date-b.date;});
		//window.edt={weeks:weeks,events:events};
		console.log({weeks:weeks,events:events});
		return {weeks:weeks,events:events};
	}
};

var Notify=function(message){
	console.log(message);
};