var countryCode="";
var canJumpMySubaru = false;
var sutimer = null;

function mySubaruLoop(){
    if( countryCode=="" || countryCode=="null"  || countryCode=="nil" ) {
    	countryCode = getCountryCcodeFromQuery();
	}
    //if( countryCode=="" || countryCode=="null"  || countryCode=="nil" ) {
mwsRequestManager.initialize();
        var kurl= mwsRequestManager.getMWSRequestUrl("/kvs/geocode_iso_country_code/");
        $.ajax({
				type: "GET",
				url: kurl,
				async: true,
				timeout: 5000,
				success: function(data,status,xhr){
				    countryCode = xhr.responseText;
				    console.log(countryCode);
				    if( countryCode!="" && countryCode!="null"  && countryCode!="nil" ) {
					clearTimeout(sutimer);
					sutimer = null;
				        checkMySubaru();
						setTimeout("mySubaruLoop()",30000);
				    }
				    else{
					    setTimeout("mySubaruLoop()",2000);
				    }

				},
				error: function(xhr,status,err){
					setTimeout("mySubaruLoop()",2000);
				}
			});
    //}
    checkMySubaru();
}

function getCountryCcodeFromQuery(){
        var hash  = location.search.slice(1).split('&');
        var max = hash.length;
        for (var i = 0; i < max; i++) {
            var array = hash[i].split('=');
            if( array[0] == "countrycode" ) {
                return array[1];
            }
        }
        return "";
}

function checkMySubaru(){        
    if(countryCode == "US"){
        document.getElementById("mysubaruField").style.display ="block";
        var elements = document.getElementsByClassName("usOnlyFields");
		for(i=0;i<elements.length;i++){
    		elements[i].style.display ="block";
  		}
		canJumpMySubaru = true;
        return;
    }
    else if( countryCode=="" || countryCode=="null"  || countryCode=="nil" ) {
        var language = (window.navigator.userLanguage || window.navigator.language || window.navigator.browserLanguage).substr(0,2);
        if (language == 'en') {
			if(sutimer == null){
			sutimer = setTimeout(function(){
			    document.getElementById("mysubaruField").style.display ="block";
       			var elements = document.getElementsByClassName("usOnlyFields");
				for(i=0;i<elements.length;i++){
    				elements[i].style.display ="block";
  				}
			    canJumpMySubaru = true;
			},3000);
            }
            return;
        }
        else {
			
            document.getElementById("mysubaruField").style.display ="none";
        	var elements = document.getElementsByClassName("usOnlyFields");
			for(i=0;i<elements.length;i++){
    			elements[i].style.display ="none";
  			}
			canJumpMySubaru = false;
            return;
        }
    }
	else{

        document.getElementById("mysubaruField").style.display ="none";
        var elements = document.getElementsByClassName("usOnlyFields");
		for(i=0;i<elements.length;i++){
   			elements[i].style.display ="none";
 		}
		canJumpMySubaru = false;
        return;
    }  
}