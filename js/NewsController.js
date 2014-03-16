NewsController={
	template:'<div class="panel panel-default">\
			<div class="panel-heading"><a href="{{my.item.link}}">{{my.item.head}}</a><span class="badge pull-right">{{my.item.date.toInputDate()}}</span></div>\
			<div class="panel-body">{{my.item.body}}</div>\
		</div>',
	Page:function(type){
		$page=this;
		$.get('http://univ-tlse.appspot.com/news/m1info',function(xml){
			var rss=(new DOMParser()).parseFromString(xml,"text/xml").documentElement;
			$page.html('<h1>'+$(rss).find('channel>title').text()+'</h1>');
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
