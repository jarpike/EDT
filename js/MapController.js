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
	createZoomMenu:function(){
		localStorage.planZoom=localStorage.planZoom||2;
		return $('<a>').append(
		$('<div>').addClass('btn-group btn-group-xs btn-group-justified')
		.append($.map([
			{name:'&#189;',value:2/1},
			{name:'&#190;',value:4/3},
			{name:'1'     ,value:1/1},
			{name:'2'     ,value:1/2},
		],function(a){
			return $('<a>').html(a.name)
			.addClass("btn btn-default "+(localStorage.planZoom==a.value?'active':''))
			.click(function(){
				$(this).parent().find('.active').removeClass('active');
				$(this).addClass('active');
				localStorage.planZoom=a.value;
				if(location.hash.match("#Map")){
					BootstrapMenu.hide();
					onhashchange({newURL:location.href});
				}
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
		var bats={
			"MRV" :{x:2150/w,y:1688/h,ll:'43.566269,1.467403'},
			"1A"  :{x:2790/w,y:2060/h,ll:'43.562206,1.467244'},
			"2A"  :{x:2500/w,y:1950/h,ll:'43.563863,1.466572'},
			"3A"  :{x:3250/w,y:2060/h,ll:'43.560239,1.469195'},
			"4A"  :{x:3570/w,y:2162/h,ll:'43.558254,1.469854'},
			"1R1" :{x:2850/w,y:2255/h,ll:'43.561300,1.466276'},
			"1R3" :{x:2760/w,y:2255/h,ll:'43.561689,1.465826'},
			"1TP1":{x:2800/w,y:2133/h,ll:'43.561899,1.466856'},
			"3TP2":{x:3000/w,y:2133/h,ll:'43.561013,1.467789'},
			"U1"  :{x:3290/w,y:1940/h,ll:'43.560375,1.470225'},
			"U2"  :{x:3170/w,y:1777/h,ll:'43.561192,1.470407'},
			"U3"  :{x:3040/w,y:1777/h,ll:'43.561934,1.470010'},
			"U4"  :{x:2870/w,y:1777/h,ll:'43.562638,1.469484'},
		};
		var amphis={
			ampere         :'3A',
			baillaud       :'U4',
			borel          :'U2',
			concorde       :'U4',
			cotton         :'3A',
			curie          :'3A',
			daurat         :'U3',
			debroglie      :'U2',
			denjoy         :'U1',
			enstein        :'3TP2',
			fermat         :'1A',
			frenet         :'U2',
			grignard       :'2A',
			langevin       :'3A',
			lechatelier    :'2A',
			leclercdusablon:'4A',
			mathis         :'U1',
			molliard       :'3TP2',
			schwartz       :'4A',
			shannon        :'1R3',
			stieltjes      :'U4',
			turing         :'1A',
			vandel         :'U4',
		};
		var name2=name.replace(/\s/g,'').toLowerCase();
		for(var amphi in amphis)
			if(name.match(name2))
				return {name:amphi,pos:bats[amphis[amphi]]};
		
		for(var bat in bats)
			if(name.match(bat))
				return {name:bat,pos:bats[bat]};
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
				$(img).toggleClass('img-responsive');//switch fit<->fullsize image
				MapController.zoomTo(found.pos.x,found.pos.y,img);
				$('#marker').html('<b style="font-size: 3em;">&#8598;</b> <span>'+salle+'</span>')
					.css({left:found.pos.x*img.width,top:found.pos.y*img.height-15})
			});
		}
	}
}