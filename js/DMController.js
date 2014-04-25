//DM pages : /DM/*
DMController={
//Pages
	Page:function(){
		var dms=JSON.parse(localStorage.DM||'[]').filter(function(a){return a&&!a.done});
		if(!dms.length)return this.html(DMView.empty);
		this.html(DMView.page).find('tbody').html(dms.map(function(dm,pos){
				dm.time=(new Date(dm.date)).toISOString().substr(0,10);
				dm.cdc=Math.floor((new Date()-new Date(dm.date))/1000/60/60/24);
				var row=$(hydrate(DMView.row,dm))
				row.find('[name]').on('click change',DMModel.set.bind(pos))
				row.find('.datepicker_btn').datepicker({
					orientation: "top right",
					format: "dd/mm/yyyy",
					language: "fr",
					forceParse: false,
					autoclose: true,
				}).on('changeDate',function(ev){
					DMModel.set.call(pos,{currentTarget:{name:'date'}},$(this).datepicker('getUTCDate').toISOString());
				})
				return row;
			}));
	}
}