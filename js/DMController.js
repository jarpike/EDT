//DM pages : /DM/*
DMController={
	set:function(n,attr,val){
		if(val===null)return;//canceled prompt
		var dms=JSON.parse(localStorage.DM||'[]');
		dms[n][attr]=val;
		localStorage.DM=JSON.stringify(dms);
		onhashchange({newURL:location.href});
	},
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
			return '<a title="Supprimer ce DM" onclick="DMController.done('+pos+',this)" class="btn btn-sm btn-default">\
				<span class="glyphicon glyphicon glyphicon-trash"></span>\
			</a>';
		};
		this.html('<h2>Liste des DM :</h2>'+
			'<table class="table table-condensed">'+
			'<thead><tr><td>UE</td><td>Titre</td><td>Description</td><td>Date</td><td width="1%"></td></tr></thead>'+
			'<tbody>'+
			dms.map(function(dm,pos){if(!dm)return '';//previously deleted entry
				return '<tr class="'+(dm.done?'active':['success','info','warning','danger'][dm.lv])+'">\
					<td>'+dm.UE+'</td>\
					<td><a onclick="DMController.set('+pos+',\'title\',prompt(\'\',this.textContent))">'+dm.title+'</a></td>\
					<td><a onclick="DMController.set('+pos+',\'desc\' ,prompt(\'\',this.textContent))">'+(dm.desc||'<i>[ajouter]</i>')+'</a></td>\
					<td><div class="input-group date input-group-sm">\
						<input onchange="DMController.set('+pos+',\'date\',(new Date(this.value))*1)" class="form-control" type="date" value="'+(new Date(dm.date)).toISOString().substr(0,10)+'">\
						<span class="input-group-addon" data-pos="'+pos+'" id="datepicker_btn"><i class="glyphicon glyphicon-calendar"></i></span>\
					</div></td>\
					<td>'+ctrl(pos)+'</td>\
				</tr>';
			}).join('')+
			'</tbody></table>'
		);
		this.find('#datepicker_btn').datepicker({
			orientation: "auto right",
			format: "dd/mm/yyyy",
			language: "fr",
			forceParse: false,
			autoclose: true,
		}).on('changeDate',function(ev){
			var new_date=$(this).datepicker('getUTCDate');
			DMController.set($(this).data('pos'),'date',new_date*1);
		});
	}
}