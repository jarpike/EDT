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