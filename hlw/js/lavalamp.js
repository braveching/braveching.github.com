$(document).ready(function () {

    var dleft = $('.lavalamp li.active').offset().left - $('.lavalamp').offset().left; 
    var dwidth = $('.lavalamp li.active').width() + "px";
    
    var $window = $(window);
    var windowW = $window.width();
    var windowH = $window.height();
    var lavalampW = $('#lavalamp').width();
    //reset lavalamp css
    $('#lavalamp').css({
        "margin-left": Math.floor((windowW - lavalampW) / 2) + 'px'
    }); 

    $('.floatr').css({
        "left": dleft+"px",
        "width": dwidth
    });


    $('li').hover(function(){

       
        var left = $(this).offset().left - ($(this).parents('.lavalamp').offset().left + 15);
        var width = $(this).width() + "px";
        var sictranslate = "translate("+left+"px, 0px)";
		
        
        $(this).parent('ul').next('div.floatr').css({
            "width": width,
            "-webkit-transform": sictranslate,
            "-moz-transform": sictranslate
        });

    },

    function(){

        var left = $(this).siblings('li.active').offset().left - ($(this).parents('.lavalamp').offset().left + 15);
        var width = $(this).siblings('li.active').width() + "px";

        var sictranslate = "translate("+left+"px, 0px)";

        $(this).parent('ul').next('div.floatr').css({
            "width": width,
            "-webkit-transform": sictranslate,
            "-moz-transform": sictranslate
            
        });
        
    }).click(function(){
        
        $(this).siblings('li').removeClass('active');

        $(this).addClass('active');

        return false;
        
    });

});