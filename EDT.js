localStorage.edtView=localStorage.edtView||"week";

var EDT = {
	ajax_url:localStorage.edtURL||'http://univ-tlse.appspot.com/edt/',
	
	parse:function(xml){
		function qsa(elem,path){
			var e=elem.querySelectorAll(path);
			return e?[].slice.call(e).map(function (a) {return a.textContent;}):[];
		}
		function getEventDate(event,weeks){
			for(var c=0;c<event.week.length;c++){
				if(event.week[c]!='Y')continue;
				for(var w in weeks){
					if(weeks[w].event!=c)continue;
					var t=event.time.match(/\d+/g);
					return new Date(weeks[w].date*1 + event.nday*864e5 + (t[0]*60+t[1]*1)*6e4);
				}
			}
		}
		//ASSERT:only one 'Y' per span>alleventweeks
		var weeks=[].slice.call(xml.querySelectorAll('span')).map(function (w) {
			return {
				date:new Date(w.attributes['date'].value.split('/').reverse().join('/')),
				event:qsa(w,'alleventweeks')[0].indexOf('Y')
			};
		});
		//ASSERT:only one 'Y' per event
		//TODO:handle multiple 'Y' per event
		var events=[].slice.call(xml.querySelectorAll('event')).map(function (e) {
			var event={
				nday:qsa(e,'day')[0],
				time:qsa(e,'starttime')[0],
				type:qsa(e,'category')[0],
				week:qsa(e,'rawweeks')[0],
				room:qsa(e,'resources>room  >item').join('\n'),
				prof:qsa(e,'resources>staff >item').join('\n'),
				note:qsa(e,'resources>notes >item').join(''),
				name:qsa(e,'resources>module>item')[0]//poly module ?! why.jpg
			};
			//poly event test => 0 found => see ASSERT
			if(event.week.match(/Y/g,'').length>1)console.warn('poly event',event);
			event.date=getEventDate(event,weeks);
			return event;
		}).sort(function (a,b){return a.date-b.date;});
		//window.edt={weeks:weeks,events:events};
		console.log({weeks:weeks,events:events});
		return {weeks:weeks,events:events};
	}
};
