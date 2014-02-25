$(function(){
	if($('.navbar-fixed-top').size())$('body').css('padding-top','50px');
	$('body>nav').fadeOut(0).html(BootstrapMenu(myMenu)).slideDown();
	onhashchange({newURL:location.href});
});

onhashchange=function(event){
	var url=(event.newURL.match(/#.*/)||['#'])[0].substr(1).split(/\//g);
	if(!url[0] || !window[url[0]])
		return $('body>.container').html(url[0]+' : class not found')
	var result=window[url[0]][url[1]+'Page'].apply(this,url.slice(2));
	if(result)$('body>.container').html(result);
};

$.ajaxPrefilter(function(opt,_opt,jqXHR){
	var value=localStorage.getItem(opt.url);
	if(value && !opt.nocache){
		if(opt.success)opt.success(value);
		jqXHR.abort();
	}else{
		if(opt.success)opt._success=opt.success;//hook the callback
		opt.success=function(data){
			localStorage.setItem(opt.url,jqXHR.responseText);
			if(opt._success)opt._success(jqXHR.responseText);
		};
	}
});