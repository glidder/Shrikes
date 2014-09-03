var playerWidth=96;
var playerHeight=96;

(function() {
	function Player(context){
		this.x = 12;
		this.y = 210;
		this.sprite = new Sprite('images/player.png',playerWidth,playerWidth,context);
		this._render = true;
		this.reach = 408; // gameWidth * 0.85+
		this.speed = 3;
		this.last = 0;
		this.state = 0;
		this.maxLife = 2
		this.life = this.maxLife;
		this._reload = false;
		this.canShoot = true;
		this.grenades = 3;
	};

	Player.prototype = {

		reload: function() {
			if(this.state==9){//Throwing
				if (this.last==0){
					++this.state;
					this._render=true;
					this.last=5
					return true;
				}
			}
			else if(this.state==10){
				if(this.last==0){
					this.state=0;
					this._reload=false;
					this._render=true;
					this.canShoot=false;
					return false;
				}
			}
			else if(this.state==12){//Crouching
				this.state=11;
				this._render=true;
				this.last=10;
				return false;
			}
			else if(this.state==11){
				if(this.last==0){
					this.state=0;
					this._render=true;
					this._reload=false;
					return false;
				}
			}
			else if(this.state==5){//Shooting
				if(this.last==0){
					this.last=5;
					this.state=4;
					this._render=true;
					return true;
				}
			}
			else if(this.state==4){
				if(this.last==0){
					this.last=20;
					this.state=6;
					this._render=true;
					return false;
				}
			}
			else if(this.state==6){
				if(this.last==0){
					this.last=10;
					this.state=7;
					this._render=true;
					return false;
				}
			}
			else if(this.state==7){
				if(this.last==0){
					this.state=0;
					this._reload=false;
					this._render=true;
					this.canShoot=false;
					return false;
				} 
			}
			else if(this.state==17){
				if(this.last==0){
					this.state=0;
					this._reload=false;
					this._render=true;
					this.canShoot=true;
					return false;
				}
			}
			--this.last;
			return false;
		},

		shoot: function() {
			if(this._reload){
				return this.reload();
			} else {
				if(this.canShoot){
					if(this.state!=4){
						this.state=4;
						this._render=true;
						this.last=15;
					} else {
						--this.last;
						if(this.last==0){
							this.state=5;
							this._render=true;
							this.last=5;
							this._reload=true;
							this.canShoot=false;
						}
					}
				}
			}
		},

		throwGrenade: function() {
			if(this._reload){
				if(this.reload()){
					--this.grenades;
					return true;
				}	
			} else {
				if(this.canShoot & this.grenades>0){
					if(this.state!=8){
						this.state=8;
						this._render=true;
						this.last=15;
					} else {
						if(this.last==0){
							this.state=9;
							this._render=true;
							this.last=5;
							this.canShoot=false;
							this._reload=true;	
						}
					}
					--this.last;
				}
			}
			return false;

		},

		crouch: function() {
			this.canShoot=true;
			if(this.state!=12 && this._reload){
				this.reload();
			} else {
				if(this.state!=11 && this.state!=12){
					this.state=11;
					this.last=10;
					this._render=true;
				}
				else if(this.state!=12 && this.last==0){
					this.state=12;
					this._render=true;
					this.last=10;
					this._reload=true;
				}
				--this.last;
			}
		},

		charge: function() {
			this.canShoot=true;
			if(this._reload){
				this.reload();
				return false;
			} else {
				this.speed=6;
				if(this.last==0){
					if(this.state<13){
						this.state=13;
					} else {
						this.state=13+(this.state-12)%4;
					}
					this.last=5;
					this._render=true;
				}
				--this.last;
				return true;
			}
		},

		walk: function() {
			this.canShoot=true;
			if(this._reload){
				this.reload();
				return false;
			} else {
				this.speed=3;
				if(this.last==0){
					this.state=(this.state+1)%4;
					this.last=10;
					this._render=true;
				}
				--this.last;
				return true;
			}
		},

		idle: function() {
			this.canShoot=true;
			if(this._reload){
				this.reload();
			} else {
				if(this.state!=0){
					this.state=0;
					this.last=0;
					this._render=true;
				}
			}
		},

		hit: function(damage) {
			if(damage!=0){
				this.canShoot=false;
				this.state=17;
				this.last=10;
				this._reload=true;
				this._render=true;

				this.life-=damage;
				if(this.life<=0){
					return true;
				} else {
					if(this.life>this.maxLife){
						this.life=this.maxLife;
					}
					return false;
				}
			} else {
				return false;
			}
		},

		cover: function() {
			return (this.state==12)?true:false;
		},

		render: function() {
			if(this._render){
				this.sprite.clear();
				this.sprite.update(this.state);
				this.sprite.render(this.x,this.y);
				this._render=false;
			}
		}
	};

	window.Player = Player;
})();
