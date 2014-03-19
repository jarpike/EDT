NewsController={
	url:'http://univ-tlse.appspot.com/news/m1info',
	reload:function(){
		localStorage.removeItem(NewsController.url);
		NewsController.Page.call($('#page'));
	},
	template:'<div class="panel panel-default">\
			<div class="panel-heading"><a href="{{my.item.link}}">{{my.item.head}}</a><span class="badge pull-right">{{my.item.date.toInputDate()}}</span></div>\
			<div class="panel-body">{{my.item.body}}</div>\
		</div>',
	Page:function(type){
		$page=this.html(EDTController.recupMsg);
		$.get(NewsController.url,function(xml){
			var rss=(new DOMParser()).parseFromString(xml,"text/xml").documentElement;
			var title=$(rss).find('channel>title').text();
			$page.html('<h1>'+title+' <a onclick="NewsController.reload()" class="btn btn-default glyphicon glyphicon-refresh"></a></h1>');
			var news=$(rss).find('item').map(function(){
				return {
					head:$(this).find('title').text().match(/(.*) - /)[1],
					body:$(this).find('description').text(),
					link:$(this).find('link').text(),
					date:new Date($(this).find('pubDate').text()),
				}
			});
			news.each(function(){
				$page.append(hydrate(NewsController.template,{item:this}));
			})
		})
	},
}
