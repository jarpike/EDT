NewsController={
	url:'http://univ-tlse.appspot.com/news/m1info',
	reload:function(){
		localStorage.removeItem(NewsController.url);
		$('#page .glyphicon').addClass("spinning");
		NewsController.Page.call($('#page'));
	},
	Page:function(type){
		$page=this.html(EDTController.recupMsg);
		$.get(NewsController.url,function(xml){
			var rss=(new DOMParser()).parseFromString(xml,"text/xml").documentElement;
			var title=$(rss).find('channel>title').text();
			var news=$(rss).find('item').map(function(){
				return {
					head:$(this).find('title').text().match(/(.*) - /)[1],
					body:$(this).find('description').text(),
					link:$(this).find('link').text(),
					date:new Date($(this).find('pubDate').text()),
				}
			});
			$page.html(hydrate(NewsView.header,{title:title}));
			news.each(function(){
				$page.append(hydrate(NewsView.row,{item:this}));
			});
		})
	},
}
