DMView={
	empty:"<h2>Aucun Devoirs Maison ... <small>Pour le moment</small></h2>",
	page:'<h2>Devoirs Maisons :</h2>\
		<table class="table table-condensed">\
		<thead><tr><th>UE</th><th>Titre</th><th>Description</th><th>Date</th><th width="1%"></th></tr></thead>\
		<tbody></tbody>\
	</table>',
	row:'<tr>\
		<td>{{my.UE}}</td>\
		<td><a name="title">{{my.title}}</a></td>\
		<td><a name="desc">{{my.desc||"<i>ajouter...</i>"}}</a></td>\
		<td><div class="input-group date input-group-sm">\
			<span class="input-group-addon datepicker_btn">J{{(my.cdc<0?"-":"+")+my.cdc}}</span>\
			<input name="date" class="form-control" type="date" value="{{my.time}}">\
			<span class="input-group-addon datepicker_btn">{[calendar]}</span>\
		</div></td>\
		<td><a name="done" class="btn btn-sm btn-default">{[trash]}</a></td>\
	</tr>',
};
