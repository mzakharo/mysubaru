( function( jQuery ) {
	
	jQuery.mobile.ajaxEnabled = false;
	
	initIndexPage();
	initNewsPage();
	
	function initIndexPage() {
		jQuery( function( $ ) {
			var slideList = $( "#slideList" ), bxSlider;
			
			if( slideList.length > 0 && slideList.bxSlider ) {
				bxSlider = slideList.fadeIn( 500 ).bxSlider( {
					onSlideAfter    :onSlideAfter,
					speed           :1000,
					easing          :"easeOutQuint",
					touchEnabled    :false,
					pager           :false,
					controls        :false,
					auto            :true,
					pause           :4000
				} );
			}
			
			function onSlideAfter( slideElement, oldIndex, newIndex ) { bxSlider.startAuto(); }
		} );
	}
	
	function initNewsPage() {
		jQuery( function( $ ) {
			var pageBody = $( 'html, body' ),
				newsPage = $( "#newsPage" ),
				newsHead = newsPage.find( '[data-role="header"]' );
			
			if( newsPage.length > 0 ) {
				newsPage.on( "expand", ".ui-collapsible", function( event ) {
					pageBody.stop( true ).animate( {
						scrollTop:Math.round( $( event.target ).offset().top ) - newsHead.outerHeight()
					}, {
						duration:500,
						easing  :"easeOutQuint"
					} );
				} );
			}
		} );
	}
	
} )( this.jQuery );
