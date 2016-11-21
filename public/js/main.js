var metro = {
	totalItems 			: 0,
	currentItemToLoad 	: 1,
	timeToShow 			: 300,
	openedPage 			: false,
	hashChange 			: false,

	init: function(){
		 $layout = $('.metro-layout');
		 metro.totalItems = $('.box').length;
	},

	viewContent: function(animation, new_page)
	{
		if( $.browser.device != false )
		{
			$('#page-'+metro.openedPage).hide()
			$('#page-'+new_page).show();

			//Change title
			$('.items .box').each(function(){
				if( $(this).attr('data-src') == new_page )
				{
					$('.header h1').html( $(this).attr('data-name') );
					document.title = $(this).attr('data-name');

					if( typeof $(this).attr('data-title') != "undefined" )
					{
						document.title = $(this).attr('data-title');
					}


					if( new_page == 'home' )
					{
						$('.header h span1').remove();
						$('.header small').show();
					}
					else
					{
						$('.header h1').prepend('<span class="back"></span>');
						$('.header small').hide();
						$('.header h1 span').unbind('click');
						$('.header h1 span').bind('click', function(){
							$('.box').each(function(){
								if( $(this).attr('data-src') == 'home' )
								{
									$(this).trigger('click');
								}
							});
						});
					}
				}
			});


			metro.openedPage = new_page;

			metro.openedPage = new_page;
			return;
		}
		$('.page-content').animate({left:200, opacity:"hide"}, 300, function() {

			$('#page-'+metro.openedPage).hide()
			$('.page-content').css('left', '-200px');
			$('#page-'+new_page).show();


			//Change title
			$('.items .box').each(function(){
				if( $(this).attr('data-src') == new_page )
				{
					$('.header h1').html( $(this).attr('data-name') );
					document.title = $(this).attr('data-name');
					if( typeof $(this).attr('data-title') != "undefined" )
					{
						document.title = $(this).attr('data-title');
					}

					if( new_page == 'home' )
					{
						$('.header h span1').remove();
						$('.header small').show();
					}
					else
					{
						$('.header h1').prepend('<span class="back"></span>');
						$('.header small').hide();
						$('.header h1 span').unbind('click');
						$('.header h1 span').bind('click', function(){
							$('.box').each(function(){
								if( $(this).attr('data-src') == 'home' )
								{
									$(this).trigger('click');
								}
							});
						});
					}
				}
			});


			metro.openedPage = new_page;

			$('.page-content').animate({left:0, opacity:"show"}, 300, function() {

		    });
	    })

	},

	showElements: function()
	{
		//Show element
		if( metro.currentItemToLoad > metro.totalItems ) return;
		$('.box:nth-child('+metro.currentItemToLoad+')').removeClass('unloaded');

		//Add click event
		$('.box:nth-child('+metro.currentItemToLoad+')').bind('click', function(){
			metro.openBox(this, true);
		})

		//Go to next element
		metro.currentItemToLoad++;
		setTimeout('metro.showElements()', metro.timeToShow);
	},

	openBox: function(_this, animation)
	{
		if( metro.openedPage == $(_this).attr('data-src') ) return;

		//Check if this is link box
		if( $(_this).attr('data-src-type') == 'url' )
		{
			window.open($(_this).attr('data-src'), '_blank');
			return;
		}

		metro.viewContent(animation, $(_this).attr('data-src'));

		window.location.hash 	= '#' + $(_this).attr('data-src');
		metro.hashChange 		= true;

		//Set page background color
		var bgColor = $(_this).css('backgroundColor').replace( ')' , '').replace('rgb(', '' );
		bgColor = ($.browser.device != false ) ? 'rgba( '+bgColor+', 0.7)' : 'rgba( '+bgColor+', 0.4)';
		$('.metro-layout').css('background-color', bgColor );
	},

	initPortfolio: function(){

		//Set box background color
		$('.box').each(function(){
			if( $(this).attr('data-src') == 'portfolio' )
			{
				var bgColor = $(this).css('backgroundColor').replace( ')' , '').replace('rgb(', '' );
				bgColor = 'rgba( '+bgColor+', 1)';
				$('ul.portfolio li').each(function(){
					$( '.mask', $(this)).css('background-color', bgColor );
				});
			}
		});

		//Bind click event to show lightbox
		$('ul.portfolio li .view').bind('click', function(){
			metro.openLightbox( jQuery.parseJSON($( 'div[data-type="data"]', $(this).parent()).html()) );
		});

	},


	initContactForm: function(){
		$('#contact-submit').bind('click', function(){
			var validForm 		= true;
			var formElements 	= {};

			$('form.contact input[type="text"], form.contact input[type="email"], form.contact textarea').each(function(){
				var $this = $(this);

				if( $this.val() == '' )
				{
					$this.addClass('incorrect');
					validForm = false;
				}
				else
				{
					$this.removeClass('incorrect');
					formElements[$this.attr('name')] = $this.val();
				}

				$this.unbind('blur');
				$this.bind('blur', function(){
					if( $(this).val() != '' ) $(this).removeClass('incorrect');
				});
			});


			if( validForm == true )
			{
				$('form.contact span.action').append('<span>sending...</span>');
				$('form.contact span.action input').hide();
				$.ajax({
					type:		'POST',
					url: 		site_url + '?send_email',
					data:		formElements,
					beforeSend: function(x){ if(x && x.overrideMimeType) x.overrideMimeType( 'application/j-son;charset=UTF-8' ); },
					dataType: 	'json',
					success: function( data )
					{
						$('form.contact input[type="text"], form.contact input[type="email"], form.contact textarea').each(function(){
							$(this).val( '' );
						});

						$('form.contact span.action > span').remove();
						$('form.contact span.action input').show();

						$('form.contact').prepend('<span class="contact-message">Email was sent successfully</span>');
						setTimeout(function(){
							$('form.contact .contact-message').fadeOut();
						}, 2000)
					}
				});
			}
		});
	},


	initNews: function()
	{
		//Set box background color
		$('.box').each(function(){
			if( $(this).attr('data-src') == 'news' )
			{
				var bgColor = $(this).css('backgroundColor').replace( ')' , '').replace('rgb(', '' );
				bgColor = 'rgba( '+bgColor+', 1)';
				$('ul.news li').each(function(){
					$( '.mask', $(this)).css('background-color', bgColor );
				});
			}
		});

		//Bind click event to show lightbox
		$('ul.news li .view, ul.news li a').bind('click', function(){
			var element = $(this);

			if( $(this).get(0).tagName == 'DIV' )
			{
				element = $(this).parent();
			}
			else
			{
				element = $(this).parent().parent();
			}

			metro.openLightbox( jQuery.parseJSON($( 'div[data-type="data"]', element).html()) );
		});
	},

	openLightbox: function( data )
	{
		$('body').append('<div class="overlay"></div>');

		var _images = '';
		for( var i = 0; i < data.img.length; i++ )
		{
			_images += '<img src="'+data.img[i]+'" />';
		}
		
		var projectLink = "";

		if(data.link_label != undefined) {
			projectLink = '<p class="post-link">View project: <a href="'+data.project_link+'">'+data.link_label+'</a></p>';
		}

		var lightbox = '<div class="lightbox" style="visibility: hidden;"> \
							<div class="img-content">\
								<div class="img-container">\
									<div class="img-scroller" data-counter="1">'+_images+'</div>\
									<a href="javascript:void(0);" class="prev" style="display: inline;"></a>\
									<a href="javascript:void(0);" class="next" style="display: inline;"></a>\
								</div>\
							</div>\
							<div class="text-content">\
								<h4>'+data.title+'<span>'+data.date+'</span></h4>\
								<p>'+htmlspecialchars_decode(data.message, 'ENT_QUOTES')+'</p>'
								lightbox += projectLink;
							lightbox += '</div>\
							<span class="close"></span>\
						</div>';

		$('body').append(lightbox);

		var first_image = new Image();
		first_image.onload = function()
		{
			var lightbox_additional_width 	= parseInt($('div.lightbox').css('padding-left')) + parseInt($('div.lightbox').css('padding-right'));
			var lightbox_additional_height 	= parseInt($('div.lightbox').css('padding-top')) + parseInt($('div.lightbox').css('padding-bottom')) + parseInt($('div.lightbox span.close').outerHeight());

			var img_size = {
				'width' 	: first_image.width,
				'height' 	: first_image.height,
				'ratio' 	: first_image.width / first_image.height
			};

			var maxSize = {
				'width' 	: img_size.width + lightbox_additional_width,
				'height' 	: img_size.height + $('div.lightbox .text-content').outerHeight() + lightbox_additional_height,
			};
			maxSize.ratio = maxSize.width / maxSize.height;

			//Set lightbox max size
			$('div.lightbox').css( 'width', maxSize.width + 'px' );

			var center_lightbox = true;
			//Scale lightbox
			//Max width, max height
			if( $(window).width() >= maxSize.width && $(window).height() >= maxSize.height )
			{
				//Set img_slider size
				$('div.lightbox .img-content').css( 'height', img_size.height + 'px' );
			}
			//Max width, no height
			else if( $(window).width() >= maxSize.width && $(window).height() < maxSize.height )
			{
				//Set lightbox size
				var new_l_height 	= $(window).height() - (2*(5 * $(window).height() / 100));
				var new_l_width 	= new_l_height * maxSize.ratio;
				$('div.lightbox').css( 'width', new_l_width + 'px' ).css( 'height', new_l_height + 'px' );

				//Set img_slider size
				var img_container_max_height = new_l_height - $('div.lightbox .text-content').outerHeight() - lightbox_additional_height;
				$('div.lightbox .img-content').css( 'height', img_container_max_height + 'px' ).css( 'width', (img_container_max_height * img_size.ratio ) + 'px' ).css( 'margin-left', ((new_l_width - (img_container_max_height * img_size.ratio ) ) / 2 ) + 'px' );
			}
			//no width, max height
			else if( $(window).width() < maxSize.width && $(window).height() >= maxSize.height )
			{
				//Set lightbox size
				var new_l_width 	= $(window).width() - (2*(5 * $(window).width() / 100));
				$('div.lightbox').css( 'width', new_l_width + 'px' );
			}
			//No width, no height
			else if( $(window).width() < maxSize.width && $(window).height() < maxSize.height )
			{
				var new_l_width = $(window).width();
				$('div.lightbox').css( 'width', '100%' );

				//Set img_slider size
				var img_slider_width = (new_l_width - lightbox_additional_width);
				$('div.lightbox .img-content').css( 'width', img_slider_width + 'px' ).css( 'height', img_slider_width / img_size.ratio );

				$('.metro-layout').hide();

				center_lightbox = false;
			}

			if( center_lightbox == true )
			{
				$('div.lightbox').css( 'left', (($(window).width() - $('div.lightbox').width()) / 2 ) + 'px' ).css( 'top', (($(window).height() - $('div.lightbox').height()) / 2 ) + 'px' );
			}

			$('div.lightbox .close').bind('click', function(){

				if( $('.metro-layout').css('display') == 'none' ) $('.metro-layout').show();

				$('div.lightbox').remove();
				$('div.overlay').remove();
			});

			$('div.lightbox').hide().css('visibility', 'visible');
			$('div.lightbox').animate({opacity:"show"}, 500);

			var $this = $('div.lightbox');

			//set img slider height
			var total_images = $('div.img-scroller img', $this).length;

			$('.img-scroller', $this).css('height', (100 * total_images) + '%');
			$('div.img-scroller img', $this).each(function()
			{
				 $(this).css('height', (100/total_images) + '%');
			});

			var counter =  parseInt($('.img-scroller', $this).attr('data-counter'));
			$('a.prev', $this).css('display', 'none');
			if( counter < total_images ) $('a.next', $this).css('display', 'block');
			if( total_images == 1 )
			{
				$('a.next', $this).css('display', 'none');
			}


			$('a.next', $this).bind('click', function(){
				var counter =  parseInt($('.img-scroller', $this).attr('data-counter'));

				//Move if needed
				if( counter < total_images ) $('.img-scroller', $this).css('top', -(counter * 100) + '%');

				//Set new value
				$('.img-scroller', $this).attr('data-counter', counter + 1);

				//Disable if needed
				if( counter + 1 == total_images ) $('a.next', $this).css('display', 'none');

				//Enable prev
				if( counter >= 1 )
				{
					$('a.prev', $this).css('display', 'inline');
				}
			});


			$('a.prev', $this).bind('click', function(){
				var counter =  parseInt($('.img-scroller', $this).attr('data-counter'));

				//Move if needed
				if( counter > 0 ) $('.img-scroller', $this).css('top', -((counter-2) * 100) + '%');

				//Set new value
				$('.img-scroller', $this).attr('data-counter', counter - 1);

				//Disable if needed
				if( counter - 1 == 1 ) $('a.prev', $this).css('display', 'none');

				//Enable next
				if( counter - 1 < total_images )
				{
					$('a.next', $this).css('display', 'inline');
				}
			});
	    }
		first_image.src = data.img[0];

	}
};

