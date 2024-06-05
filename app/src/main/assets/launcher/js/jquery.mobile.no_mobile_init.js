( function( global, jQuery ) {
	
	if( !jQuery ) { return; }
	
	var MOBILE_INIT  = "mobileinit".toLowerCase(),
		jQueryMobile = jQuery["mobile"],
		_document;
	
	if( jQueryMobile ) {
		jQueryMobile.autoInitializePage = false;
	} else {
		_document = jQuery( global.document );
		_document.on( MOBILE_INIT, _mobileInit );
	}
	
	function _mobileInit() {
		_document.off( MOBILE_INIT, _mobileInit );
		_document = null;
		
		jQueryMobile.autoInitializePage = false;
	}
	
} )( this, this.jQuery );
