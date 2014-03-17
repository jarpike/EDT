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
	btnUE:function(event){
		return '\
			<div class="btn-group">\
				<a class="btn btn-link dropdown-toggle" data-toggle="dropdown">'+
					(event.alias||event.name)+'&nbsp;<span class="caret"></span>\
				</a>\
				<ul class="dropdown-menu">\
					<li><a onclick="EDTController.hideUE  (this)">Cacher</a></li>\
					<li><a onclick="EDTController.renameUE(this)">Renommer</a></li>\
					<li><a onclick="EDTController.addDM   (this)">Ajouter DM</a></li>\
					<li><a onclick="EDTController.getInfo (this)">Info brute</a></li>\
				</ul>\
			</div>'
	},
	createHeader:function(events,names,now,delta,cb){
		$header=$('<p><div class="input-group">\
				<span class="input-group-btn" data-delta="-'+delta+'"><a class="btn btn-default"><i class="glyphicon glyphicon-chevron-left"></i></a></span>\
				<input class="form-control text-center" type="date" value="'+now.toISOString().substr(0,10)+'" id="datepicker"/>\
				<a class="input-group-addon" id="datepicker_btn"    ><i class="glyphicon glyphicon-calendar"></i></a>\
				<span class="input-group-btn" data-delta= "'+delta+'"><a class="btn btn-default"><i class="glyphicon glyphicon-chevron-right"></i></a></span>\
		</div></p>');
		$header.find('[data-delta]').click(function(){
			var $picker=$('#datepicker');
			if(!$picker.val())return;
			var old_date=new Date.fromInput($picker.val());
			var delta=$(this).data('delta');
			var new_date=new Date(old_date*1 + delta*24*60*60*1000);
			cb.call($page,events,names,new_date);
		});
		$header.find('input').change(function(){
			return cb.call($page,events,names,new Date.fromInput(this.value));
		});
		$header.find('#datepicker_btn').datepicker({
			orientation: "auto right",
			format: "dd/mm/yyyy",
			language: "fr",
			forceParse: false,
			daysOfWeekDisabled: "0",
			autoclose: true,
			todayHighlight: true
		}).datepicker('setUTCDate',now).on('changeDate',function(ev){
			var new_date=$(this).datepicker('getUTCDate');
			cb.call($page,events,names,new_date);
		});
		return $header;
	},
