$(function(){
	if($('.navbar-fixed-top').size())$('body').css('padding-top','50px');
	$('body>nav').fadeOut(0).html(BootstrapMenu(myMenu)).slideDown();
	onhashchange({newURL:location.href});
});

onhashchange=function(event){
	var url=(event.newURL.match(/#.*/)||['#'])[0].substr(1).split(/\//g);
	//find the controller
	var ctrl_name=url[0]+"Controller",ctrl=window[ctrl_name];
	if(!ctrl)return $('body>.container').html(ctrl_name+" : not found");
	//find the page function
	var page_name=url[1]+"Page",page=window[ctrl_name][page_name];
	if(!page)return $('body>.container').html(page_name+" : not found in "+ctrl_name);
	//call the page function
	page.apply(this,url.slice(2));
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

Date.prototype.getWeek = function () {
	var j = new Date(this.getFullYear(), 0, 1);
	return Math.ceil((((this - j) / 864e5) + j.getDay() + 1) / 7) - 1;
};
