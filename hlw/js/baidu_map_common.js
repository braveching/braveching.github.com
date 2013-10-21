function CreateNewMap(id){
	document.getElementById("myModal").style.display = 'none';
	document.getElementById("myModal").style.display = 'block';
	var map = new BMap.Map(id,{mapType: BMAP_NORMAL_MAP}); // 创建Map实例
	map.enableScrollWheelZoom();                            //启用滚轮放大缩小
	//---------------------加地图类型控制--------------------//
	map.addControl(new BMap.MapTypeControl({
	  //type:BMAP_MAPTYPE_CONTROL_DROPDOWN,
	  mapTypes:[BMAP_NORMAL_MAP,BMAP_HYBRID_MAP,BMAP_SATELLITE_MAP]
	  })
	);	
	// var point = showAddress(map,"北京市海淀区上园村3号","北京市");
    var point = new BMap.Point(116.404, 39.915);    // 创建点坐标
    
	map.centerAndZoom(point,15);                     // 初始化地图,设置中心点坐标和地图级别。
	map.setCurrentCity("北京");
	//---------------------加标签--------------------//
	var marker = new BMap.Marker(point,{
	    enableDragging: true,
	    raiseOnDrag: true
	});
	// maker 动画效果
	//marker.setAnimation(BMAP_ANIMATION_DROP);
	// maker 弹跳效果
	marker.setAnimation(BMAP_ANIMATION_BOUNCE);
	// maker 清楚动画
	//marker.setAnimation(null);
	setTimeout(function(){
	  marker.setAnimation(null);}, 
	  2000); // 2秒停止动画
	map.addOverlay(marker);	
	map.setCenter(point);
}

