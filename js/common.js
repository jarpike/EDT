$(function(){
	//setup url handler
	onhashchange({newURL:location.href});
	//load custom pref
	$('#customCSS').html(localStorage.customCSS||'');
	$('#customJS' ).html(localStorage.customJS ||'');
	//add top menu
	$('body').css('padding-top',($('.navbar-fixed-top').height()||0)+'px');
	$('body>nav').fadeOut(0).html(BootstrapMenu(myMenu)).fadeIn(1000);
	//setup watchdog
	lastSync = new Date();
	setInterval(function(){
		if((new Date()-lastSync)>60*1000)
			onawake((new Date()-lastSync));//unused since more than 1min
		lastSync = new Date();
		//ugly
		$('body').css('padding-top',($('.navbar-fixed-top').height()||0)+'px');
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

function hydrate(str,my){
	return str.replace(/{{(.*?)}}/g,function(a,b){return eval(b);})
}
Date.fromInput=function(str){
	var d=str.match(/(\d+)\/(\d+)\/(\d+)/);// dd/mm/yyyy
	if(d!=null)return new Date(d[3],d[2]-1,1+1*d[1]);
	var i=str.match(/(\d+)-(\d+)-(\d+)/);// yyyy-mm-dd
	if(i!=null)return new Date(i[1],i[2]-1,1+1*i[3]);
	console.warn("unknow date format :",str);
}
Date.prototype.getFullTime = function () {
	return ("0"+ this.getHours())   .slice(-2)+'h'+("0"+this.getMinutes()).slice(-2);
}
Date.prototype.getFullDate = function () {
	return ("0"+(this.getUTCMonth()+1)).slice(-2)+'/'+("0"+this.getUTCDate()).slice(-2);
}
Date.prototype.toInputDate = function () {
	return ("0"+this.getUTCDate()).slice(-2)+'/'+("0"+(this.getUTCMonth()+1)).slice(-2)+'/'+this.getFullYear();
}
Date.prototype.getFullDay = function (size) {
	return ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'][this.getDay()].slice(0,size);
}
Date.prototype.getFullMonth = function (size) {
	return ['Janvier','Fevrier','Mars','Avril','Mai','Juin','Juillet','Aout','Septembre','Octobre','Novembre','Decembre'][this.getMonth()].slice(0,size);
}
Date.prototype.getWeek = function () {
 var date = new Date(this.getTime()); date.setHours(0, 0, 0, 0);
 date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
 var week1 = new Date(date.getFullYear(), 0, 4);
 return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
}