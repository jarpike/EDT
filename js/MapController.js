MapController={
//DOM function
	createHandlerMenu:function(){
		localStorage.planHandler=localStorage.planHandler||'plan';
		return $('<a>').append(
		$('<div>').addClass('btn-group btn-group-xs btn-group-justified')
		.append($.map([
			{name:'myPlan',value:'plan'},
			{name:'Google',value:'gmap'},
		],function(a){
			return $('<a>').html(a.name)
			.addClass("btn btn-default "+(localStorage.planHandler==a.value?'active':''))
			.click(function(){
				$(this).parent().find('.active').removeClass('active');
				$(this).addClass('active');
				localStorage.planHandler=a.value;
			})
		})));
	},
	zoomTo:function(x,y,img){
		var div = img.parentElement;
		var zoom= localStorage.planZoom||2;
		if(!$(img).hasClass('img-responsive')){//fullsize
			div.scrollTop  = (y*img.naturalHeight/zoom - div.clientHeight/2);
			div.scrollLeft = (x*img.naturalWidth /zoom - div.clientWidth /2);
			$("#marker").css({display:"inherit"});
		}else{
			div.scrollTop  = (y*img.height - div.clientHeight/2);
			$("#marker").css({display:'none'});
		}
	},
	plan:{src:"http://www.pca.ups-tlse.fr/inter/images/PlanCampus.jpg",width:4900,height:3578,alt:"Loading ... or just crashed :p"},
	find:function(name){
		var zoom=localStorage.planZoom||2;
		var p=MapController.plan,w=p.width,h=p.height;
		var name2=name.replace(/\s/g,'').toLowerCase();
		for(var amphi in MapModel.amphis)
			if(name.match(name2))
				return {name:amphi,pos:MapModel.bats[MapModel.amphis[amphi]]};
		
		for(var bat in MapModel.bats)
			if(name.match(bat))
				return {name:bat,pos:MapModel.bats[bat]};
	},
	resize:function(e){$("#imcont").css({maxHeight:innerHeight-51+'px'})},
//Pages
	Page:function(cb){
		$('#page').parent().removeClass().addClass('container-fluid')
		var zoom=localStorage.planZoom||2;
		var p=MapController.plan;
		var div=this.html($('<div id="imcont">').append(
			$('<img class="img-responsive">').attr(p)
			.attr({width:p.width/zoom,height:p.height/zoom})
			.click(function(e){
				var img = this;
				var o = $(img).offset();
				var x=(e.pageX - o.left)/img.width ;
				var y=(e.pageY - o.top )/img.height;
				//must be after x,y so "zoomTo" get the minimized width/height
				$(img).toggleClass('img-responsive');//switch fit<->fullsize image
				MapController.zoomTo(x,y,img);
			})
			.load(cb?cb:$.noop)
		).append('<span id="marker"></span>'));
		(onresize=MapController.resize)();
		return div;
	},
	searchPage:function(salle){
		var found,salle=decodeURI(salle);
		if(!(found=MapController.find(salle))){
			alert(salle+" : introuvable");
			return false;
		}
		if(localStorage.planHandler=='gmap'){
			window.open('http://maps.google.com/?q='+found.pos.ll+'&ll='+found.pos.ll,'_blank');
			return false;
		}
		if(localStorage.planHandler=='plan'){
			var div=MapController.Page.call(this,function(loaded){
				var img=$(div).find('img')[0];
				var x=found.pos.x/img.naturalWidth;
				var y=found.pos.y/img.naturalHeight;
				$(img).toggleClass('img-responsive');//switch fit<->fullsize image
				MapController.zoomTo(x,y,img);
				$('#marker').html('<b style="font-size: 3em;">&#8598;</b> <span>'+salle+'</span>')
					.css({left:x*img.width,top:y*img.height-15})
			});
		}
	}
}