function showAddress(address,city){
	var map = new BMap.Map("map",{mapType: BMAP_NORMAL_MAP,enableAutoResize: false}); // 创建Map实例
	map.enableScrollWheelZoom();                            //启用滚轮放大缩小
    map.addControl(new BMap.NavigationControl());  
    //map.addControl(new BMap.MapTypeControl());  
    map.addControl(new BMap.ScaleControl());  
    map.addControl(new BMap.OverviewMapControl({ isOpen: true, anchor: BMAP_ANCHOR_BOTTOM_RIGHT })); 
	//---------------------加地图类型控制--------------------//
	map.addControl(new BMap.MapTypeControl({
	  //type:BMAP_MAPTYPE_CONTROL_DROPDOWN,
	  mapTypes:[BMAP_NORMAL_MAP,BMAP_HYBRID_MAP,BMAP_SATELLITE_MAP]
	  })
	);

	//---------------------地理编码--------------------//
	// 创建地址解析器实例  
	var myGeo = new BMap.Geocoder(); 
	var marker; 
	// 将地址解析结果显示在地图上，并调整地图视野  getPoint(address:String, callback:Function, city:String)
	myGeo.getPoint(address, function(point){    
		if (point) {
		    map.centerAndZoom(point, 14); 
			marker = new BMap.Marker(point,{
			    enableDragging: true,
			    raiseOnDrag: true
			});
			// maker 动画效果
			//marker.setAnimation(BMAP_ANIMATION_DROP);
			// maker 弹跳效果
			// console.log('start Animation \n');
			marker.setAnimation(BMAP_ANIMATION_BOUNCE);
			// maker 清除动画
			//marker.setAnimation(null);
			map.addOverlay(marker);
			setTimeout(function(){			  	
			  	marker.setAnimation(null);
			  },2000); // 2秒停止动画		
		}    
	},city);	
	return map;
}
function clearAddress(){
	console.log('Clear Map \n');	
	$("#map_canvas").remove();
	var elm = document.createElement('div');
	elm.style.height = "300px"; 
	elm.setAttribute("id","map_canvas");
	$('#modal-body').append(elm);
	//document.getElementById("map_canvas").innerHtml = '';
}
function showHomePath(map,vihicle_type,departure,destination,scale){
	var lushu;
	var icon_url;

	if(vihicle_type == "train"){
		icon_url = 'images/bus.png';
	}else if(vihicle_type == "flight"){
		icon_url = 'images/plane.png';
	}
	// var map = new BMap.Map(id);
	// map.centerAndZoom(new BMap.Point(116.404, 39.915), 13);
	// 实例化一个驾车导航用来生成路线
	
	var drv = new BMap.DrivingRoute(scale, {
	    onSearchComplete: function(res) {  // 在执行完drv.search()后才会回调
	        if (drv.getStatus() == BMAP_STATUS_SUCCESS) {
	        	console.log('show Home Path');
	            var arrPois = res.getPlan(0).getRoute(0).getPath();
	            var dis = BMapLib.GeoUtils.getPolylineDistance(arrPois); // GeoUtils类提供若干几何算法
    			//alert("共" + dis.toFixed(2) + "米");
    			var move_speed = dis.toFixed(2)/10;            
	            map.clearOverlays();//先清除之前的覆盖物
	            map.addOverlay(new BMap.Polyline(arrPois, {strokeColor: '#111'}));
	            map.setViewport(arrPois);
				    // 自行添加起点和终点
				var start = res.getStart();
				var end = res.getEnd();
				addStartPoint(map,start.point, start.title);
				addEndPoint(map,end.point, end.title);		            
	            lushu = new BMapLib.LuShu(map,arrPois,{
	            icon:new BMap.Icon(icon_url, new BMap.Size(32, 32), {
			             anchor: new BMap.Size(16, 22)
			         }),
	            defaultContent:"回家咯",
	            speed:move_speed,
	            landmarkPois: [
	               {lng:116.314782,lat:39.913508,html:'加油站',pauseTime:2},
	               {lng:116.315391,lat:39.964429,html:'高速公路收费',pauseTime:3},
	               {lng:116.381476,lat:39.974073,html:'肯德基早餐',pauseTime:2}
	            ]}); 

	            lushu.start();
	                        // 方案描述
            	addText(res);
	            // setTimeout(function(){
	            // 	lushu.stop();
	            // },3000);
	        }
	    }
	});
	drv.search(departure,destination); 
	// if($("button#show_home_path").html() == "显示回家线路"){		
	// 	$("button#show_home_path").html("隐藏回家线路");
	// 	$("button#show_home_path").removeClass().addClass("btn btn-danger");
		
	// }else if($("button#show_home_path").html() == "暂停"){
	// 	$("button#show_home_path").html("显示回家线路");
	// 	$("button#show_home_path").removeClass().addClass("btn btn-info");
	// 	// lushu.stop();
	// }	                	
}
// 添加方案描述
function addText(results) {
    var plan = results.getPlan(0);
    // 获取方案中包含的路线
	var htmls = [];
    for (var i =0; i < plan.getNumRoutes(); i ++) {
        var route = plan.getRoute(i);
        for (var j =0; j < route.getNumSteps(); j ++) {
            var curStep = route.getStep(j);
            htmls.push((j +1) +'. '+ curStep.getDescription() +'<br />');
        }
    }
    var panel = document.getElementById('panel');
    panel.innerHTML = htmls.join('');
    panel.style.lineHeight ='1.4em';
    panel.style.fontSize ='12px';
}
// 添加起点覆盖物
function addStartPoint(map, point, title){
	var marker = new BMap.Marker(point, {
        title: title,
        icon: new BMap.Icon('images/path_start.png', new BMap.Size(28, 32), {
            anchor: new BMap.Size(14, 32)
        })});
    map.addOverlay(marker);
}

// 添加终点覆盖物
function addEndPoint(map, point, title){
    map.addOverlay(new BMap.Marker(point, {
        title: title,
        icon: new BMap.Icon('images/path_stop.png', new BMap.Size(28, 32), {
            anchor: new BMap.Size(14, 32)
        })}));
}
//计算长度，参数为折线
function computeLenByPolyine(){    
    var pts = [];
    var pt1 = new BMap.Point(116.400,39.910);
    var pt2 = new BMap.Point(116.402,39.912);
    var pt3 = new BMap.Point(116.403,39.914);
    var pt4 = new BMap.Point(116.404,39.917);
    var pt5 = new BMap.Point(116.406,39.918);
    
    pts.push(pt1);
    pts.push(pt2);
    pts.push(pt3);
    pts.push(pt4);
    pts.push(pt5);

    var ply = new BMap.Polyline(pts);    
    var dis = BMapLib.GeoUtils.getPolylineDistance(ply);
    alert("共" + dis.toFixed(2) + "米");
    
    //演示：将线添加到地图上
    map.clearOverlays();
    map.addOverlay(ply);
}