$(document).ready(function()
{
	$.browser.device = (/android|webos|iphone|ipod|ipad|blackberry/i.test(navigator.userAgent.toLowerCase()));

	if( $.browser.device != false )
	{
		$('div.header').addClass('mobile');

		var style = $('<style>.lightbox .img-content .img-container .next, lightbox .img-content .img-container .prev{ opacity: 1 }</style>');
		$('html > head').append(style);

		var style = $('<style>.view-image:hover .mask{ opacity: 0 }</style>');
		$('html > head').append(style);

		var style = $('<style>div.player-controls{ display: none }</style>');
		$('html > head').append(style);

		var style = $('<style>.metro-layout .box:hover{ transform: none; opacity: 1 }</style>');
		$('html > head').append(style);
	}

	metro.init();

	var hash = window.location.hash.replace('#', '');
	if( hash == '' || $('#page-'+hash).length != 1 ) hash = 'home';
	$('.box').each(function(){
		if( $(this).attr('data-src') == hash )
		{
			metro.openBox($(this), false);
		}

		//add color to about meter
		if( $(this).attr('data-src') == 'about' )
		{
			var style = $('<style>.meter > span { background-color: '+$(this).css('backgroundColor')+'; }</style>');
			$('html > head').append(style);
		}
	});

	metro.initPortfolio();
	metro.initNews();
	metro.initContactForm();

	setTimeout('metro.showElements()', metro.timeToShow);

	if( $.browser.device == true )
	{
		return;
	}



	//Load PLayer
	var tag = document.createElement('script');
	tag.src = "https://www.youtube.com/player_api";
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

	//Set control binds
	$('.player-controls div.play-pause').bind('click', function(){

		//Pause video
		if( $(this).hasClass('pause') )
		{
			$(this).removeClass('pause').addClass('play');
			player.pauseVideo();
		}
		else if( $(this).hasClass('play') )
		{
			$(this).addClass('pause').removeClass('play');
			player.playVideo();
		}
	});


	$('.player-controls div.minus').bind('click', function(){
		var volume = player.getVolume();

		if( volume > 0 )
		{
			player.setVolume( volume - 10 );
		}
	});


	$('.player-controls div.plus').bind('click', function(){
		var volume = player.getVolume();

		if( volume < 100 )
		{
			player.setVolume( volume + 10 );
		}
	});
});


