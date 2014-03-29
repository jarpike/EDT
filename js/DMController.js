//DM pages : /DM/*
DMController={
	template:'<tr>\
		<td>{{my.UE}}</td>\
		<td><a name="title">{{my.title}}</a></td>\
		<td><a name="desc">{{my.desc||"<i>ajouter...</i>"}}</a></td>\
		<td><div class="input-group date input-group-sm">\
			<input name="date" class="form-control" type="date" value="{{my.time}}">\
			<span class="input-group-addon datepicker_btn">{[calendar]}</span>\
		</div></td>\
		<td><a name="done" class="btn btn-sm btn-default">{[trash]}</a></td>\
	</tr>',
	set:function(e,val){
		var attr=e.currentTarget.name;
		if(attr=='done')val=true;
		if(['title','desc'].indexOf(attr)>=0)val=prompt('Nouvelle valeur :');
		if(e.type=='change')val=(new Date(e.target.value)).toISOString();
		if(!val)return;//empty/canceled values
		var dms=JSON.parse(localStorage.DM||'[]');
		dms[this][attr]=val;
		dms=dms.filter(function(a){return a&&!a.done});
		localStorage.DM=JSON.stringify(dms);
		onhashchange({newURL:location.href});
	},
//Pages
	Page:function(){
		var dms=JSON.parse(localStorage.DM||'[]').filter(function(a){return a&&!a.done});
		if(!dms.length)return this.html("<h2>Aucun Devoirs Maison ... <small>Pour le moment</small></h2>");
		this.html('<h2>Devoirs Maisons :</h2>'+
			'<table class="table table-condensed">'+
			'<thead><tr><th>UE</th><th>Titre</th><th>Description</th><th>Date</th><th width="1%"></th></tr></thead>'+
			'<tbody></tbody></table>').find('tbody').html(dms.map(function(dm,pos){
				dm.time=(new Date(dm.date)).toISOString().substr(0,10);
				var row=$(hydrate(DMController.template,dm))
				row.find('[name]').on('click change',DMController.set.bind(pos))
				row.find('.datepicker_btn').datepicker({
					orientation: "top right",
					format: "dd/mm/yyyy",
					language: "fr",
					forceParse: false,
					autoclose: true,
				}).on('changeDate',function(ev){
					DMController.set.call(pos,{currentTarget:{name:'date'}},$(this).datepicker('getUTCDate').toISOString());
				})
				return row;
			}));
	}
}