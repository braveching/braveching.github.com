$(function() {
	//caching
	//the main wrapper of the gallery
	var $fp_gallery			= $('#fp_gallery')
	//the overlay when the large image is displayed
	var $fp_overlay			= $('#fp_overlay');
	//image loading status
	var $fp_loading			= $('#fp_loading');
	//the next and previous buttons
	var $fp_next			= $('#fp_next');
	var $fp_prev			= $('#fp_prev');
	//the close button
	var $fp_close			= $('#fp_close');
	//the main container for the thumbs structure
	var $fp_thumbContainer 	= $('#fp_thumbContainer');
	//wrapper of jquery ui slider
	var $fp_scrollWrapper	= $('#fp_scrollWrapper');
	//Tips of jquery ui slider
	var $fp_scrollTip		= $('#fp_scrollTip');
	//total number of images
	var nmb_images=0;
	//which gallery is clicked (index)
	var gallery_idx=-1;
	//scroller wrapper
	var $fp_thumbScroller	= $('#fp_thumbScroller');
	//jquery ui slider
	var $slider				= $('#slider');
	//fp_galleryList
	var $fp_galleryList		= $('#fp_galleryList');
	//the links of the galleries (the cities)
	var $fp_galleries		= $('#fp_galleryList > li');
	//where_am_i
	var $where_am_i 		= $('#where_am_i');
	//contact us 
	var $contact_us 		= $('#contact_us');
	//map
	var $map		 		= $('#map');
	//service
	var $service	 		= $('#service');
	//current image being viewed
	var current				= 0;
	
	//some control flags:
	//prevent fast clicks on next and previous
	var photo_nav			= true;
	
	checkWebOs();
	$fp_galleryList.css({
		'margin-left': Math.floor(($(window).width() - $fp_galleryList.width()) / 2)  + 'px'
	});
	//User clicks on a city / gallery;
	$fp_galleries.bind('click',function(){
		$fp_galleries.removeClass('current');
		var $gallery 		= $(this);
		$gallery.addClass('current');
		var gallery_index 	= $gallery.index();
		if(gallery_idx == gallery_index) return;
		gallery_idx			= gallery_index;
		//close the gallery and slider if opened
		if($fp_thumbContainer.data('opened')==true){
			$fp_scrollWrapper.fadeOut();
			$fp_scrollTip.fadeOut();
			$fp_thumbContainer.stop()
							  .animate({'height':'0px'},200,function(){
							  	if($gallery.attr("id") == "non_images_Service"){
							  		openGalleryContainer($gallery,"non_images_Service");
							  	}else if($gallery.attr("id") == "non_images_About"){
							  		openGalleryContainer($gallery,"non_images_About");
							  	}else if($gallery.attr("id") == "non_images_Contact"){
							  		openGalleryContainer($gallery,"non_images_Contact");
							  	}else
									openGallery($gallery);
							  });
		}				  
		else{
		  	if($gallery.attr("id") == "non_images_Service"){
		  		openGalleryContainer($gallery,"non_images_Service");
		  	}else if($gallery.attr("id") == "non_images_About"){
		  		openGalleryContainer($gallery,"non_images_About");
		  	}else if($gallery.attr("id") == "non_images_Contact"){
		  		openGalleryContainer($gallery,"non_images_Contact");
		  	}else
				openGallery($gallery);						
		}
	});
		
	//opens a gallery after cliking on a city / gallery
	function openGallery($gallery){
		//current gets reseted
		current				= 0;				  
		//wrapper of each content div, where each image is
		var $fp_content_wrapper = $fp_thumbContainer.find('.container:nth-child('+parseInt(gallery_idx+1)+')');
		//hide all the other galleries thumbs wrappers
		$fp_thumbContainer.find('.container').not($fp_content_wrapper).hide();
		//and show this one
		$fp_content_wrapper.show();
		//total number of images
		nmb_images			= $fp_content_wrapper.children('div').length;
		//calculate width,
		//padding left 
		//and padding right for content wrapper
		var w_width 	= 0;
		var padding_l	= 0;
		var padding_r	= 0;
		//center of screen
		var center		= $(window).width()/2;
		var one_divs_w  = 0;
		/*
		Note:
		the padding left is the center minus half of the width of the first content div
		the padding right is the center minus half of the width of the last content div
		*/
		$fp_content_wrapper.children('div').each(function(i){
			var $div 		= $(this);
			var div_width	= $div.width(); 
			w_width			+=div_width;
			//if first one, lets calculate the padding left
			if(i==0)
				padding_l = center - (div_width/2);
			//if last one, lets calculate the padding right
			if(i==(nmb_images-1)){
				padding_r = center - (div_width/2);
				one_divs_w= div_width;
			}	
		}).end().css({
			'width'				: w_width + 'px',
			'padding-left' 		: padding_l + 'px',
			'padding-right' 	: padding_r + 'px'
		});
		
		//scroll all left;
		$fp_thumbScroller.scrollLeft(w_width);
		
		//innitialize the slider
		$slider.slider('destroy').slider({
			orientation	: 'horizontal',
			max			: w_width -one_divs_w,//total width minus one content div width
			min			: 0,
			value		: 0,
			slide		: function(event, ui) {
				$fp_thumbScroller.scrollLeft(ui.value);
			},
			stop: function(event, ui) {
				//when we stop sliding 
				//we may want that the closest picture to the center 
				//of the window stays centered. Uncomment the following line
				//if you want that behaviour
				checkClosest();
			}
		});
		//open the gallery and show the slider
		$fp_thumbContainer.animate({'height':'240px'},200,function(){
			$(this).data('opened',true);
			$fp_scrollWrapper.fadeIn();
			$fp_scrollTip.fadeIn();
		});
		
		//scroll all right;
		$fp_thumbScroller.stop()
						 .animate({'scrollLeft':'0px'},2000,'easeInOutExpo');

		//User clicks on a content div (image)
		$fp_content_wrapper.find('.content')
						 .bind('click',function(e){
			var $current 	= $(this);
			//track the current one
			current			= $current.index();
			//center and show this image
			//the second parameter set to true means we want to 
			//display the picture after the image is centered on the screen
			centerImage($current,true,600);
			e.preventDefault();
		});					
	}
	function openGalleryContainer($gallery,style){
		//current gets reseted
		current				= 0;				  
		//wrapper of each content div, where each image is
		var $fp_content_wrapper = $fp_thumbContainer.find('.container:nth-child('+parseInt(gallery_idx+1)+')');
		//hide all the other galleries thumbs wrappers
		$fp_thumbContainer.find('.container').not($fp_content_wrapper).hide();
		//and show this one
		$fp_content_wrapper.show();
		//windows width, height and scroll
		var $window = $(window);
		var windowH = $window.height();
		var MarginB = 50; // margin to bottom of the window
		var fp_thumbScrollerT = $fp_thumbScroller.offset().top;
		//open the gallery and show the slider
		$fp_thumbContainer.animate({
			'height': windowH - fp_thumbScrollerT - MarginB + 'px'
		},200,function(){
			$(this).data('opened',true);
			$fp_scrollWrapper.fadeOut();  //show the slider
		});
	  	if(style == "non_images_Service"){
	  		ResetCss_Service(windowH - fp_thumbScrollerT - MarginB);
	  	}else if(style == "non_images_About"){
	  		ResetCss_About();
	  	}else if(style == "non_images_Contact"){
	  		ResetCss_Contact(windowH - fp_thumbScrollerT - MarginB);
	  	}			
	}					
	//while the gallery scrolls we want that the slider scrolls as well
	$fp_thumbScroller.scroll(function(){
		$slider.slider('value',parseInt($fp_thumbScroller.scrollLeft(),10));
	});
	
	//User clicks next button (preview mode)
	$fp_next.bind('click',function(){
		if(photo_nav){
			photo_nav = false;
		navigate(1);
		}	
	});
	
	//User clicks previous button (preview mode)
	$fp_prev.bind('click',function(){
		if(photo_nav){
			photo_nav = false;
		navigate(0);
		}	
	});
	
	//User clicks next button (thumbs)
	$('#fp_next_thumb').click(function(){
		slideThumb(1);
	});
	
	//User clicks previous button (thumbs)
	$('#fp_prev_thumb').click(function(){
		slideThumb(0);
	});
	
	//User clicks close button
	$fp_close.bind('click',function(){
		if(!photo_nav) return;
		//windows scroll if any
		var windowS 		= $(window).scrollTop();
		//the large image being viewed
		var $large_img		= $('#fp_preview');
		//the current thumb
		var $current 		= $fp_thumbScroller.find('.container:nth-child('+parseInt(gallery_idx+1)+')')
											   .find('.content:nth-child('+parseInt(current+1)+')');
		//offset values of current thumb
		var current_offset	= $current.offset();
		//the large image will animate in the direction of the center
		//after that it is removed from the DOM
		$large_img.stop().animate({
			'top'			: current_offset.top + windowS + 'px',
			'left'			: $(window).width()/2 - $current.width()/2 + 'px',
			'width'			: $current.width() + 'px',
			'height'		: $current.height() + 'px',
			'opacity'		: 0
		},800,function(){
			$fp_close.hide();//hide fp_close first
			$(this).remove();
			//hide the overlay, and the next, previous and close buttons
			hidePreviewFunctions();
		});					
	});
	
	//User clicks close button
	$fp_overlay.bind('click',function(){
		if(!photo_nav) return;
		//windows scroll if any
		var windowS 		= $(window).scrollTop();
		//the large image being viewed
		var $large_img		= $('#fp_preview');
		//the current thumb
		var $current 		= $fp_thumbScroller.find('.container:nth-child('+parseInt(gallery_idx+1)+')')
											   .find('.content:nth-child('+parseInt(current+1)+')');
		//offset values of current thumb
		var current_offset	= $current.offset();
		//the large image will animate in the direction of the center
		//after that it is removed from the DOM
		$large_img.stop().animate({
			'top'			: current_offset.top + windowS + 'px',
			'left'			: $(window).width()/2 - $current.width()/2 + 'px',
			'width'			: $current.width() + 'px',
			'height'		: $current.height() + 'px',
			'opacity'		: 0
		},800,function(){
			$fp_close.hide();//hide fp_close first
			$(this).remove();
			//hide the overlay, and the next, previous and close buttons
			hidePreviewFunctions();
		});					
	});				
	//rewrite the service s/ contact_us css
	function ResetCss_Service(fp_thumbContainerH){
		//windows width, height and scroll
		var $window = $(window);
		var windowW = $window.width();
		var windowH = $window.height();
		var MarginW = 150;
		var MarginH = 10;
		var ratio 	= 0.33;
		var rows	= 3;
		var columns  = 2;
		// reset css for <ul class="service">
		$service.css({
			'width'	: (windowW - 2 * MarginW) + 'px',
			'height': fp_thumbContainerH + 'px',
			'margin-left': MarginW  + 'px',
			'margin-right': MarginW + 'px'
		});
		// reset css for <li>
		var serviceW = $service.width();
		var serviceH = $service.height();
		$service.find("li").css({
			'width': Math.floor((serviceW - columns * 2 * MarginH / 2) / columns) + 'px',
			'height': Math.floor((serviceH - rows * 2 * MarginH) / rows) + 'px',
			'padding-left': Math.floor(MarginH / 2) + 'px',
			'padding-right': Math.floor(MarginH / 2) + 'px',
			'padding-top': Math.floor(MarginH) + 'px',	
			'padding-bottom': Math.floor(MarginH) + 'px'						
		});
		// reset css for <img>
		var liW = Math.floor((serviceW - columns * 2 * MarginH / 2) / columns);
		var liH = Math.floor((serviceH - rows * 2 * MarginH) / rows);
		var imgH = 80;
		var imgW = 80;
		$service.find("img").css({
			'margin-top': Math.floor((liH - imgH) / 2) + 'px',	
			'margin-bottom': Math.floor((liH - imgH) / 2) + 'px'						
		});	
		var imgT = 	(liH - imgH) / 2;			
		// reset css for <span> & <a>
		$service.find("span").css({
			'width': Math.floor(liW - imgW) + 'px',
			'padding-top': Math.floor(imgT) + 'px',	
			'padding-bottom': Math.floor(MarginH) + 'px'						
		});

		$service.find("a").css({
			'width': Math.floor(liW - imgW - 2 * MarginH) + 'px',
			'padding-left': MarginH + 'px',
			'padding-right': MarginH + 'px',	
			'padding-bottom': Math.floor(MarginH) + 'px'						
		});																				
	}
	function ResetCss_About(){
		
	}					
	function ResetCss_Contact(fp_thumbContainerH){
		//windows width, height and scroll
		var $window = $(window);
		var windowW = $window.width();
		var windowH = $window.height();
		var MarginW = 150;
		var MarginH = 10;
		var ratio 	= 0.4;	
		var PaddingW = 5;
		var PaddingH = 34;
		// reset css for <ul class="service">
		$where_am_i.css({
			'width'	: (windowW - 2 * MarginW) + 'px',
			'height': fp_thumbContainerH + 'px',
			'margin-left': MarginW  + 'px',
			'margin-right': MarginW + 'px',
			'margin-top': '0px'
		});		
		var where_am_iW = $where_am_i.width();							
		$contact_us.css({
			'width'	: Math.floor(where_am_iW * ratio - 2 * PaddingW) + 'px',
			'height': fp_thumbContainerH - 2 * PaddingH + 'px',
			'padding-top': PaddingH + 'px',
			'padding-bottom': PaddingH + 'px',
			'padding-left': PaddingW + 'px',
			'padding-right': PaddingW + 'px'
		});
		$map.css({
			'width'	: Math.floor(where_am_iW * (1 - ratio) - 2 * PaddingW) + 'px',
			'height': fp_thumbContainerH - 2 * PaddingH + 'px',
			'margin-top': PaddingH + 'px',
			'margin-bottom': PaddingH + 'px',
			'margin-left': PaddingW + 'px',
			'margin-right': PaddingW + 'px'
		});
		showAddress("南钢大道181号好莱坞婚纱摄影","南昌");						
	}

	//centers an image and opens it if open is true
	function centerImage($obj,open,speed){
		//the offset left of the element
		var obj_left 			= $obj.offset().left;
		//the center of the element is its offset left plus 
		//half of its width
		var obj_center 			= obj_left + ($obj.width()/2);
		//the center of the window
		var center				= $(window).width()/2;
		//how much the scroller has scrolled already
		var currentScrollLeft 	= parseFloat($fp_thumbScroller.scrollLeft(),10);
		//so we know that in order to center the image,
		//we must scroll the center of the image minus the center of the screen,
		//and add whatever we have scrolled already
		var move 				= currentScrollLeft + (obj_center - center);
		if(move != $fp_thumbScroller.scrollLeft()) //try 'easeInOutExpo'
			$fp_thumbScroller.stop()
							 .animate({scrollLeft: move}, speed,function(){
				if(open)
					enlarge($obj);
			});
		else if(open)
			enlarge($obj);
	}
	
	//shows the large image
	//first we position the large image on top of the thumb
	//and then, we animate it to the maximum we can get 
	//based on the windows size
	function enlarge($obj){
		//the image element
		var $thumb = $obj.find('img');
		//show loading image
		$fp_loading.show();
		//preload large image
		$('<img id="fp_preview" />').load(function(){
			var $large_img 	= $(this);
			
			//confirm there's no other large one
			$('#fp_preview').remove();
			
			$large_img.addClass('fp_preview');
			//now let's position this image on the top of the thumb
			//we append this image to the fp_gallery div
			var obj_offset 	= $obj.offset();
			$large_img.css({
				'width'	: $thumb.width() + 'px',
				'height': $thumb.height() + 'px',
				'top'	: obj_offset.top + 'px',
				'left'	: obj_offset.left + 5 + 'px'//5 of margin
			}).appendTo($fp_gallery);
			//getFinalValues gives us the maximum possible width and height
			//for the large image based on the windows size.
			//those values are saved on the element using the jQuery.data()
			getFinalValues($large_img);
			var largeW 	= $large_img.data('width');
			var largeH 	= $large_img.data('height');
			//windows width, height and scroll
			var $window = $(window);
			var windowW = $window.width();
			var windowH = $window.height();
			var windowS = $window.scrollTop();
			//hide the image loading
			$fp_loading.hide();
			//show the overlay
			$fp_overlay.show();
			//now animate the large image
			$large_img.stop().animate({
				'top'		: windowH/2 -largeH/2 + windowS + 'px',
				'left'		: windowW/2 -largeW/2 + 'px',
				'width'		: largeW + 'px',
				'height'	: largeH + 'px',
				'opacity'	: 1
			},800,function(){
				//reset fp_close css style By braveching 20131012
				var largeT 	= $large_img.position().top;
				var largeL 	= $large_img.position().left;
				$fp_close.css({
					'width'	: '29px',
					'height': '29px',
					'top'	: largeT + 5 + 'px',//5 of border
					'right'	: windowW - largeW - largeL - 1 + 'px'//1 of margin
				});								
				//after the animation, 
				//show the next, previous and close buttons
				showPreviewFunctions($large_img);
			});
		}).attr('src',$thumb.attr('alt'));
	}
	
	//shows next or previous image
	//1 is right;0 is left
	function navigate(way){
		//show loading image
		$fp_loading.show();
		if(way==1){
			++current;
			var $current = $fp_thumbScroller.find('.container:nth-child('+parseInt(gallery_idx+1)+')')
											.find('.content:nth-child('+parseInt(current+1)+')');
			if($current.length == 0){
				--current;
				$fp_loading.hide();
				photo_nav = true;
				return;
			}
		}
		else{
			--current;
			var $current = $fp_thumbScroller.find('.container:nth-child('+parseInt(gallery_idx+1)+')')
											.find('.content:nth-child('+parseInt(current+1)+')');
			if($current.length == 0){
				++current;
				$fp_loading.hide();
				photo_nav = true;
				return;
			}
		}
			
		//load large image of next/previous content div
		$('<img id="fp_preview" />').load(function(){
			$fp_loading.hide();
			var $large_img 		= $(this);
			var $fp_preview 	= $('#fp_preview');
			
			//make the current one slide left if clicking next
			//make the current one slide right if clicking previous
			var animate_to 		= -$fp_preview.width();
			var animate_from	= $(window).width();
			if(way==0){
				animate_to 		= $(window).width();
				animate_from	= -$fp_preview.width();
			}
			
			//now we want that the thumb (of the last image viewed) 
			//stays centered on the screen
			centerImage($current,false,1000);
			
			$fp_preview.stop().animate({'left':animate_to+'px'},200,function(){
				$(this).remove();
				$large_img.addClass('fp_preview');
				getFinalValues($large_img);
				var largeW 	= $large_img.data('width');
				var largeH 	= $large_img.data('height');
				var $window	= $(window);
				var windowW = $window.width();
				var windowH = $window.height();
				var windowS = $window.scrollTop();
				$large_img.css({
					'width'	: largeW+'px',
					'height': largeH+'px',
					'top'	: windowH/2 -largeH/2 + windowS + 'px',
					'left'		: animate_from + 'px',
					'opacity' 	: 1	
				}).appendTo($fp_gallery)
				  .stop()
				  .animate({'left':windowW/2 -largeW/2+'px'},200,function(){
				  	photo_nav = true;
					//reset fp_close css style By braveching 20131012
					var largeT 	= $large_img.position().top;
					var largeL 	= $large_img.position().left;
					$fp_close.css({
						'width'	: '29px',
						'height': '29px',
						'top'	: largeT + 5 + 'px',//5 of border
						'right'	: windowW - largeW - largeL - 1 + 'px'//1 of margin
					});
				  });
			});
			// add hover function to hide fp_close
            $large_img.hover(function(){
                $fp_close.show();
            },function(){
                $fp_close.hide();
            });
            $fp_close.hover(function(){
                $fp_close.show();
            },function(){
                $fp_close.hide();
            });	
		}).attr('src',$current.find('img').attr('alt'));	
	}
	
	//show the next, previous and close buttons
	function showPreviewFunctions($large_img){
		var largeW 	= $large_img.data('width');
		var $window	= $(window);
		var windowW = $window.width();

		$fp_next.stop().animate({
			'right': (windowW - largeW)/2 - 90 + 'px'
		},100);
		$fp_prev.stop().animate({
			'left': (windowW - largeW)/2 - 90 + 'px'
		},100);
		//$fp_close.show();
		// add hover function to hide fp_close
        $large_img.hover(function(){
            $fp_close.show();
        },function(){
            $fp_close.hide();
        });
        $fp_close.hover(function(){
            $fp_close.show();
        },function(){
            $fp_close.hide();
        });					
	}
	
	//hide the overlay, and the next, previous and close buttons
	function hidePreviewFunctions(){
		$fp_next.stop().animate({'right':'-50px'},100);
		$fp_prev.stop().animate({'left':'-50px'},100);
		$fp_overlay.hide();
	}
	
	function getFinalValues($image){
		var widthMargin		= 0
		var heightMargin 	= 20;
		var $window			= $(window);
		var windowH      	= $window.height()-heightMargin;
		var windowW      	= $window.width()-widthMargin;
		var theImage     = new Image();
		theImage.src     = $image.attr("src");
		var imgwidth     = theImage.width;
		var imgheight    = theImage.height;

		if((imgwidth > windowW)||(imgheight > windowH)){
			if(imgwidth > imgheight){
				var newwidth = windowW;
				var ratio = imgwidth / windowW;
				var newheight = imgheight / ratio;
				theImage.height = newheight;
				theImage.width= newwidth;
				if(newheight>windowH){
					var newnewheight = windowH;
					var newratio = newheight/windowH;
					var newnewwidth =newwidth/newratio;
					theImage.width = newnewwidth;
					theImage.height= newnewheight;
				}
			}
			else{
				var newheight = windowH;
				var ratio = imgheight / windowH;
				var newwidth = imgwidth / ratio;
				theImage.height = newheight;
				theImage.width= newwidth;
				if(newwidth>windowW){
					var newnewwidth = windowW;
					var newratio = newwidth/windowW;
					var newnewheight =newheight/newratio;
					theImage.height = newnewheight;
					theImage.width= newnewwidth;
				}
			}
		}
		$image.data('width',theImage.width);
		$image.data('height',theImage.height);
	}
	
	//slides the scroller one picture 
	//to the right or left
	function slideThumb(way){
		if(way==1){
			++current;
			var $next = $fp_thumbScroller.find('.container:nth-child('+parseInt(gallery_idx+1)+')')
										 .find('.content:nth-child('+parseInt(current+1)+')');
			if($next.length > 0)
				centerImage($next,false,600);
			else{
				--current;
				return;
			}	
		}
		else{
			--current;
			var $prev = $fp_thumbScroller.find('.container:nth-child('+parseInt(gallery_idx+1)+')')
										 .find('.content:nth-child('+parseInt(current+1)+')');
			if($prev.length > 0)
				centerImage($prev,false,600);
			else{
				++current;
				return;
			}	
		}					
	}
	
	//when we stop sliding 
	//we may want that the closest picture to the center 
	//of the window stays centered
	function checkClosest(){
		var center 				= $(window).width()/2;
		var current_distance 	= 99999999;
		var idx					= 0;	
		$container				= $fp_thumbScroller.find('.container:nth-child('+parseInt(gallery_idx+1)+')');
		$container.find('.content').each(function(i){
			var $obj 		= $(this);
			//the offset left of the element
			var obj_left 	= $obj.offset().left;
			//the center of the element is its offset left plus 
			//half of its width
			var obj_center 	= obj_left + ($obj.width()/2);
			var distance	= Math.abs(center-obj_center);
			if(distance < current_distance){
				current_distance 	= distance;
				idx					= i;
			}	
		});
		var $new_current 	= $container.find('.content:nth-child('+parseInt(idx+1)+')');
		current 			= $new_current.index();
		centerImage($new_current,false,200);
	}
	function checkWebOs(){
		//get web OS
		var $browserTip = $('#browserTip');
		$browserTip.find('span').text("");//clear text 
		//windows width, height and scroll
		var $window = $(window);
		var windowW = $window.width();
		var windowH = $window.height();	
		var TipW	= $browserTip.width();	    		
        var Sys = {};
        var ua = navigator.userAgent.toLowerCase();
        var s;
        (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
        (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
        (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
        (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
        (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;
        //以下进行测试
        $browserTip.css({
        	'width': windowW + 'px'
        });
        
        if (Sys.ie){
        	$browserTip.append('您现在正在使用的是搜狗/360等IE内核浏览器，为了获得更好的用户体验，请切换至高速模式或更换为Firefox/Chrome/Safari浏览器');
        	$browserTip.show();
        	$fp_overlay.show();
			//User clicks close button
			$browserTip.find('i').bind('click',function(){
				$browserTip.hide();
				$fp_overlay.hide();				
			});		            	
    	}
        if (Sys.firefox) $browserTip.find('span').append('Firefox: ' + Sys.firefox);
        if (Sys.chrome){
        	$browserTip.find('span').append('Chrome: ' + Sys.chrome );
        	//$browserTip.show();
			//User clicks close button
			$browserTip.find('i').bind('click',function(){
				$browserTip.hide();				
			});			            	
        } 
        if (Sys.opera) $browserTip.find('span').append('Opera: ' + Sys.opera);
        if (Sys.safari) $browserTip.find('span').append('Safari: ' + Sys.safari);					
	}				
});