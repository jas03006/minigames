var character;
var scoreboard;
var image_path = "./image";
var attacks;
var enemies;
var now_gun;
var maxt,mint,maxl,minl;
window.onload = main;

function main(){
	scoreboard = document.getElementById("scoreboard");
	character = document.getElementById("character");
	load_gun(0);
	work_box = document.getElementById("work_box");
	mint = work_box.getBoundingClientRect().top;
	minl = work_box.getBoundingClientRect().left;
	maxt = work_box.getBoundingClientRect().bottom;
	maxl = work_box.getBoundingClientRect().right;
	console.log(` ${maxt}, ${mint}, ${maxl}, ${minl}`);
	window.requestAnimationFrame(animation_frame);
	//init_frame_timer();
}

//각 변수들은 필요에 따라 바꿀수있게 하드코딩 보다는 사용자입력/ 스테이지파일에서 가져오게 바꿀 것.


var keymap = {};
var dl;
var dt;

var timerIntervalId; //프레임 새로고침을 위한 변수
var attack_cool_timer=0;
var enemy_regen_cooltimer = 0;

var refresh_time = 20; //프레임 새로고침 시간간격 (ms)
//내 캐릭터의 스펙
var attack_cool;
var character_speed;

//맵의 스펙
var bottom_bound = 810;
var enemy_regen_cooltime = 1000;

var score = 0;

var now;

document.onkeydown = document.onkeyup = function(e){
	var keyCode = e.keyCode;
	//console.log(keyCode);
	keymap[keyCode] = (e.type == "keydown");
};

var start = null;
function animation_frame(timestamp){
	if(!start){
		start = timestamp;
	}
	var dt = timestamp - start;
	start = timestamp;
	if(attack_cool_timer > attack_cool && (keymap[32]||keymap[81])){ //어택마다 키코드를 정하여 배열화 시켜서 체크하도록 바꿀것.
		if(keymap[32]){ //spacebar
			shoot(0);
		}else if(keymap[81]){ //q
			shoot(1);
		}
		attack_cool_timer = 0;
	}else{
		attack_cool_timer += refresh_time;
	}
	load_stage(0, dt);//스테이지에 따른 몹생성
	enemies_move(dt);
	window.requestAnimationFrame(animation_frame);
}

function load_gun(n){
	now_gun = document.createElement("div");
	now_gun.setAttribute("data-damage", gun_db[n]["damage"]); 
	attack_cool = gun_db[n]["attack_cool"];
}

function load_stage(n, dt){
	//console.log(dt);
	enemy_regen_cooltimer+=dt;
	if(enemy_regen_cooltimer >= enemy_regen_cooltime){
		create_enemy(Math.floor(Object.keys(enemy_db).length*Math.random())); //스테이지 파일을 만들고, 해당 스테이지 파일을 읽어서 적을 생성하는 인터프리팅 함수를 만들것.
		enemy_regen_cooltimer%=enemy_regen_cooltime;
		//enemy_regen_cooltime = 20000;
	}
}

function create_enemy(n){ 
	//에너미도 db를 만들어 id만 있으면 에너미를 만들수 있도록 할 것.
	//적도 공격할 수 있게 할 것.
	//적의 공격과 아군의 공격을 구분하여 적용시킬 것.
	var x,y,sc;
	var new_enemy = document.createElement("div");
	new_enemy.innerHTML = `<div class="hp_bar"></div><img src="${image_path}`+'/'+enemy_db[n]["img"]+'">';
	new_enemy.className = "enemy";
	new_enemy.classList.add(enemy_db[n]["className"]);
	new_enemy.style.left = 450 + Math.random()*700 +'px';
	new_enemy.style.top = 650 - Math.random()*400 +'px';
	new_enemy.style.width= enemy_db[n]["width"];
	new_enemy.style.height= enemy_db[n]["height"];
	new_enemy.setAttribute("data-totalhp", enemy_db[n]["totalhp"]);
	new_enemy.setAttribute("data-hp", enemy_db[n]["hp"]);
	
	x=Math.random()*3-1;
	y=Math.random()*3-1;
	while(x==0 && y==0){
		x=Math.random()*3-1;
		y=Math.random()*3-1;
	}
	sc = Math.sqrt(x*x+y*y);
	x /= sc;
	y /= sc;
	//sc = x*x+y*y;
	//console.log(sc);
	new_enemy.setAttribute("data-directionX", x); //direction
	new_enemy.setAttribute("data-directionY", y); //direction
	new_enemy.setAttribute("data-speed", enemy_db[n]["speed"]); //초당 픽셀 속도
	
	new_enemy.children[0].style.width = parseFloat(new_enemy.getAttribute("data-hp"))/parseFloat(new_enemy.getAttribute("data-totalhp"))*100+"%";
	new_enemy.onmousedown = function(){attacked(new_enemy, now_gun);};
	work_box.insertBefore(new_enemy, character);
	
}

function attacked(enemy, atk){
	var dmg = atk.getAttribute("data-damage");
	console.log(dmg);
	var old_hp = parseFloat(enemy.getAttribute("data-hp"));
	enemy.setAttribute("data-hp", old_hp - dmg);
	var new_hp = parseFloat(enemy.getAttribute("data-hp"));
	var total_hp = parseFloat(enemy.getAttribute("data-totalhp"));
	//console.log(old_hp);
	//console.log(total_hp);
	if(new_hp <= 0){
		enemy.remove();
		score++;
		update_scoreboard();
		enemies = document.getElementsByClassName("enemy");
		return;
	}
	if(total_hp > new_hp){
		enemy.children[0].style.backgroundColor = "orange";
	}else{
		enemy.children[0].style.backgroundColor = "green";
	}
	enemy.children[0].style.width = new_hp/total_hp*100.0+"%";
	//console.log(enemy.children[0].style.width);
	atk.remove();
}

function update_scoreboard(){
	scoreboard.innerHTML = score;
}


function enemies_move(dt){
	enemies = document.getElementsByClassName("enemy");
	for(var i = 0; i < enemies .length; i++){
		now = enemies [i];
		enemy_move(now, dt);
	}
}

async function enemy_move(now, dt){
	var d= now.getAttribute("data-speed")*dt/1000.0;
	var t,l;
	t = now.style.top.slice(0,-2);
	l = now.style.left.slice(0,-2);
	now.style.top = t - d*now.getAttribute("data-directionY") + "px";
	now.style.left = l - d*now.getAttribute("data-directionX") + "px";
	if(now.getBoundingClientRect().bottom >= maxt || t <= mint || now.getBoundingClientRect().right >= maxl || l <= minl){
		now.remove();
	}
}
