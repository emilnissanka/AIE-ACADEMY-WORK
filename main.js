var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");

var background = document.createElement("img");
background.src = "Forest_background_by_whitewolf16.png";

var GAMESTATE_GAME = 0;
var GAMESTATE_MENU = 1;
var GAMESTATE_SPLASH = 2;
var curGameState = GAMESTATE_MENU;
var menuTimer = 3;
var Endgame = 0

var startFrameMillis = Date.now();
var endFrameMillis = Date.now();

function getDeltaTime()
{
	endFrameMillis = startFrameMillis;
	startFrameMillis = Date.now();

		// Find the delta time (dt) - the change in time since the last drawFrame
		// We need to modify the delta time to something we can use.
		// We want 1 to represent 1 second, so if the delta is in milliseconds
		// we divide it by 1000 (or multiply by 0.001). This will make our 
		// animations appear at the right speed, though we may need to use
		// some large values to get objects movement and rotation correct
	var deltaTime = (startFrameMillis - endFrameMillis) * 0.001;
	
		// validate that the delta is within range
	if(deltaTime > 1)
		deltaTime = 1;
		
	return deltaTime;
}

//-------------------- Don't modify anything above here

var SCREEN_WIDTH = canvas.width;
var SCREEN_HEIGHT = canvas.height;

var Cam_X = 0;
var Cam_Y = 0;

var fps = 0;
var fpsCount = 0;
var fpsTime = 0;
var chuck

var keyboard = new keyboard ();
var chuck = new player ();
var enemies = [];

for(var i=0; i< enemies.length; i++)
	{
		enemies[i].draw(Cam_X, Cam_Y);
	}

initialize ();
var musicBackground = new Howl({
	urls:["background.ogg"],
	loop :true,
	buffer : true,
	volume : 0.5
});
musicBackground.play();

var isSfxPlaying = false;

var sfxFire = new Howl({
	urls:["fireEffect.ogg"],
	buffer : true,
	volume : 1,
	onend: function() { isSfxPlaying = false;}
});

function lerp(left_value, right_value, ratio)
{
	return left_value + ratio + (right_value - left_value);
}




function draw()
{
	Menu()
	drawMap();
	drawEndgame()
	enemy();
}

function drawMenu(deltaTime)
{
	context.fillStyle = "#000000";
	context.fillRect(0, 0,canvas.width,canvas.height);
	
	context.fillStyle = "#00FF00";
	context.font = "100px Tahoma";
	
	var textMeasure = context.measureText ("SPLASH SCREEN" + Math.floor (menuTimer));
	context.fillText("JUNGLE MANIA ", canvas.width/2.5 - textMeasure.width/3, canvas.height/1.9);
	context.fillStyle = "#00FF00";
	context.font = "70px Tahoma";
	context.fillText("STARTS IN " +  Math.ceil(menuTimer), canvas.width/1.82 - textMeasure.width/3, canvas.height/3.5);
	context.fillText("Chuck Norris Version", canvas.width/2.35 - textMeasure.width/3, canvas.height/1.4);
	
	
}

function run (deltaTime) 
{
	context.fillStyle = "#ccc";		
	context.fillRect(0, 0, canvas.width, canvas.height);
	context.restore();
	
	var score = 0;
    context.fillStyle = "green";
    context.font="32px Arial";
    var scoreText = "Score: " + score;
    context.fillText(scoreText, SCREEN_WIDTH - 170, 35);
    context.restore();
		
	var deltaTime = getDeltaTime();
	
	chuck.Update(deltaTime);
			
	var left_stop = 0 ;
	var top_stop = 0 ;
	var right_stop = TILE * (MAP.tw) - SCREEN_WIDTH ;
	var bottom_stop = TILE * (MAP.th) - SCREEN_HEIGHT ;
	
	var new_pos_x = chuck.x - SCREEN_WIDTH / 2;
	var new_pos_y = chuck.y - SCREEN_HEIGHT / 2;
	
	if(new_pos_x < left_stop)
		new_pos_x = left_stop;
	else if(new_pos_x > right_stop)
		new_pos_x = right_stop;
		
	if(new_pos_y < top_stop)
		new_pos_y = top_stop;
	else if(new_pos_y > bottom_stop)
		new_pos_y = bottom_stop;
	
	Cam_X = lerp(Cam_X, new_pos_x, 0.25);
	Cam_Y = lerp(Cam_Y, new_pos_y, 0.25);
	
	drawMap(Cam_X, Cam_Y); 
	chuck.Draw(Cam_X, Cam_Y);
	enemy.prototype.draw(Cam_X, Cam_Y);
	
	//Cam_X = chuck.x - SCREEN_WIDTH /2;
	//Cam_Y = chuck.y - SCREEN_HEIGHT /2;
	
	fpsTime += deltaTime;
	fpsCount++;
	if(fpsTime >= 1)
	{
		fpsTime -= 1;
		fps = fpsCount;
		fpsCount = 0;
	}
	
	//context.fillStyle = "#f00";
	//context.font="14px Arial";
	//context.fillText(("position" + Math.cell(chuck.x) + ", "+ Math.cell(chuck.y) " + fps, 5, 20, 100);
	
	switch(curGameState)
	{
	case GAMESTATE_GAME:
		drawMap();
		chuck.Draw();
		enemy.prototype.draw();
		
	break;
		
	case GAMESTATE_MENU:
		menuTimer -= 0.016;
		if (menuTimer > 0)
			drawMenu();
		else
			curGameState = GAMESTATE_GAME;
			
	break;
		
	case GAMESTATE_SPLASH:
		drawEndgame();
	break;
		
	default:
		document.writeln("Unexpected GameState");
		//
	break;
	}
	
}

function drawEndgame(deltaTime)
{
	context.fillStyle = "#000000";
	context.fillRect(0, 0,canvas.width,canvas.height);
	
	context.fillStyle = "#CC0033";
	context.font = "144px Tahoma";
	
	var textMeasure = context.measureText ("SPLASH SCREEN" + Math.floor (menuTimer));
	context.fillText("GAME OVER", canvas.width/2.4 - textMeasure.width/3, canvas.height/1.5);
	context.font = "40px Tahoma";
	context.fillText("Press F5 to Restart", canvas.width/1.85 - textMeasure.width/3, canvas.height/3.5);

}

//-------------------- Don't modify anything below here


// This code will set up the framework so that the 'run' function is called 60 times per second.
// We have a some options to fall back on in case the browser doesn't support our preferred method.
(function() {
  var onEachFrame;
  if (window.requestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); window.requestAnimationFrame(_cb); }
      _cb();
    };
  } else if (window.mozRequestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); window.mozRequestAnimationFrame(_cb); }
      _cb();
    };
  } else {
    onEachFrame = function(cb) {
      setInterval(cb, 1000 / 60);
    }
  }
  
  window.onEachFrame = onEachFrame;
})();

window.onEachFrame(run);
