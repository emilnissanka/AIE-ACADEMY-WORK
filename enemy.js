var ENEMY_ACCEL = 30;
var PAUSE_TIME = 0.5;
var MAX_ENEMY_DX = 100;

var Enemy = function(_x, _y)
{
	this.sprite = new Sprite("bat.png");
	
	var randNum = Math.random() * (0.6 - 0.55) +0.55;
	this.ACCEL = Math.random() * (ENEMY_ACCEL - ENEMY_ACCEL * 0.9)
										+ ENEMY_ACCEL * 0.9;
	
	this.sprite.buildAnimation(2, 1, 88, 94, randNum, [0,1]);
	this.sprite.setAnimationOffset (0, -35, -40);
	this.x = _x;
	this.y = _y;
	
	this.velocity_x = 0;
	this.velocity_y = 0;
	
	this.width = 88 ;
	this.height = 94 ;
	this.x_offset = -35;
	this.y_offset = -40;
	
	
	this.moveRight = true;
	this.pause = 0;
};

Enemy.prototype.update = function(dt)
{
	this.sprite.update(dt);
	
	if (this.pause > 0)
	{
		this.pause -=dt;
	}
	else
	{
		var ddx =0;
		var tx = pixel2tile(this.x);
		var ty = pixel2tile(this.y);
		
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
											
		if (this.moveRight)
		{
			if (celldiag && !cellright) 
			{
				ddx = ddx +  this.ACCEL; 
			}
			else
			{
				this.velocity_x = 0;
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
				this.velocity_x = 0;
				this.moveRight = true;
				this.pause = PAUSE_TIME;
			}
		}

		this.x +=this.velocity_x * dt;
		this.velocity_x = bound(this.velocity_x + ddx *dt,
									-MAX_ENEMY_DX, MAX_ENEMY_DX);		
	}
}			

Enemy.prototype.Draw = function(_Cam_X, _Cam_Y)
{
	this.sprite.draw(context, this.x - _Cam_X, this.y - _Cam_Y);
}



