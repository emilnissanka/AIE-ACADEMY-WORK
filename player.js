var METER = TILE;
var GRAVITY = METER * 9.8 * 3 ;

var MAXDX = METER * 10;
var MAXDY = METER * 15;

var ACCEL = MAXDX * 2;
var FRICTION = MAXDX * 6;
var JUMP = METER * 1500;

var player = function()
{
    this.image = document.createElement("img");
	this.x = SCREEN_WIDTH / 2
	this.y = SCREEN_HEIGHT / 2
	this.width = 159;
	this.height = 163;
	
	this.velocityX = 0
	this.velocityY = 0
	this.angularVelocity =0
	this.rotation = 0
	
	this.falling = true;
	this.jumping = true;
	
	this.image.src = "hero.png";
};

player.prototype.Update = function(deltaTime)
{
	var tx = pixel2tile(this.x);
	var ty = pixel2tile(this.y);
	
	var nx = (this.x)%TILE; 
	var ny = (this.y)%TILE; 
	
	var cell = cellAtTileCoord(LAYER_PLATFORMS, tx, ty);
	var cellright = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty);
	var celldown = cellAtTileCoord(LAYER_PLATFORMS, tx, ty + 1);
    var celldiag = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty + 1);
	
	var left, right, jump;
	left = right = jump = false;
	
	left = keyboard.isKeyDown(keyboard.KEY_LEFT);
	right = keyboard.isKeyDown(keyboard.KEY_RIGHT);
	jump = keyboard.isKeyDown(keyboard.KEY_SPACE);
	
	var wasleft = this.velocityX < 0;
	var wasright = this.velocityX > 0;  
	
	var falling = this.falling;
	var ddx = 0;
	var ddy = GRAVITY;
	
	if (left)
		ddx -= ACCEL;
	else if (wasleft)
		ddx += FRICTION;

	if (right)
		ddx += ACCEL;
	else if (wasright)
		ddx -= FRICTION;
		
	if (jump && !this.jumping && !falling)
	{
		ddy = ddy - JUMP; 
		this.jumping = true;
	}
	
	this.x = Math.floor(this.x + (deltaTime * this.velocityX));
	this.y = Math.floor(this.y + (deltaTime * this.velocityY));
	
	this.velocityX = bound(this.velocityX + (deltaTime * ddx), -MAXDX, MAXDX);
	this.velocityY = bound(this.velocityY + (deltaTime * ddy), -MAXDY, MAXDY);
	
	if ((wasleft && (this.velocityX > 0)) ||
    (wasright && (this.velocityX < 0))) 
		this.velocityX = 0; 
	
	if (this.velocityY > 0)
	{
		if ((celldown& !cell) || (celldiag && !cellright && nx))
		{
		 this.y = tileToPixel(ty);
		 this.velocityY = 0;
		 this.falling = false;
		 this.jumping = false;
		 ny = 0;
		}
	}
	
	else if (this.velocityY < 0)
	{
		if ((cell& !celldown) || (cellright && !cell && nx))
		{
			this.y = tileToPixel (ty+1);
			this.velocityY = 0;
			
			cell = celldown;
			cellright = celldiag;
			ny = 0;
		}
	}
	
	if (this.velocityX > 0)
	{
		if ((cellright && !cell) || (celldiag && celldown && ny))
		{
		 this.x = tileToPixel(tx);
		 this.velocityX = 0;
		}
	}
	
	else if (this.velocityX < 0)
	{
		if ((cell && !cellright) || (celldown && !celldiag && ny))
		{
		 this.x = tileToPixel(tx - 1);
		 this.velocityX = 0;
		}
	}
	
	
	
	
	if (this.velocityX > 0)
	{
		this.rotation = (this.velocityX / MAXDX) * (Math.PI/8);
	}
	else if (this.velocityX < 0)
		{	
			this.rotation = (this.velocityX / MAXDX) * (Math.PI/8);
		}
		else
			{
				this.rotation = 0;
			}	
}

player.prototype.Draw = function()
{
    context.save(); 
	    context.translate(this.x, this.y);
		context.rotate(this.rotation);
		context.drawImage(this.image,
		                 -this.width /2,
						 -this.height/2);
						
	context.restore();
}