//Catch when click outside of ilightbox
$(document).click(function (e)
{
    var container = $("div.lightbox");

    if ( container.length == 1 && container.has(e.target).length === 0)
    {
        $('.close', container).trigger('click');
    }
});

$(window).on('hashchange', function() {
	if( metro.hashChange == false )
	{
		var hash = window.location.hash.replace('#', '');
		$('.box').each(function(){
			if( $(this).attr('data-src') == hash )
			{
				metro.openBox($(this), false);
			}
		});
	}
	metro.hashChange = false;
});


var player;

//Player
function onYouTubePlayerAPIReady() {

	  player = new YT.Player('ytplayer', {
		height: '100%',
		width: '100%',
		playerVars: {controls: 0, rel:0, showinfo: 0, html5 : 1},
		events: {
		  'onReady': onYouTubeHTML5PlayerReady
		}
	  });
}


function onYouTubeHTML5PlayerReady(event) {

		if (event)
		{
			player.loadVideoById(videoID, 0, 'large');
			player.setVolume(70);

			setInterval(updateytplayerInfo, 600);
			updateytplayerInfo();

		}

	}


function updateytplayerInfo()
{
	    if( getPlayerState() == 'ended' )
	    {
	    	player.playVideo();
	    }
	    else if( getPlayerState() == 'playing' )
	    {
	    	//console.log('pla');
	    }
}


