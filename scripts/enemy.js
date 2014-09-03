var enemyTypes = 4;
var sType = 15;

(function() {
	function Enemy(context,goal){
		this.unit = [];
		this.tDeaths = 0;
		this.goal = goal;
		this.lastSpawn=0;
		this._spawn=false;
		//this.sprite = new Sprite('images/enemy.png',96,96,context);
		this.context = context;
	};

	Enemy.prototype = {

		killed: function(x1,x2,max) {
			tKiA=0;
			for(i in this.unit){
				if(this.unit[i].state != 4 && this.unit[i].state != 3 && this.unit[i].type<sType){
					if(this.unit[i].x>x1 && this.unit[i].x<x2){
						this.unit[i].state=3;
						this.unit[i].last=10;
						this.unit[i]._render=true;
						++tKiA;
						++this.tDeaths;
						if(max!=0 && tKiA>=max){
							return false;
						}
					}
				}
			}
		},

		advance: function(speed) {
			for(i=this.unit.length-1;i>=0;--i){
				this.unit[i].x-=speed;
				this.unit[i]._render=true;
				if(this.unit[i].x+this.unit[i].width<0){
					this.unit.splice(i,1);
				}
			}
			this.lastSpawn+=speed;
			if(this.unit.length<3 && this.lastSpawn>96 && Math.random()>0.97){
				this._spawn=true;
				this.lastSpawn=0;
			}
		},

		update: function(cover) {
			tDamage=0;
			for(i in this.unit){
				if(this.unit[i].type<sType && this.unit[i].state!=4){//Soldier alive
					if(this.unit[i].x>=(this.goal-12) && this.unit[i].x-this.unit[i].range<=this.goal){
						if(this.unit[i].state==0 && this.unit[i].last==0){
							++this.unit[i].state;
							this.unit[i]._render=true;
							this.unit[i].last=15;
						}
						else if(this.unit[i].state==1 && this.unit[i].last==0){
							++this.unit[i].state;
							this.unit[i]._render=true;
							this.unit[i].last=5;
						}
						else if(this.unit[i].state==2 && this.unit[i].last==0){
							if(!cover){
								++tDamage;
							}
							this.unit[i].state=1;
							this.unit[i].last=115;
							this.unit[i]._render=true;
						}
						else if(this.unit[i].state==1 && this.unit[i].last==100){
							this.unit[i].state=0;
							this.unit[i]._render=true;
							this.unit[i].last=120;
						}
						else if(this.unit[i].state==0 && this.unit[i].last==100){
							this.unit[i].last=20;
						}
						else if(this.unit[i].state==3 && this.unit[i].last==0){
								this.unit[i].state=4;
								this.unit[i]._render=true;
						} 
						else{
							--this.unit[i].last;
						}
					} else {									//Dying soldier
						if(this.unit[i].state==3){
							if(this.unit[i].last==0){
								this.unit[i].state=4;
								this.unit[i]._render=true;
							} else {
								--this.unit[i].last;
							}
						} else
						if(this.unit[i].state!=0){
							this.unit[i].state=0;
							this.unit[i]._render=true;
						}
					}
				}
				else if(this.unit[i].type==sType && this.unit[i].state!=5){					//Bomb
					if(this.unit[i].state==0 && this.unit[i].last==0){
						this.unit[i].state=1;
						this.unit[i]._render=true;
						this.unit[i].last=60;
					}
					else if(this.unit[i].state==1 && this.unit[i].last==0){
						this.unit[i].state=2;
						this.unit[i]._render=true;
						this.unit[i].last=5;
					}
					else if(this.unit[i].state==2 && this.unit[i].last==0){
						this.unit[i].state=3;
						this.unit[i]._render=true;
						this.unit[i].last=5;
					}
					else if(this.unit[i].state==3 && this.unit[i].last==0){
						this.unit[i].state=4;
						this.unit[i]._render=true;
						this.unit[i].last=5;
					}
					else if(this.unit[i].state==4 && this.unit[i].last==0){
						this.unit[i].state=0;
						this.unit[i].last=105
						this.unit[i].sprite=new Sprite('images/explosion.png',96,96,this.context);
						this.unit[i].y=210;
						this.unit[i]._render=true;
						if(this.unit[i].x-this.unit[i].range<this.goal &&
							this.unit[i].x+this.unit[i].range+96>this.goal){
							tDamage+=2;
						}
						this.killed(this.unit[i].x-this.unit[i].range,this.unit[i].x+this.unit[i].range+96);
					}
					else if(this.unit[i].last==100){
						++this.unit[i].state;
						this.unit[i].last=105;
						this.unit[i]._render=true;
						if(this.unit[i].state==4){
							this.unit[i]._render=false;
							this.unit[i].last=0;
							this.unit[i].state=5;
						}
					}
					else {
						--this.unit[i].last;
					}
				}
			}

			if(this._spawn && this.unit.length<3){
				this._spawn=false;
				rType=(Math.floor(Math.random()*(enemyTypes-0.1)))*5;
				//console.log(rType);
				this.unit.push({
					_render:true,
					state:0,
					type:rType,
					last:(rType<sType)?20:50,
					x:(rType<sType)?gameWidth:(Math.floor(Math.random()*Math.floor(gameWidth/3)))*3,
					y: (rType<sType)?210:0, //(Math.random()>0.5)?200:220,
					range: (rType<sType)?304:96,
					width:96,
					sprite: (rType<sType)?new Sprite('images/enemy.png',96,96,this.context):new Sprite('images/artillery.png',96,480,this.context)
				});
			}
			return tDamage;
		},

		render: function() {
			for(i in this.unit){
				if(this.unit[i]._render){
					if(this.unit[i].type==sType){
						this.context.clearRect(this.unit[i].x,0,
													  this.unit[i].width,432);
					}else{
						this.unit[i].sprite.clear();
					}
				}
			}
			for(i in this.unit){
				if(this.unit[i]._render){
					if(this.unit[i].type==sType){
						this.unit[i].sprite.update(this.unit[i].state);
					} else {
						this.unit[i].sprite.update(this.unit[i].state+this.unit[i].type);
					}
					this.unit[i].sprite.render(this.unit[i].x,this.unit[i].y);
					this.unit[i]._render=false;
				}
			}
		}
	};

	window.Enemy = Enemy;
})();