//DOM event
	hideUE:function(a){
		var name=JSON.parse(decodeURI($(a).closest('[data-json]').data('json'))).name;
		var hide=JSON.parse(localStorage.edtUEhide||'[]');
		hide.push(name);
		localStorage.edtUEhide=JSON.stringify(hide);
		onhashchange({newURL:location.href});
	},
	renameUE:function(a){
		var names=JSON.parse(localStorage.edtUEname||'{}');
		var json=JSON.parse(decodeURI($(a).closest('[data-json]').data('json')));
		var val = prompt("Entrez un nouveau nom pour "+json.name,names[json.name]||'');
		if(!val)return;
		names[json.name]=val;
		localStorage.edtUEname=JSON.stringify(names);
		onhashchange({newURL:location.href});
	},
	addDM:function(a){
		var e=JSON.parse(decodeURI($(a).closest('[data-json]').data('json')));
		var myDM={
			title:prompt('Saisir un titre'),
			UE   :e.name,
			date :(new Date(e.date)),
			desc :'',//prompt('Saisir une description'),
			lv   :'3',//confirm('Marquer ce devoir comme important ?')?3:1,
			done :false
		};
		var dms=JSON.parse(localStorage.DM||'[]');
		dms.push(myDM);
		localStorage.DM=JSON.stringify(dms);
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
	getInfo:function(a){
		var json=JSON.parse(decodeURI($(a).closest('[data-json]').data('json')));
		var msg="";
		for(var a in json)msg+=a+":"+json[a]+'\n';
		alert(msg);
	},
	hideUE2:function(btn,name){
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
		localStorage.edtUEhide=JSON.stringify(hides);
	},
	renameUE2:function(name,alias){
		var names=JSON.parse(localStorage.edtUEname||'{}');
		names[name]=alias;
		localStorage.edtUEname=JSON.stringify(names);
	},
//Pages
	recupMsg:'\
		<div class="progress progress-striped active">\
			<div class="progress-bar" style="width: 100%">\
				Récuperation des données ...\
			</div>\
		</div>',
	noGroupMsg:'\
		<h1>Oups ! Aucun group choisi !</h1>\
		<h1><small>Pourquoi ne pas aller en <a href="#EDT/group">choisir</a> un ?</small></h1>',
	exportPage:function(){
		var json={};
		for(attr in localStorage)if(attr.match(/^edt/))
			json[attr]=localStorage[attr];
		var url='#EDT/import/'+encodeURI(JSON.stringify(json));
		var href=location.href.replace(location.hash,'')+url
		this.html('<h2>Exporter mon emploi du temps</h2>\
			<p>Partagez ce lien <i class="text-muted">(btn droit > copier le lien)</i>:</p>\
			<p><a href="'+url+'">'+JSON.stringify(json)+'</a></p>\
			<p>Ou envoyer le directement par :</p>\
			<a class="btn btn-primary" href="mailto:?body='+encodeURI(href)+'&subject=Mon emploi du temps"><i class="glyphicon glyphicon-envelope"></i> Mail</a>\
			<a class="btn btn-primary" href="sms:?body='+encodeURI(href.replace('#','%23'))+'"><i class="glyphicon glyphicon-comment"></i> SMS</a>\
			<p><div class="alert alert-info"><b>Info :</b> \
				Le lien hypertext peut ne pas etre reconnue dans son intégralitée \
				(a cause des certain characters speciaux). \
				Copier coller tout simplement le contenu du Mail/SMS \
				dans la barre URL de votre navigateur pour palier ce probleme.\
			</div></p>\
			');
	},
	importPage:function(json){
		if(!json)return this.html('aucun message');
		console.log(decodeURI(json))
		json=JSON.parse(decodeURI(json));
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
		this.html(Object.keys(json).length+' imports effectués avec succes !');
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
			return this.html(EDTController.noGroupMsg);
		$page=this.html(EDTController.recupMsg);
		$.ajax(EDT.ajax_url+localStorage.edtGroup,{
			success:function(xml){
				var hides=JSON.parse(localStorage.edtUEhide||'[]');
				var names=JSON.parse(localStorage.edtUEname||'{}');
				var timetable=(new DOMParser()).parseFromString(xml,"text/xml").documentElement;
				var evts=EDT.parse(timetable).events.filter(function(e){return hides.indexOf(e.name)==-1;});
				var methName='showBy'+(localStorage.edtView||'Day');
				//$('head').append($('<script>').attr({src:'view/'+localStorage.edtView+'.js'}));
				if(!EDTController[methName])return $page.html('Method "'+methName+'" not found');
				EDTController[methName].call($page,evts,names);
			},
			error:function(xhr,msg){
				$page.html("erreur lors de la récupération de l'emploi du temps : "+msg);
			}
		});
	},
	UEPage:function(type){
		$page=this.html(EDTController.recupMsg);
		$.ajax(EDT.ajax_url+localStorage.edtGroup,{
			success:function(xml){
				$page.html('<h1>Gestion des Matieres</h1>');
				var hides=JSON.parse(localStorage.edtUEhide||'[]');
				var names=JSON.parse(localStorage.edtUEname||'{}');
				var timetable=(new DOMParser()).parseFromString(xml,"text/xml").documentElement;
				var UEs={};
				$.map(EDT.parse(timetable).events,function(a){if(!a.name)return;
					UEs[a.name]={hide:hides.indexOf(a.name)>=0,name:names[a.name]}
				});
				$form=$('<form>').addClass('form-horizontal');
				$.map(UEs,function(ue,name){$form.append('\
					<div class="row">\
						<label class="col-xs-5 control-label">'+name+'</label>\
						<div class="col-xs-5">\
							<div class="input-group">\
								<span class="input-group-btn">\
									<a title="cacher/afficher" class="btn btn-default"\
									  onclick="EDTController.hideUE2(this,\''+name+'\')">\
										<span class="glyphicon glyphicon-eye-'+(ue.hide?'close':'open')+'"></span>\
									</a>\
								</span>\
								<input value="'+(ue.name||'')+'" class="form-control" type="text"\
								onkeyup="EDTController.renameUE2(\''+name+'\',event.target.value)">\
							</div>\
						</div>\
					</div>'
				)});
				$page.append($form);
			},
			error:function(xhr,msg){
				$page.html("erreur lors de la récupération de l'emploi du temps : "+msg);
			}
		});
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
						$.map(v,function(v){
							return '<button type="button" onclick="EDTController.register(this)"\
							class="btn btn-sm btn-default '+(v.id==localStorage.edtGroup?'btn-success':'')+'"\
							data-id="'+v.id+'" data-group="'+v.group+'" data-promo="'+v.promo+'">'+
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