var ENEMY_ACCEL = 0;
var PAUSE_TIME = 0.5;
var MAX_ENEMY_DX = 100;

var enemy = function(_x, _y)
{
	this.sprite = new sprite("bat.png");
	var RandNum = Math.Random() * (0.6 - 0.55) +0.55;
	this.ACCEL = Math.Random() * (ENEMY_ACCEL - ENEMYACCEL * 0.9)
										+ ENEMY_ACCEL * 0.9;
	
	this.sprite.buildAnimation(2, 1, 88, 95, 0.3, [0,1]);
	this.sprite.setAnimationOffset (0, -35, -40);
	this.x = _x;
	this.y = _y;
	
	this.velocity_x = 0;
	this.velocity_y = 0;
	
	this.moveRight = true;
	this.pause = 0;
};

enemy.prototype.update = function(dt)
{
	this.sprite.update(dt);
	
	if (this.pause >0)
	{
		this.pause -=dt;
	}
	
	else
	{
	var ddx =0;
	var tx = pixel2Tile(this.x);
	var ty = pixel2Tile(this.y);
	var nx = this.x %TILE;
	var ny = this.y %TILE;
	
	var cell = cellAtTileCoord(LAYER_PLATFORMS,
											tx, ty);
	var cellright = cellAtTileCoord(LAYER_PLATFORMS, 
											tx + 1, ty);
	var celldown = cellAtTileCoord(LAYER_PLATFORMS,
											tx, ty + 1);
	var celldiag = cellAtTileCoord(LAYER_PLATFORMS,
											tx + 1, ty + 1);
	}
											
if(this.moveRight)
{
	if(celldiag && !cellright) 
	{
		ddx = ddx + ENEMY_ACCEL; // enemy wants to go right
	}
}
else
{
	{
	this.velocity.x = 0;
	this.moveRight = false;
	this.pause = PAUSE_TIME;
	}	
}					

else
{
if (celldown && !cell)
	{
	ddx = ddx - ENEMY_ACCEL;
	}
	else
	{
	this.velocity.x = 0;
	this.moveRight = true;
	this.pause = PAUSE_TIME;
	}
}

this.x +=this.velocity.x * dt;
this.velocity.x = bound(this.velocity.x + ddx *dt,
							-MAX_ENEMY_DX, MAX_ENEMY_DX);	
}			

enemy.prototype.draw = function(_Cam_X, _Cam_Y)
{
this.sprite.draw(context, this.x - _Cam_X, this.y - _Cam_Y);
}



