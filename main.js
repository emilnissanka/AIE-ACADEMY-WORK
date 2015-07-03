var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");

var testDiv = document.getElementById("testDiv");

var GAMESTATE_GAME = 0;
var GAMESTATE_MENU = 1;
var GAMESTATE_ENDGAME = 2;
var curGameState = GAMESTATE_MENU;
var menuTimer = 3;

var heart = document.createElement("img");
heart.src = "heart.png";

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

var keyboard = new keyboard ();
var chuck = new Player ();

var Enemies = [];

for(var i=0; i < 5; i++)
{
	Enemies[i] = new Enemy(1000 + i * 30, 420);
}
initialize ();

var musicBackground = new Howl(
{
	urls:["background.ogg"],
	loop :true,
	buffer : true,
	volume : 0.5
});

musicBackground.play();

var isSfxPlaying = false;

var sfxFire = new Howl(
{
	urls:["fireEffect.ogg"],
	buffer : true,
	volume : 1,
	onend: function() { isSfxPlaying = false;}
});

function lerp(left_value, right_value, ratio)
{
	return left_value + ratio *(right_value - left_value);
}

function drawbackground ()
{
	var pattern = context.createPattern(background,'repeat');
	context.fillStyle = pattern;
	context.fillRect(0, 0,canvas.width,canvas.height);
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

function checkCollision ()
{
	var Player_min_x = chuck.x + chuck.x_offset;
	var Player_min_y = chuck.y + chuck.y_offset;
	
	var Player_max_x = chuck.x + chuck.width + chuck.x_offset;
	var Player_max_y = chuck.y + chuck.height + chuck.y_offset;
	
	for (var EnemyIndex = 0; EnemyIndex < Enemies.length; EnemyIndex++)
	{
		var Enemy_min_x = Enemies[EnemyIndex].x + Enemies[EnemyIndex].x_offset;
		
		var Enemy_min_y = Enemies[EnemyIndex].y + Enemies[EnemyIndex].y_offset;
		
		var Enemy_max_x = 
			Enemies[EnemyIndex].x +
			Enemies[EnemyIndex].width +
			Enemies[EnemyIndex].x_offset;
			
		var Enemy_max_y =
			Enemies[EnemyIndex].y +
			Enemies[EnemyIndex].height +
			Enemies[EnemyIndex].y_offset;
		
		if (((Player_max_x < Enemy_min_x) || (Player_min_x > Enemy_max_x)) || 
		((Player_max_y < Enemy_min_y) || (Player_min_y > Enemy_max_y)))
		{
			continue;
		}
		chuck.lives --;
		chuck.reset();
		return;	
	}
}

function run (delatTime) 
{	
	fpsTime += deltaTime;
	fpsCount++;
	if(fpsTime >= 1)
	{
		fpsTime -= 1;
		fps = fpsCount;
		fpsCount = 0;
	}
	
	context.fillStyle = "#f00";
	context.font="14px Arial";
	context.fillText("FPS: " + fps, 5, 20, 100);
	
	context.fillStyle = "#f00";
	context.font="14px Arial";
	context.fillText("position: "  + Math.ceil(chuck.x) + ", " + Math.ceil(chuck.y), 60, 30, 100);
}

function run (delatTime)
{
	var deltaTime = getDeltaTime();

	context.fillStyle = "#ccc";		
	context.fillRect(0, 0, canvas.width, canvas.height);
	context.restore();
	
	switch(curGameState)
	{
	case GAMESTATE_GAME:
	
		//update code 
		var left_stop = 0 ;
		var top_stop = 0 ;
		var right_stop = TILE * (MAP.tw) - SCREEN_WIDTH ;
		var bottom_stop = TILE * (MAP.th) - SCREEN_HEIGHT ;
		
		var new_pos_x = chuck.x - SCREEN_WIDTH / 2;
		var new_pos_y = chuck.y - SCREEN_HEIGHT / 2;
		
		if( new_pos_x < left_stop)
			new_pos_x = left_stop;
		
		else if (new_pos_x > right_stop)
			new_pos_x = right_stop;
			
		if(new_pos_y < top_stop)
			new_pos_y = top_stop;
		else if(new_pos_y > bottom_stop)
			new_pos_y = bottom_stop;
		
		Cam_X = lerp(Cam_X, new_pos_x, 0.25);
		Cam_Y = lerp(Cam_Y, new_pos_y, 0.25);
	
	
		chuck.Update(deltaTime);
		for (var i = 0; i < Enemies.length; i++)
		{
			Enemies[i].update(deltaTime);
		}
		
		checkCollision ();
		
		//draw code
		drawMap(Cam_X, Cam_Y);
		chuck.Draw (Cam_X, Cam_Y);
		
		for (var imageOffset = 0; imageOffset < chuck.lives; imageOffset++)
		{
			context.save();
				context.translate(20 + 50 * imageOffset, 20);
				context.drawImage(heart, 0 , 0, 50, 50);
			
			context.restore();
		}
		
		for (var i = 0; i < Enemies.length; i++)
		{
			Enemies[i].Draw(Cam_X, Cam_Y);
		}
		
		if (chuck.lives == 0)
		{
			drawEndgame();
		}
		
		context.fillStyle = "green";
		context.font="32px Arial";
		var scoreText = "Score: " + chuck.score;
		context.fillText(scoreText, SCREEN_WIDTH - 170, 35);
		context.restore();

		var rules = 0;
		context.fillStyle = " ";
		context.font="20px Arial";
		var rulesText = "GET THE HIGHEST SCORE WITHOUT RESPAWNING " ;
		context.fillText(rulesText, SCREEN_WIDTH - 700, 35);
	
		break;
		
	case GAMESTATE_MENU:
		menuTimer -= deltaTime;
		if (menuTimer > 0)
			drawMenu();
		else
			curGameState = GAMESTATE_GAME;
			
		break;	
			
	case GAMESTATE_ENDGAME:
		drawEndgame();
		
		
		
	break;
	
	}
}

function drawEndgame()
{
	context.fillStyle = "#000000";
	context.fillRect(0, 0,canvas.width,canvas.height);
	
	context.fillStyle = "#B22222";
	context.font = "72px Tahoma";
	var textMeasure = context.measureText ("SPLASH SCREEN" + Math.floor (menuTimer));
	context.fillText("GAME OVER: YOU LOSE", canvas.width/1.7 - textMeasure.width/1.28, canvas.height/2);
	
	context.fillStyle = "#B22222";
	context.font = "60px Tahoma";
	context.fillText("Press F5 to Restart", canvas.width/2.2 - textMeasure.width/3, canvas.height/1.5);

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
