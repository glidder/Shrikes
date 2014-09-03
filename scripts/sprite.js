
(function() {
	function Sprite(url, width, height, ctx){
		this.url = url;
		this.width = width;
		this.height = height;
		this.ctx = ctx;
		this.index = 0;
		this.x = 0;
		this.y = 0;
	};

	Sprite.prototype = {
		update: function (state) {
			this.index = this.width*state;
		},

		clear: function() {
			this.ctx.clearRect(this.x,this.y,this.width,this.height);
		},

		render: function(x, y) {
			this.x = x;
			this.y = y;
			this.ctx.drawImage(resources.get(this.url),
							   this.index,0,
							   this.width, this.height,
							   x,		  y,
							   this.width,this.height);
		}
	};

	window.Sprite = Sprite;
})();