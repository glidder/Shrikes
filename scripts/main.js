var FPS = 30;
var gameWidth = 480;
var gameHeight = 432;

(function () {

	//Game Variables////////////////////////
	var mainContext = document.getElementById("mainCanvas").getContext("2d");
	var playerContext = document.getElementById("playerCanvas").getContext("2d");
	var enemyContext = document.getElementById("enemyCanvas").getContext("2d");
	var weatherContext = document.getElementById("weatherCanvas").getContext("2d");
	
	//Game State
	var finShow = 0;
	var gameOver;
	var keys = [];
	var enemy;
	var player;
	var background;
	var grenades = [];

	//Game Loop/////////////////////////////
	function main() {
		update();
		render();
		if(gameOver){
			window.fTime = Date.now();
			endGame(fTime);
		} else {
			requestAnimFrame(main);
		}
	};

	function start() {
		intro();
		//_reset();
		//main();
	}

	function init() {
		loadingScreen();

		resources.load([
			'images/player.png',
			'images/backTiles.png',
			'images/enemy.png',
			'images/grenade.png',
			'images/explosion.png',
			'images/front.png',
			'images/artillery.png',
			'images/backProps.png'
		]);
		resources.onReady(start);
	}

	function update() {
		//Input_____________________________
		if(keys[65]){			   // 'a' //
			if(player.shoot()){
				enemy.killed(player.x+96,player.reach,1);
			}
		}
		else if(keys[83]){		   // 's' //
			if(player.throwGrenade()){
				grenades.push(new Grenade(player.reach,weatherContext));
			}
		}
		else if(keys[40]){		   //down //
			player.crouch();
		}
		else if(keys[38]){		   // up  //
			if(player.charge()){
				background.advance(player.speed);
				enemy.advance(player.speed);
				enemy.killed(player.x,player.x+96);
				for(i in grenades){
					grenades[i].advance(player.speed);
				}
			}
		}
		else if(keys[39]){		   //right//
			if(player.walk()){
				background.advance(player.speed);
				enemy.advance(player.speed);
				for(i in grenades){
					grenades[i].advance(player.speed);
				}
			}
		}
		else {					   //none //
			player.idle();
		}

		//Entities__________________________
		for(j=grenades.length-1;j>=0;--j){
			if(grenades[j].update()){
				enemy.killed(grenades[j].x-grenades[j].reach,
							 grenades[j].x+(grenades[j].reach),0);
			}
			if(grenades[j].done){
				grenades.splice(j,1);
			}
		}
		if(player.hit(enemy.update(player.cover()))){
			gameOver = true;
		}
	}

	function render() {
		player.render();
		enemy.render();
		background.render();
		for (j in grenades){
			grenades[j].render();
		}
	}

	//Auxiliary Functions///////////////////
	function _reset() {
		window.iTime = Date.now();
		player = new Player(playerContext);
		enemy = new Enemy(enemyContext,player.x+96);
		background = new Background(gameWidth,gameHeight,mainContext);
		mainContext.clearRect(0,0,gameWidth,gameHeight);
		playerContext.clearRect(0,0,gameWidth,gameHeight);
		enemyContext.clearRect(0,0,gameWidth,gameHeight);
		weatherContext.clearRect(0,0,gameWidth,gameHeight);
		grenades=[];
		keys=[];
		finShow=0;
		gameOver=false;
		main();
	}

	function endGame() {
		if(finShow==0){
			weatherContext.font = "bold 25px arial";
			weatherContext.textAlign = 'center';
			weatherContext.fillStyle = "#6f584d";
			weatherContext.fillText("You avoided death for "+Math.floor((window.fTime-window.iTime)/1000)+" seconds.",
									gameWidth/2, (gameHeight/2)-54);
			weatherContext.fillText("With a cost of "+enemy.tDeaths+" other lifes.",
									gameWidth/2, (gameHeight/2));
			weatherContext.fillText("Press \"a\" to restart.",
									gameWidth/2, (gameHeight-50));
			player=null;
			enemy=null;
			background=null;
			grenades=null;
			finShow=1;
		}
		if(!keys[65]||finShow<90){
			++finShow;
			requestAnimFrame(endGame);
		}
		else{
			_reset();
		}
	}

	function intro() {
		if(finShow==0){
		mainContext.drawImage(resources.get('images/front.png'),0,0);
		mainContext.font = "bold 25px arial";
		mainContext.textAlign = 'center';
		mainContext.fillStyle = '#f2e5b9';
		mainContext.fillText("Press \"a\" to start.",gameWidth/2,(gameHeight-50));
		++finShow;
		}
		if(!keys[65]){
			requestAnimFrame(intro);
		}
		else{
			_reset();
		}

	}

	function loadingScreen() {
		mainContext.font = "bold 50px arial";
		mainContext.textAlign = 'center';
		mainContext.fillStyle = "#c5a162";
		mainContext.fillText("Loading...", gameWidth/2, gameHeight/2);
	}

	//Input Listeners///////////////////////
	$(document).keydown(function(e){
		keys[e.KeyCode ? e.keyCode : e.which] = true;
		e.preventDefault();
	});

	$(document).keyup(function(e){
		delete keys[e.KeyCode ? e.keyCode : e.which];
	});

	init();
})();
	
	//Cross-browser compativility///////////
window.requestAnimFrame = (function(){
	return	window.requestAnimationFrame		||
			window.webkitRequestAnimationFrame	||
			window.mozRequestAnimationFrame		||
			window.oRequestAnimationFrame		||
			window.msRequestAnimationFrame		||
			function(callback){
				window.setTimeout(callback, 1000 / FPS);
			};
})();