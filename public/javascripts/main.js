var typeIndex = 0;
var typer = 0;

var typeDone = false;
var screenshotDone = false;
var screenshotIsVisible = false;


$(function(){
	$("input#inpSearch").val("");

	// start typing
	typer = setInterval(typeTick,300);

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
});


function showScreenshot(){
	// paar checks, want we weten niet wat er eerst gaat gedaan zijn: het typen of de screenhot laden
	if(typeDone && screenshotDone && !screenshotIsVisible){
		screenshotIsVisible = true;
		$("#googlescreenshot").fadeIn();
		$("#googleSearch").fadeOut();
	}
}


function typeTick(){
	$("input#inpSearch").val($("input#inpSearch").val()+name.charAt(typeIndex));
	typeIndex++;
	if(typeIndex >name.length){
		clearInterval(typer);
		typeDone = true;
		showScreenshot();
	}
}