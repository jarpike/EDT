DMModel={
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
}