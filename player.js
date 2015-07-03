var METER = TILE;
var GRAVITY = METER * 9.8 * 3 ;

var MAXDX = METER * 10;
var MAXDY = METER * 15;

var ACCEL = MAXDX * 2;
var FRICTION = MAXDX * 6;
var JUMP = METER * 1500;

var LEFT = 0;
var RIGHT = 1;
var SHIFT = 3;

var ANIM_IDLE_LEFT = 0;
var ANIM_JUMP_LEFT = 1;
var ANIM_WALK_LEFT = 2;
var ANIM_SHOOT_LEFT = 3;

var ANIM_CLIMB = 4;
var ANIM_IDLE_RIGHT = 5;
var ANIM_JUMP_RIGHT = 6;
var ANIM_WALK_RIGHT = 7;

var ANIM_SHOOT_RIGHT = 8;
var ANIM_MAX = 9;




var Player = function()
{
	this.sprite = new Sprite("ChuckNorris.png");
	
	//idle left
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05,
	[0, 1, 2, 3, 4, 5, 6, 7]);
	
	//jump left
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05,
	[8, 9, 10, 11, 12]);
	
	//walk left
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05,
	[13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]);
	
	//shoot left
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05,
	[27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40]);
	
	//climb 
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05,
	[41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51]);
	
	//idle right
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05,
	[52, 53, 54, 55, 56, 57, 58, 59]);
	
	//jump right
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05,
	[60, 61, 62, 63, 64]);
	
	//walk right
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05,
	[65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78]);
	
	//shoot right
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05,
	[79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92]);
	
	for (var animIndex = 0; animIndex < ANIM_MAX; animIndex++)
	{
		this.sprite.setAnimationOffset(animIndex, -55, -87);
	}

    
	this.x = SCREEN_WIDTH /2;
	this.y = SCREEN_HEIGHT / 2;
	this.width = 159;
	this.height = 163;
	
	this.x_offset = -55;
	this.y_offset =  -87;
	
	this.score = 0;
	this.lives = 3;
	
	this.velocityX = 0;
	this.velocityY = 0;
	this.angularVelocity =0;
	this.rotation = 0;
	
	this.falling = true;
	this.jumping = true;
	this.shoot_left = true;
	this.shoot_right = true;
	
	this.direction = RIGHT;
	
	//this.image = document.createElement("img");
	//this.image.src = "hero.png";
};

Player.prototype.reset = function()
{	
	this.x = SCREEN_WIDTH / 2.7;
	this.y = SCREEN_HEIGHT / 2.9;
	
	this.velocityX = 0;
	this.velocityY = 0;
	this.angularVelocity = 0;
	this.rotation = 0;
}

Player.prototype.Update = function(deltaTime)
{
	this.sprite.update(deltaTime);
	
	var tx = pixel2tile(this.x);
	var ty = pixel2tile(this.y);
	
	var nx = (this.x)%TILE; 
	var ny = (this.y)%TILE; 
	
	var cell = cellAtTileCoord(LAYER_PLATFORMS, tx, ty);
	var cellright = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty);
	var celldown = cellAtTileCoord(LAYER_PLATFORMS, tx, ty + 1);
    var celldiag = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty + 1);
	
	var left, right, jump, shoot_left, shoot_right;
	left = right = jump = shoot_left = shoot_right = false;
	

	if (keyboard.isKeyDown(keyboard.KEY_LEFT))
	{
		left = true;
		this.direction = LEFT;
		if (this.sprite.currentAnimation != ANIM_WALK_LEFT && 
				this.jumping == false)
		this.sprite.setAnimation(ANIM_WALK_LEFT)
		
		if (keyboard.isKeyDown(keyboard.KEY_SHIFT))
		shoot_left = true;
		if (this.sprite.currentAnimation != ANIM_WALK_LEFT && 
				this.jumping == false)
		this.sprite.setAnimation(ANIM_SHOOT_LEFT);
	}
	
	 else if (keyboard.isKeyDown(keyboard.KEY_RIGHT))
	{
		right = true;
		this.direction = RIGHT;
		if (this.sprite.currentAnimation != ANIM_WALK_RIGHT &&
				this.jumping == false)
		this.sprite.setAnimation(ANIM_WALK_RIGHT)
	}
	
	else
	{
		if (this.jumping == false && this.falling == false)
		{
			if(this.direction == LEFT)
			{
				if (this.sprite.currentAnimation != ANIM_IDLE_LEFT)
					this.sprite.setAnimation(ANIM_IDLE_LEFT);
			}
			
			else
			{
				if(this.direction == RIGHT)
				{
	 			if (this.sprite.currentAnimation != ANIM_IDLE_RIGHT)
					this.sprite.setAnimation(ANIM_IDLE_RIGHT)
				}
			}
		}
	}
	
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
		if (isSfxPlaying)
		{
			sfxPlay();
			isSfxPlaying = true;
		}
		
		ddy = ddy - JUMP; 
		this.jumping = true;
		
		if (this.direction == LEFT)
			this.sprite.setAnimation(ANIM_JUMP_LEFT);
		else
			this.sprite.setAnimation(ANIM_JUMP_RIGHT);	
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
			this.velocityX = 0;
			
			cell = celldown;
			cellright = celldiag;
			ny = 0;
		}
	}
	
	if (this.velocityX < 0)
	{
		if ((cellright && !cell) || (celldiag && celldown && ny))
		{
		 this.x = tileToPixel(tx + 1);
		 this.velocityX = 0;
		}
	}
	
	else if (this.velocityX > 0)
	{
		if ((cell && !cellright) || (celldown && !celldiag && ny))
		{
		 this.x = tileToPixel(tx);
		 this.velocityX = 0;
		}
	}
	
	if ((keyboard.isKeyDown(keyboard.KEY_SPACE)) || (keyboard.isKeyDown(keyboard.KEY_LEFT)))
	{
		jumping = true;
		this.score += 1;
	}
	
	//if (this.velocityX > 0)
	//{
	//	this.rotation = (this.velocityX / MAXDX) * (Math.PI/8);
	//}
	//else if (this.velocityX < 0)
	//{	
	//	this.rotation = (this.velocityX / MAXDX) * (Math.PI/8);
	//}
	//else
	//{
	//	this.rotation = 0;
	//}	
		
	if (keyboard.isKeyDown(keyboard.KEY_SHIFT))
	{
		if(this.direction == LEFT)
		{
			if (this.sprite.currentAnimation != ANIM_SHOOT_LEFT && !this.shoot_left)
				this.sprite.setAnimation(ANIM_SHOOT_LEFT);
				
			this.shoot_left = true;
			this.shoot_right = false;
		}
		else
		{
			
			if (this.sprite.currentAnimation != ANIM_SHOOT_RIGHT && !this.shoot_right)
				this.sprite.setAnimation(ANIM_SHOOT_RIGHT);
				
			this.shoot_left = false;
			this.shoot_right = true;
		}
	}
	else
	{
		this.shoot_left = false;
		this.shoot_right = false;
	}
	
	if (this.y > SCREEN_HEIGHT)
	{
		this.reset();
		-- this.lives;
			if(this.lives <=0)
			{ 
				curGameState = drawEndgame;
			}
	
	}
	
}


Player.prototype.Draw = function(_Cam_X, _Cam_Y)
{
	this.sprite.draw(context, this.x -_Cam_X, this.y -_Cam_Y);
}













