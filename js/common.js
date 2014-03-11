$(function(){
	if($('.navbar-fixed-top').size())$('body').css('padding-top','50px');
	$('body>nav').fadeOut(0).html(BootstrapMenu(myMenu)).slideDown();
	onhashchange({newURL:location.href});
	//check if the device was sleeping
	lastSync = new Date();
	setInterval(function(){
		if((new Date()-lastSync)>2*1000)onawake();
		lastSync = new Date();
	},1000);
});

onawake=function(event){
	onhashchange({newURL:location.href});
}
onhashchange=function(event){
	function getHash(url){return (url.match(/#.*/)||['#'])[0];}
	//don't change url on internal job
	if(onhashchange.internal==getHash(event.newURL))
		return onhashchange.internal = false;
	//reset to default values
	onresize=null;
	$('#page').parent().removeClass().addClass('container')
	//init var
	var $target=$('#page');
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
	if(value){
		if(opt.success){opt.success(value);jqXHR.abort()};
		//else : jquery internal handler (.load ...)
	}else{
		if(opt.success)opt._success=opt.success;//hook the callback
		opt.success=function(data){
			localStorage.setItem(opt.url,jqXHR.responseText);
			if(opt._success)opt._success(jqXHR.responseText);
		};
	}
});

Date.prototype.getFullDay = function () {
	return ['dim','lun','mar','mer','jeu','ven','sam'][this.getDay()];
}
Date.prototype.getWeek = function () {
	var tmp = new Date(this.valueOf());
	tmp.setDate(tmp.getDate() - ((this.getDay()+6)%7)+3);
	return Math.ceil(((tmp - new Date(tmp.getFullYear(),0,4))/864e5)/7);
}