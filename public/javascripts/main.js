var typeIndex = 0;
var typer = 0;

var typeDone = false;
var screenshotDone = false;
var screenshotIsVisible = false;


$(function(){
	checkBrowser();
});

function checkBrowser(){
	if (Modernizr.canvas && Modernizr.video && !jQuery.browser.mobile){
		doHTML5VideoInteractive()
	}else{
		doYoutubeVideo();
	}
}

function doHTML5VideoInteractive(){
	$("input#inpSearch").val("");

	setTimeout(function(){
		$("#googleSearch").show();
	},2000);

	// async screenshot ophalen
	$.getJSON(
		'/getgooglescreenshot',
		{name: name},
		function(data){
			if(data.err){
				console.log(data.err);
			}else{
				$("#googlescreenshot").attr('src', data.screenshot);
				screenshotDone = true;
				showScreenshot();
			}
		});


	$('#myVideo').seeThru({start : 'autoplay' , end : 'stop'});

	$('#myVideo')[0].addEventListener('ended',videoEnds,false);

	pollTime();
}


function pollTime(){
	var time = $('#myVideo')[0].currentTime;


	if(time > 4){
		//opacity ipv hide, anders schuift video op
		$('.klikhier').animate({
   			opacity: 0
   		});
	}


	if(time > 36){
		startTyping();
	}else{
		//check again:
		setTimeout(pollTime,1000);
	}
}

function videoEnds(){
	window.location = "https://www.google.be/search?q=" + escape(name);
}


function startTyping(){
	// start typing
	typer = setInterval(typeTick,300);
}

function typeTick(){
	$("#inpSearch").val($("#inpSearch").val()+name.charAt(typeIndex));
	typeIndex++;
	if(typeIndex >name.length){
		clearInterval(typer);
		typeDone = true;
		showScreenshot();
	}
}


function showScreenshot(){
	// paar checks, want we weten niet wat er eerst gaat gedaan zijn: het typen of de screenhot laden
	if(typeDone && screenshotDone && !screenshotIsVisible){
		screenshotIsVisible = true;

		//beetje wachten voor hij de resultaten toont
		setTimeout(function(){
			$("#googlescreenshot").fadeIn();
			$("#googleSearch").fadeOut();

			scroll();
		}, 700);

	}
}

function scroll(){
	$('#googlescreenshot').animate({
    	top: '-1000px'
    },6000);
}


function doYoutubeVideo(){
	window.location = "youtube/?name=" + escape(name);
}


