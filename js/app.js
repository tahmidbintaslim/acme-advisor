// renderQuote takes a DOM element (el) and a quote (text) 
// and returns a rendered jpeg image 

function renderQuote(el,text){

	var bg_colors = ["#f3e5f5","#e1bee7","#ce93d8","#ba68c8","#ab47bc","#9c27b0",
		"#8e24aa","#7b1fa2","#6a1b9a","#4a148c","#ea80fc","#e040fb","#d500f9","#aa00ff"];
	var random_index = Math.floor(Math.random()*(bg_colors.length-2));
	var color_body = bg_colors[random_index];
	var color_spinner = bg_colors[random_index+1];
	var width = Math.random() * 20 + 40;
	var alt_width = Math.random() * 20 + 40;
	var angle = Math.floor(Math.random() * 45);
	var images = ["custom","custom","custom","img1","img2","img3","img4","img5","img6","img7"];
	var select_image = Math.floor(Math.random()*images.length);
	var fonts = ["'Arvo', serif","'Lobster', cursive",
		"'Abril Fatface', cursive","'Cinzel', serif"];

	// display background image	
	if (images[select_image] == "custom"){
	// TODO: check why this won't render correctly	
	//	$(el).css("background-color", "repeating-linear-gradient(" + angle + "deg," + color_body + "," + color_body + " 50px, " + color_spinner + "50px, " + color_spinner + " " + alt_width + "px)");
		$(el).css("background-color", color_body);
		$(el).css("border", "#000000 2px solid");
	} else {
		$(el).css({"background-image": "url(./../acme-advisor/images/" + images[select_image] + ".jpg)"});
	}
		
	// display quote
	$("#quote").css("font-family",fonts[Math.floor(Math.random()*4)]);
	$(el).text(text);

	// render quote to a jpeg image
	$( el ).ready(function() { 
		
		html2canvas($(el), {
			allowTaint: true,
			letterRendering: true,
        	onrendered: function(canvas) {
        		var imageData = canvas.toDataURL('image/jpeg', 1.0);
	    		$("#quote").hide("");
	    		$("#result").show();
	    		$("#result").attr("src",imageData);
        	}
        });
     });
} 

// getQuote takes a dom element (el)
// and generates a quote for it
function getQuote(el){

	// API endpoint for getting a quote
	var request = "http://api.acme.international/fortune";
	// start the timer to track API response time
	var t0 = Date.now()/1000; 
	// variable to store the quote
	var string = "";
	// tracking number of failed API calls 
	var exit = 0; 
	// Some random quotes in case API call fails to return a quote
	var alternative_quotes = [ 
		"There are only two kinds of languages: the ones people complain about and the ones nobody uses. - Bjarne Stroustrup",
		"All Rhodes Scholars had a great future in their past. - Peter Thiel",
		"When something is important enough, you do it even if the odds are not in your favor. - Elon Musk",
		"Brilliant thinking is rare, but courage is in even shorter supply than genius - Peter Thiel",
		"Legacy code often differs from its suggested alternative by actually working and scaling - Bjarne Stroustrup",
		"Design is not just what it looks like and feels like. Design is how it works. - Steve Jobs"
	];

	// display spinner
	$("#result").hide();
	$("#quote").show();
	$(el).html('<div class="lds-css"><div style="width:100%;height:100%" class="lds-eclipse"><div></div></div></div>');
	$(".lds-eclipse div").css("box-shadow","0 4px 0 0 #7b1fa2");
	
	$.ajax({
		url: request,
		headers: {	        
			'Cache-Control': 'max-age=1000' 
		},
		success: function(data) {  // concatenate strings in the response

			string = data.fortune[0];

			if (data.fortune.length == 2) {
				string += "\n\n - " + data.fortune[1];
			}

			renderQuote(el, string);

        },
		error: function() { // returns this quote if server returns an error message
			var radom_index = Math.floor(Math.random()*alternative_quotes.length); // picks a random quote
			string = alternative_quotes[radom_index];
		 	renderQuote(el, string);	 	
		} 
	}); 

} // getQuote() ends here


$( document ).ready(function() {

	var el = $("#quote");
	getQuote(el);
	$("#more_truth").show();
	$("#more_truth").bind("click", function() {
		// empty content of DOM
		var el = $("#quote");
		getQuote(el);
	});

});