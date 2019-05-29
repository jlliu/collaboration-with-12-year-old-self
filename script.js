let inputImg;
let statusMsg;
let transferBtn;
let style1;

let resultImage;
let styledImage;
let fadingImage;
let penWeight;
let strokeColor;

var stylePaths = ['models/sakura',
'models/yue',
'models/zuko',
'models/spring',
'models/sasuke',
'models/katara'
];

var pathsToOriginal = {'models/sakura':'originals/sakura2.jpg',
'models/sasuke':'originals/sasuke.jpg',
'models/zuko':'originals/zuko.jpg',
'models/yue':'img/originals/roses.jpg',
'models/spring':'originals/spring.jpg',

'models/katara':'originals/katara.jpg',

};



var currentStyle;
var currentStyleIndex = 0;
var nextStyleIndex;
let prevCanvasState;
var mouseDown = 0;





var styles = [];

let resizedContext;
let resizedCanvas;


var styleTransferMode = true;


var setupDone = false;


function setup() {

	  var canvasP5 = createCanvas(200,200);
	  canvasP5.parent('paint-UI');
	  background(255);
	  canvas.style.width = "390px";
	  canvas.style.height = "390px";
	  prevCanvasState = JSON.stringify(canvas.toDataURL());

	//Placeholder canvas with smaller resolution
	  resizedCanvas = document.createElement("canvas");
		resizedContext = resizedCanvas.getContext("2d");
		resizedCanvas.height = "80";
		resizedCanvas.width = "80";
		setupDone = true;
		console.log("setup is done");



}

var appActivated = false;


function setupApp(){
	//Once button clicked, wait on the p5 setup() to finish
	$(".loadButton").html("Loading style 1/"+stylePaths.length+"...");
	while (setupDone == false){
		console.log("waiting on setup");
		window.setTimeout(function(){}, 500);
	}
	//One that's done,set up the rest of the app

	
	console.log("SETUP APP");
	if (!appActivated){
		console.log("setting up APP");
	//Create style methods for all models
    for (var i=0; i<stylePaths.length; i++){

	   	var thisStyle =  ml5.styleTransfer(stylePaths[i], modelLoaded);
	   	styles.push(thisStyle);
    }
	resultImage = document.getElementById('resultImage');
	styledImage = document.getElementById('styledImage');
	resizedContext.drawImage(canvas, 0,0, 80, 80);
	var image = resizedCanvas.toDataURL();
	resultImage.src = "blank.png";
	penWeight = 1;
	strokeColor = 0;
	appActivated = true;

	}

}


function mouseDragged(){ 	
	if (appActivated && allStylesReady){
		strokeWeight(penWeight);
		stroke(strokeColor);
		line(mouseX, mouseY, pmouseX, pmouseY);
	}
}

// A function to be called when the models have loaded

var allStylesReady = false;

var numberReadyStyles = 0;

function modelLoaded() {
  // Check if all models are loaded
  numberReadyStyles++;
  $(".loadButton").html("Loading style "+numberReadyStyles+"/"+stylePaths.length+"...");
  if (numberReadyStyles == stylePaths.length){
  	console.log("numberReadyStyles "+numberReadyStyles);
  	console.log("stylePaths.length "+stylePaths.length );

  	//Activate app
  	$("#drawingApp").css("opacity","1");
  	$("#drawingApp").css("pointer-events","auto");
  	$(".loadButton").fadeOut();
  	allStylesReady = true;
  	console.log("ALL STYLES LOADED");

  	currentStyle = styles[currentStyleIndex];
	console.log(resultImage);
	resultImage.src ="blank.png";
    transferImages(currentStyle);
	
  }

}


let updateHighDef;
let updateIndex;
setInterval(function() {
		if (allStylesReady && styleTransferMode){



			var currentCanvasState = JSON.stringify(canvas.toDataURL());
			// console.log("TRIGGER INTERVAL");


			if (currentCanvasState !== prevCanvasState){
				$("#textarea").addClass("activated");
				$("#textarea").html("Transferring the style now...");

				//We notice that the canvas has changed since the last interval
				prevCanvasState = currentCanvasState;

			 		//Check that textbox isnt active AND paint is open
					currentStyle = styles[currentStyleIndex];
			 		//If we are currently drawing, use a lower resolution
			 		if(mouseDown){
			 			// console.log("mouseDown");
						resizedCanvas.height = "90";
						resizedCanvas.width = "90";
						resizedContext.drawImage(canvas, 0,0, 90, 90);
						var image = resizedCanvas.toDataURL();
						// var image = canvas.toDataURL();
						resultImage.src = image;
						transferImages(currentStyle); 
						updateHighDef = true;
						updateIndex =0;
					} else {
						resizedCanvas.height = "150";
						resizedCanvas.width = "150";
						resizedContext.drawImage(canvas, 0,0,150, 150);
						var image = resizedCanvas.toDataURL();
						resultImage.src = image;
						// transferImages(currentStyle); 
						updateHighDef = true;
						updateIndex =0;

					}

			} else {

				if (updateHighDef ==true){
					var dimensions = ['110','120','130','150'];
					currentStyle = styles[currentStyleIndex];
	
			
					var thisDimension = dimensions[updateIndex];
					var dimensionInt = parseInt(thisDimension);
					resizedCanvas.height = thisDimension;
					resizedCanvas.width = thisDimension;
					resizedContext.drawImage(canvas, 0,0,dimensionInt,dimensionInt);
					var image = resizedCanvas.toDataURL();
					resultImage.src = image;
					transferImages(currentStyle); 

					if (updateIndex == (dimensions.length-1)){
						updateHighDef = false;
						$("#textarea").html("Go ahead and draw! :)");
					}else{
						updateIndex++;

					}
					 

							

						
				}
				


		}

			

		}
		

	},200);


function transferImages(style) {
	style.transfer(document.getElementById("resultImage"), function(err, result) {
    	styledImage.src = result.src;
    	$("#styledImage").show();
  });
}


function erase(){
	strokeColor = 255;
	penWeight = 30;
	$(".paint-button.draw").removeClass("active");
	$(".paint-button.erase").addClass("active");

}


function pen(){
	strokeColor = 0;
	penWeight = 1;
	$(".paint-button.draw").addClass("active");
	$(".paint-button.erase").removeClass("active");

}
$(document).ready(function(){

	//Detect if Mousedown (1 for mouseDown, 0 for mouseUp)

	document.body.onmousedown = function() { 
	  ++mouseDown;
	}
	document.body.onmouseup = function() {
	  --mouseDown;
	}


	$(".styles img").click(function(e){
		console.log("CLICKED ON A STYLE")
		$(".styles img").removeClass("selected");
		var thisElement = e.target;
		var thisSource = thisElement.src;
		var thisId = thisElement.id;
		currentStyleIndex = parseInt(thisId);
		currentStyle = styles[currentStyleIndex];
		console.log("currentStyleIndex");
		console.log(currentStyleIndex);
		$(thisElement).addClass("selected");
		transferImages(currentStyle);

	});


	$('#styleCheckbox').change(
    function () {
    	console.log("style checkbox is changed")
        if ($('#styleCheckbox').is(':checked')) {
            styleTransferMode = true;
            currentStyle = styles[currentStyleIndex];
            transferImages(currentStyle);
            $("#textarea").html("Go ahead and draw! :)");

        }   
        else {
            styleTransferMode = false;
            $("#textarea").html("Turn on style transfer to see changes.");
        }
});


});

