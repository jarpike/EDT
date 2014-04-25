NewsView={
	header:'<h1>{{my.title}} <a onclick="NewsController.reload()" class="btn btn-default">{[refresh]}</a></h1>',
	row:'<div class="panel panel-default">\
			<div class="panel-heading">\
				<a href="{{my.item.link}}">{{my.item.head}}</a>\
				<span class="badge pull-right">{{my.item.date.toInputDate()}}</span>\
			</div>\
			<div class="panel-body">{{my.item.body}}</div>\
		</div>',
}
