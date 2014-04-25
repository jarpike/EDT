EDTView={
colors:{
	COURS:"bg-info",
	TD:"bg-danger",
	TP:"bg-success",
	SOUTENANCE:"bg-primary",
	EXAM:"bg-primary",
	REUNION:'bg-warning',
},
skipDays:[6,0],//sam,dim
template_export:'<h2>Exporter mon emploi du temps</h2>\
	<p>Vous pouvez partager votre emploi du temps personnalisé (Matieres renommées/cachées) via :</p>\
	<a class="btn btn-primary" href="mailto:?body={{encodeURIComponent(encodeURI(my.href))}}&subject=Mon emploi du temps">{[envelope]} Mail</a>\
	<a class="btn btn-primary" href="sms:?body={{encodeURIComponent(encodeURI(my.href))}}">{[comment]} SMS</a>\
	<a class="btn btn-primary" href="//api.qrserver.com/v1/create-qr-code/?data={{encodeURIComponent(encodeURI(my.href))}} target="_blank"">{[qrcode]} QR</a>\
	<a class="btn btn-primary" href="//facebook.com/sharer/sharer.php?u={{encodeURIComponent(encodeURI(my.href))}} target="_blank"">FB</a>\
	<a class="btn btn-primary" href="//plus.google.com/share?url={{encodeURIComponent(encodeURI(my.href))}}" target="_blank">G+</a>\
	<a class="btn btn-primary" href="{{my.url}}" target="_blank">{[link]} URL</a>\
	<hr>\
',
template_UE:'\
<div class="input-group">\
	<span class="input-group-addon" onclick="EDTController.UEhide(\'{{my.name}}\',this)">\
		<span class="glyphicon glyphicon-eye-{{my.ue.hide?"close":"open"}}"></span>\
	</span>\
	<input type="text" class="form-control" {{my.ue.hide?"disabled":""}}\
		value="{{my.ue.name||""}}" placeholder="{{my.name}}" title="{{my.name}}"\
		onkeyup ="EDTController.UErename(\'{{my.name}}\',event.target.value)"\
		onchange="EDTController.UErename(\'{{my.name}}\',event.target.value)"\
	>\
</div>\
',
template_show:'\
<div class="event {{my.event.style}} {{my.event.bg}}" style="margin-top:{{my.event.margin/2}}em" \
	data-json="{{encodeURI(JSON.stringify(my.event))}}">\
	&nbsp;<code>{{my.day}}{{my.event.date.getFullTime()}}{{my.event.size*1!=72e5?" ["+my.event.size.toISOString().substr(11,5)+"]":""}}</code>\
	<div class="btn-group">\
		<a class="btn btn-link dropdown-toggle" data-toggle="dropdown">\
			{{my.event.alias||my.event.name}}&nbsp;<span class="caret"></span>\
		</a>\
		<ul class="dropdown-menu">\
			<li><a onclick="EDTView.btn.hideUE  (this)">{[eye-close]} Cacher</a></li>\
			<li><a onclick="EDTView.btn.renameUE(this)">{[pencil]}    Renommer</a></li>\
			<li><a onclick="EDTView.btn.addDM   (this)">{[briefcase]} Ajouter DM</a></li>\
			<li><a onclick="EDTView.btn.getInfo (this)">{[list-alt]} Info brute</a></li>\
		</ul>\
	</div>\
	{{my.event.salle.map(function(a){return "<a href=\\"#Map/search/"+a+"\\">"+a.replace(/(AMPHI)|(bât )/gi,"")+"</a>"}).join("&nbsp;")}}\
	{{(my.event.note?\'<a class="btn btn-link" title="\'+my.event.note+\'" onclick="EDTView.btn.getNote (this)">{[info-sign]}</a>\':"")}}\
</div>',
errorMsg:"erreur lors de la récupération de l'emploi du temps : ",
recupMsg:'<p>\
	<div class="progress progress-striped active">\
		<div class="progress-bar" style="width: 100%">\
			Récuperation des données ...<a href="#" style="color: inherit;"><u>Recharger</u></a> si bloqué.\
		</div>\
	</div>\
</p>',
noGroupMsg:'\
	<h1>Oups ! Aucun group choisi !</h1>\
	<h1><small>Pourquoi ne pas aller en <a href="#EDT/group">choisir</a> un ?</small></h1>',
btn:{
	getNote:function(a){
		alert(JSON.parse(decodeURI($(a).closest('[data-json]').data('json'))).note);
		
		
	},
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
		if(!json.name)return alert("Impossible car ce n'est pas une matiere")
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
	getInfo:function(a){
		var json=JSON.parse(decodeURI($(a).closest('[data-json]').data('json')));
		var msg="";
		for(var a in json)msg+=a+":"+json[a]+'\n';
		alert(msg);
	},
},
createHeader:function(events,names,now,delta,reload,cb){
	$header=$('<p style="height: 40px;"></p><div style="position:fixed;top:60px;z-index:999" class="container input-group">'+
		(delta?'<span class="input-group-btn" data-delta="-'+delta+'"><a class="btn btn-default"><i class="glyphicon glyphicon-chevron-left" ></i></a></span>':'')+
		'<a class="input-group-addon" id="datepicker_btn" ><i class="glyphicon glyphicon-calendar"></i></a>'+
		'<input class="form-control text-center" type="date" style="-webkit-appearance:none;" value="'+now.toISOString().substr(0,10)+'" id="datepicker"/>'+
		(reload?'<a class="input-group-addon" id="datepicker_btn" onclick="EDTController.refresh()"><i class="glyphicon glyphicon-refresh"></i></a>':'')+
		(delta?'<span class="input-group-btn" data-delta= "'+delta+'"><a class="btn btn-default"><i class="glyphicon glyphicon-chevron-right"></i></a></span>':'')+
	'</div>');
	$header.find('[data-delta]').click(function(){
		var $picker=$('#datepicker');
		if(!$picker.val())return;
		var old_date=new Date.fromInput($picker.val());
		var delta=$(this).data('delta');
		var new_date=new Date(old_date*1 + delta*24*60*60*1000);
		//skip days (day view only)
		if(Math.abs(delta)==1){
			for(var i=0;i<7;i++){
				if(EDTView.skipDays.indexOf(new_date.getUTCDay())==-1)break;
				new_date=new Date(new_date*1 + delta*24*60*60*1000);
			}
		}
		cb.call($page,events,names,new_date);
	});
	$header.find('input').change(function(){
		return cb.call($page,events,names,new Date.fromInput(this.value));
	});
	$header.find('#datepicker_btn').datepicker({
		format: "dd/mm/yyyy",
		language: "fr",
		forceParse: false,
		daysOfWeekDisabled: EDTView.skipDays,
		autoclose: true,
		todayHighlight: true
	}).datepicker('setUTCDate',now).on('changeDate',function(ev){
		var new_date=$(this).datepicker('getUTCDate');
		cb.call($page,events,names,new_date);
	});
	return $header;
},
showBy:function(events,names,base_date,cb,opt){
	var legend='<div class="dropdown pull-right">\
		<a class="btn dropdown-toggle" data-toggle="dropdown">Legende <span class="caret"></span></a>\
		<ul class="dropdown-menu">'
	for(var c in EDTView.colors)
		legend+='<li class="'+EDTView.colors[c]+'"><a>'+c+'</a></li>';
	legend+='</ul></div>';
	
	var now=new Date((opt.delta||0)+1*(new Date()));
	if(base_date)now=base_date;
	var events_now=opt.filter?events.filter(opt.filter,now):events;
	var reload=localStorage.edtDate!=(new Date()).getFullDate();
	this.html(opt.noHeader?'':EDTView.createHeader(events,names,now,opt.shift,reload,cb));
	if(EDTView.showBy.onshow)
		EDTView.showBy.onshow(events_now);
	if(!events_now.length)
		return this.append('<h2 class="text-center">Aucun cours :)</h2>');
	this.append(legend);
	var day='',month="";
	var prevEvent;
	events_now.forEach(function(e){
		var d='';
		if(opt.showMonth)d=e.date.getFullDay(3)+' '+e.date.getUTCDate()+' : ';
		if(month!=e.date.getFullMonth()){
			month=e.date.getFullMonth();
			if(opt.showMonth)
				this.append('<h2>'+month+'</h2>');
			day='';
		}
		if(day!=e.date.getFullDay()){
			day=e.date.getFullDay();
			if(opt.showDay)
				this.append('<h3>'+day+" "+e.date.getDate()+'</h3>');
		}
		e.bg='';
		for(var c in EDTView.colors)
			if(e.type.match(new RegExp(c,'i')))
				e.bg=EDTView.colors[c];
		e.salle=e.room.map(function(r){return r.replace(/FSI ?\/ ?/g,'').replace(/"/g,"")});
		e.alias=e.name?names[e.name]||e.name:'<em>'+e.type+'</em>';
		e.style="";
		if(new Date()>e.date)e.style='ev-past';
		if(new Date()>e.date && new Date()<1*e.date+72e5)e.style='ev-now';
		e.margin=0;
		if(opt.margin){
			if(prevEvent)
				e.margin=Math.max((((e.date-prevEvent.endt)/(60*60*1000))-0.25),e.margin);
			prevEvent=e;
		}
		this.append(hydrate(EDTView.template_show,{event:e,day:d}));
	},this);
},
showByDay :function(events,names,base_date,cb){
	var opt={delta:36e5  ,shift:1,showDay:true,filter:function(e){return e.date.toInputDate()==this.toInputDate()},margin:true};
	return EDTView.showBy.call(this,events,names,base_date,EDTView.showByDay,opt);//+6h shifted date
},
showByWeek:function(events,names,base_date,cb){
	var opt={delta:1764e5,shift:7,showDay:true,filter:function(e){return e.date.getWeek()==this.getWeek()}};
	return EDTView.showBy.call(this,events,names,base_date,EDTView.showByWeek,opt);//+2d+6h shifted date
},
showByYear:function(events,names,base_date,cb){
	var opt={showMonth:true,noHeader:true};
	return EDTView.showBy.call(this,events,names,base_date,EDTView.showByYear,opt);
},
lastTouchStartPos:0,
}
/*
$(window).on("touchstart", function(ev) {
	var e = ev.originalEvent;
	if (e.targetTouches.length!=2)return;
	lastTouchStartPos=e.targetTouches[0].pageX;
	e.preventDefault();
	e.stopPropagation();
});
$(window).on("touchend", function(ev) {
	var e = ev.originalEvent;
	var d=lastTouchStartPos-e.changedTouches[0].pageX;
	$('[data-delta]:'+(d<0?'first':'last')).click();
	e.preventDefault();
	e.stopPropagation();
});
*/
addEventListener('touchstart', function(e) {
	if (e.targetTouches.length!=2)return;
	lastTouchStartPos=e.targetTouches[0].pageX;
	e.preventDefault();
}, false);
addEventListener('touchend', function(e) {
	if(e.targetTouches.length!=1)return;
	var d=lastTouchStartPos-e.changedTouches[0].pageX;
	$("#page").css({position:"absolute"}).animate(d<0?{right:"200%",opacity:0}:{left:"-100%",opacity:0},function(){
	$('[data-delta]:'+(d<0?'first':'last')).click();
	$("#page").css({position:""}).animate(d<0?{right:"",opacity:1}:{left:"",opacity:1})
	})
	e.preventDefault();
}, false);