function getPlayerState() {
	  if (player) {
	    var playerState = player.getPlayerState();
	    switch (playerState) {
	      case 5:
	        return 'video cued';
	      case 3:
	        return 'buffering';
	      case 2:
	        return 'paused';
	      case 1:
	        return 'playing';
	      case 0:
	        return 'ended';
	      case -1:
	        return 'unstarted';
	      default:
	        return 'Status uncertain';
	    }
	  }
	}


function htmlspecialchars_decode (string, quote_style) {
	  // http://kevin.vanzonneveld.net
	  // +   original by: Mirek Slugen
	  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	  // +   bugfixed by: Mateusz "loonquawl" Zalega
	  // +      input by: ReverseSyntax
	  // +      input by: Slawomir Kaniecki
	  // +      input by: Scott Cariss
	  // +      input by: Francois
	  // +   bugfixed by: Onno Marsman
	  // +    revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	  // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
	  // +      input by: Ratheous
	  // +      input by: Mailfaker (http://www.weedem.fr/)
	  // +      reimplemented by: Brett Zamir (http://brett-zamir.me)
	  // +    bugfixed by: Brett Zamir (http://brett-zamir.me)
	  // *     example 1: htmlspecialchars_decode("<p>this -&gt; &quot;</p>", 'ENT_NOQUOTES');
	  // *     returns 1: '<p>this -> &quot;</p>'
	  // *     example 2: htmlspecialchars_decode("&amp;quot;");
	  // *     returns 2: '&quot;'
	  var optTemp = 0,
	    i = 0,
	    noquotes = false;
	  if (typeof quote_style === 'undefined') {
	    quote_style = 2;
	  }
	  string = string.toString().replace(/&lt;/g, '<').replace(/&gt;/g, '>');
	  var OPTS = {
	    'ENT_NOQUOTES': 0,
	    'ENT_HTML_QUOTE_SINGLE': 1,
	    'ENT_HTML_QUOTE_DOUBLE': 2,
	    'ENT_COMPAT': 2,
	    'ENT_QUOTES': 3,
	    'ENT_IGNORE': 4
	  };
	  if (quote_style === 0) {
	    noquotes = true;
	  }
	  if (typeof quote_style !== 'number') { // Allow for a single string or an array of string flags
	    quote_style = [].concat(quote_style);
	    for (i = 0; i < quote_style.length; i++) {
	      // Resolve string input to bitwise e.g. 'PATHINFO_EXTENSION' becomes 4
	      if (OPTS[quote_style[i]] === 0) {
	        noquotes = true;
	      } else if (OPTS[quote_style[i]]) {
	        optTemp = optTemp | OPTS[quote_style[i]];
	      }
	    }
	    quote_style = optTemp;
	  }
	  if (quote_style & OPTS.ENT_HTML_QUOTE_SINGLE) {
	    string = string.replace(/&#0*39;/g, "'"); // PHP doesn't currently escape if more than one 0, but it should
	    // string = string.replace(/&apos;|&#x0*27;/g, "'"); // This would also be useful here, but not a part of PHP
	  }
	  if (!noquotes) {
	    string = string.replace(/&quot;/g, '"');
	  }
	  // Put this in last place to avoid escape being double-decoded
	  string = string.replace(/&amp;/g, '&');

	  return string;
	}
	$( document ).ready(function() {

    scaleVideoContainer();

    initBannerVideoSize('.video-container .poster img');
    initBannerVideoSize('.video-container .filter');
    initBannerVideoSize('.video-container video');

    $(window).on('resize', function() {
        scaleVideoContainer();
        scaleBannerVideoSize('.video-container .poster img');
        scaleBannerVideoSize('.video-container .filter');
        scaleBannerVideoSize('.video-container video');
    });

});

function scaleVideoContainer() {

    var height = $(window).height() + 5;
    var unitHeight = parseInt(height) + 'px';
    $('.homepage-hero-module').css('height',unitHeight);

}

function initBannerVideoSize(element){

    $(element).each(function(){
        $(this).data('height', $(this).height());
        $(this).data('width', $(this).width());
    });

    scaleBannerVideoSize(element);

}

function scaleBannerVideoSize(element){

    var windowWidth = $(window).width(),
    windowHeight = $(window).height() + 5,
    videoWidth,
    videoHeight;

    console.log(windowHeight);

    $(element).each(function(){
        var videoAspectRatio = $(this).data('height')/$(this).data('width');

        $(this).width(windowWidth);

        if(windowWidth < 1000){
            videoHeight = windowHeight;
            videoWidth = videoHeight / videoAspectRatio;
            $(this).css({'margin-top' : 0, 'margin-left' : -(videoWidth - windowWidth) / 2 + 'px'});

            $(this).width(videoWidth).height(videoHeight);
        }

        $('.homepage-hero-module .video-container video').addClass('fadeIn animated');

    });
}

