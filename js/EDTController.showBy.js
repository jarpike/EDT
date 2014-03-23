EDTController.template='\
	<div class="event {{my.event.style}} {{my.event.bg}}" \
		data-json="{{encodeURI(JSON.stringify(my.event))}}">\
		&nbsp;<code>{{my.day}}{{my.event.date.getFullTime()}}</code>\
		<div class="btn-group">\
			<a class="btn btn-link dropdown-toggle" data-toggle="dropdown">\
				{{my.event.alias||my.event.name}}&nbsp;<span class="caret"></span>\
			</a>\
			<ul class="dropdown-menu">\
				<li><a onclick="EDTController.btn.hideUE  (this)">Cacher</a></li>\
				<li><a onclick="EDTController.btn.renameUE(this)">Renommer</a></li>\
				<li><a onclick="EDTController.btn.addDM   (this)">Ajouter DM</a></li>\
				<li><a onclick="EDTController.btn.getInfo (this)">Info brute</a></li>\
			</ul>\
		</div>\
		<a href="#Map/search/{{my.event.salle}}">{{my.event.salle}}</a>\
	</div>\
';

var lastTouchStartPos=0;
addEventListener('touchstart', function(e) {
	if (e.targetTouches.length!=2)return;
	lastTouchStartPos=e.targetTouches[0].pageX;
	e.preventDefault();
}, false);
addEventListener('touchend', function(e) {
	if(e.targetTouches.length!=1)return;
	var d=lastTouchStartPos-e.changedTouches[0].pageX;
	$('[data-delta]:'+(d<0?'first':'last')).click();
	e.preventDefault();
}, false);

EDTController.btn={
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
	getInfo:function(a){
		var json=JSON.parse(decodeURI($(a).closest('[data-json]').data('json')));
		var msg="";
		for(var a in json)msg+=a+":"+json[a]+'\n';
		alert(msg);
	},
};

EDTController.createHeader=function(events,names,now,delta,reload,cb){
	$header=$('<div style="padding:15px;" class="input-group">'+
		(delta?'<span class="input-group-btn" data-delta="-'+delta+'"><a class="btn btn-default"><i class="glyphicon glyphicon-chevron-left" ></i></a></span>':'')+
		'<a class="input-group-addon" id="datepicker_btn" ><i class="glyphicon glyphicon-calendar"></i></a>'+
		'<input class="form-control text-center" type="date" value="'+now.toISOString().substr(0,10)+'" id="datepicker"/>'+
		(reload?'<a class="input-group-addon" id="datepicker_btn" onclick="EDTController.refresh()"><i class="glyphicon glyphicon-refresh"></i></a>':'')+
		(delta?'<span class="input-group-btn" data-delta= "'+delta+'"><a class="btn btn-default"><i class="glyphicon glyphicon-chevron-right"></i></a></span>':'')+
	'</div>');
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
};

EDTController.showBy=function(events,names,base_date,cb,opt){
	$page=this;
	var now=new Date((opt.delta||0)+1*(new Date()));
	if(base_date)now=base_date;
	var events_now=opt.filter?events.filter(opt.filter,now):events;
	var reload=localStorage.edtDate!=(new Date()).getFullDate();
	this.html(opt.noHeader?'':EDTController.createHeader(events,names,now,opt.shift,reload,cb));
//	if(localStorage.edtDate!=(new Date()).getFullDate())
//		this.append($('<div id="outdated" class="alert alert-danger alert-dismissable">').html('<a class="close" data-dismiss="alert">&times;</a> Pensez a <a onclick="EDTController.refresh()">actualiser</a> votre EDT.'));
	if(EDTController.showBy.onshow)
		EDTController.showBy.onshow(events_now);
	if(!events_now.length)
		return this.append('<h2 class="text-center">Aucun cours :)</h2>');
	var day='',month="";
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
				this.append('<h3>'+day+'</h3>');
		}
		e.bg={COURS:"bg-info",'COURS/TD':"bg-danger",TD:"bg-danger",TP:"bg-success",SOUTENANCE:"bg-warning"}[e.type]||'';
		e.salle=e.room.replace(/FSI ?\/ ?/g,'').replace(/"/g,"");
		e.alias =names[e.name||'?']||e.name||"?";
		e.style="";
		if(new Date()>e.date)e.style='ev-past';
		if(new Date()>e.date && new Date()<1*e.date+72e5)e.style='ev-now';
		this.append(hydrate(EDTController.template,{event:e,day:d}));
	},this);
};

EDTController.showByDay =function(events,names,base_date,cb){
	var opt={delta:36e5  ,shift:1,showDay:true,filter:function(e){return e.date.toInputDate()==this.toInputDate()}};
	return EDTController.showBy.call(this,events,names,base_date,EDTController.showByDay,opt);//+6h shifted date
};

EDTController.showByWeek=function(events,names,base_date,cb){
	var opt={delta:1764e5,shift:7,showDay:true,filter:function(e){return e.date.getWeek()==this.getWeek()}};
	return EDTController.showBy.call(this,events,names,base_date,EDTController.showByWeek,opt);//+2d+6h shifted date
};

EDTController.showByYear=function(events,names,base_date,cb){
	var opt={showMonth:true,noHeader:true};
	return EDTController.showBy.call(this,events,names,base_date,EDTController.showByYear,opt);
};
