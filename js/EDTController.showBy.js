EDTController.template='\
	<div class="event {{my.event.style}} {{my.event.bg}}" \
		data-json="{{encodeURI(JSON.stringify(my.event))}}">\
		&nbsp;<code>{{my.day}}{{my.event.date.getFullTime()}}</code>\
		{{EDTController.btnUE(my.event)}}\
		<a href="#Map/search/{{my.event.salle}}">{{my.event.salle}}</a>\
	</div>\
';

EDTController.showBy=function(events,names,base_date,cb,opt){
	$page=this;
	var now=new Date((opt.delta||0)+1*(new Date()));
	if(base_date)now=base_date;
	var events_now=opt.filter?events.filter(opt.filter,now):events;
	this.html(opt.noHeader?'':EDTController.createHeader(events,names,now,opt.shift||0,cb));
	if(localStorage.edtDate!=(new Date()).getFullDate())
		this.append($('<div class="alert alert-warn">').html("Cet emploi du temps récupéré le "+localStorage.edtDate+". Vous devriez l'<a onclick=\"EDTController.refresh()\">actualiser</a> si possible."));
	if(EDTController.showBy.onshow)EDTController.showBy.onshow(events_now);
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
