(function() {
	function Grenade(playerReach, context){
		this.context=context;
		this.x = 96;
		this.y = 210;
		this.sprite = new Sprite('images/grenade.png',30,30,this.context);
		this.goal = playerReach;
		this.arc = this.goal-this.x;
		this.reach = 2*96;
		this.speed = 6;
		this.last = 5;
		this.prev = 0;
		this.covered = 0;
		this._render = true;
		this.exploded = false;
		this.done = false;
		this.state=0;
	};

	Grenade.prototype = {

		advance: function(speed) {
			this.x-=speed;
			this.goal-=speed;
			this._render=true;
		},

		update: function() {
			if(this.exploded){
				if(this.last==0){
					++this.state;
					this._render=true;
					this.last=5;
				}
				if(this.state==4){
					this._render=false;
					this.done=true;
				}
				--this.last;
			} else {
				this.x+=this.speed;
				this.covered+=this.speed;
				--this.last;
				if(this.last==0){
					this.state=(1+this.state)%4;
					this._render=true;
					this.last=5;
				}
				if(this.prev==0 && this.covered>this.arc/8){
					this.y-=this.speed*3;
					this.prev=1;
				}
				if(this.prev<2 && this.covered>2*(this.arc/5)){
					this.y-=this.speed*2;
					this.prev=2;
				}
				if(this.prev<3 && this.covered>3*(this.arc/5)){
					this.y+=this.speed*2;
					this.prev=3;
				}
				if(this.prev<4 && this.covered>4*(this.arc/5)){
					this.y+=this.speed*2;
					this.prev=4;
				}
				if(this.prev<5 && this.covered>7*(this.arc/8)){
					this.y+=this.speed*3;
					this.prev=5;
				}
				if(this.x>=this.goal){
					this.exploded=true;
					this.sprite=new Sprite('images/explosion.png',96,96,this.context);
					this.state=0;
					last=0;
					this._render=true;
					return true;
				}
			}
			return false;
		},

		render: function() {
			if(this._render){
				this.sprite.clear();
				this.sprite.update(this.state);
				if(this.exploded){
					this.sprite.render(this.x-32,210);
				}
				else{
					this.sprite.render(this.x,this.y);
				}
			}
		}
	};

	window.Grenade = Grenade;
})();