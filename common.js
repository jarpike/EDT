$(function(){
	if($('.navbar-fixed-top').size())$('body').css('padding-top','50px');
	$('body>nav').fadeOut(0).html(BootstrapMenu(myMenu)).slideDown();
	onhashchange({newURL:location.href});
});

onhashchange=function(event){
	function getHash(url){return (url.match(/#.*/)||['#'])[0];}
	
	if(onhashchange.internal==getHash(event.newURL))
		return onhashchange.internal = false;
	
	onresize=null;//reset on resize callback
	var $target=$('body>.container');
	var url=getHash(event.newURL).substr(1).split(/\//g);
	//find the controller
	var ctrl_name=(url[0]||'')+"Controller",ctrl=window[ctrl_name];
	if(!ctrl)return $target.html(ctrl_name+" : not found");
	//find the page function
	var page_name=(url[1]||'')+"Page",page=window[ctrl_name][page_name];
	if(!page)return $target.html(page_name+" : not found in "+ctrl_name);
	//call the page function
	var result=page.apply($target,url.slice(2));
	if(result===false)
		return onhashchange.internal=document.location.hash=getHash(event.oldURL);
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
