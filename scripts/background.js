var tileWidth = 96;
var tileNum = 12;
var propNum = 10;

(function() {
	function Background(width,height,context) {
		this.context=context;
		this.width=width;
		this.buffer=[document.createElement('canvas'),
					 document.createElement('canvas')];
		this.x	   =[0,width];
		this._render = true;
		this.last = 0;
		this.sprite=[new Sprite('images/backTiles.png',tileWidth,height,this.buffer[0].getContext("2d")),
					 new Sprite('images/backTiles.png',tileWidth,height,this.buffer[1].getContext("2d"))]
		this.pSprite=[new Sprite('images/backProps.png',tileWidth,height,this.buffer[0].getContext("2d")),
					  new Sprite('images/backProps.png',tileWidth,height,this.buffer[1].getContext("2d"))]
		for(i in this.buffer){
			this.buffer[i].width = width;
			this.buffer[i].height= height;
			for (j=0; j<=width; j+=tileWidth){
				this.sprite[i].update(Math.floor(Math.random()*tileNum));
				this.sprite[i].render(j,0);
			}
		}
		
	};

	Background.prototype = {
		advance: function(speed) {
			for(i in this.buffer){
				this.x[i]-=speed;
				if(this.x[i]<0){
					dif=Math.floor(this.x[i]/-tileWidth);
					if(dif>this.last){
						this.last=dif;
						this.update(i,dif-1);
						if(this.x[i]<=-this.width){
							this.x[i]=this.width+(this.x[i]+this.width);
							this.last=0;
						}
					}
				}
			}
			this._render=true;
		},

		update: function(i,x) {
			this.sprite[i].update(Math.floor(Math.random()*tileNum));
			this.sprite[i].render(x*tileWidth,0);
			if(Math.random()>0.6){
				this.pSprite[i].update(Math.floor(Math.random()*(propNum+0.9)));
				this.pSprite[i].render(x*tileWidth,0);
			}
		},

		render: function() {
			if(this._render){
				for(i in this.buffer){
					this.context.drawImage(this.buffer[i],this.x[i],0);
				}
				this._render=false;
			}
		}
	};

	window.Background = Background;
})();