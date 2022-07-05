var character;
var scoreboard;
var image_path = "./image";
var enemies;
var work_box;
var max_l, min_l, max_t, min_t;
var stage_score=[0,200,1300,2400,3500,4600];

window.onload = main;
function main(){
	scoreboard = document.getElementById("scoreboard");
	character = document.getElementById("character");
	work_box = document.getElementById("work_box");
	max_l = 2300;  //work_box.style.left.slice(0,-2);
	min_l = 0;//work_box.style.left.slice(0,-2) + 0.0 + work_box.style.width.slice(0,-2);
	max_t = 1100//work_box.style.top.slice(0,-2);
	min_t = -100; //work_box.style.top.slice(0,-2) - work_box.style.height.slice(0,-2);
	//console.log(work_box.position);
	load_charcter(0);
	
}
function start(){
	document.getElementById("start_button").style.display = "none";
	document.getElementById("retry_button").style.display = "block";
	warning_msg.style.display = "none";
	init_frame_timer();
}
//각 변수들은 필요에 따라 바꿀수있게 하드코딩 보다는 사용자입력/ 스테이지파일에서 가져오게 바꿀 것.


//키입력값과 캐릭터 움직임 거리계산을 위한 변수
var keymap = {};
var dl;
var dt;

var timerIntervalId; //프레임 새로고침을 위한 변수
var attack_cool_timer = 0;

var refresh_time = 20; //프레임 새로고침 시간간격 (ms)
//내 캐릭터의 스펙
var character_speed;

//맵의 스펙
var bottom_bound = 840;
var attack_cool = 250.0;
var min_attack_cool = 30.0;

var score = 0;

var now;

document.onkeydown = document.onkeyup = function(e){
	var keyCode = e.keyCode;
	//console.log(keyCode);
	keymap[keyCode] = (e.type == "keydown");
};

function init_frame_timer(){
	clearInterval(timerIntervalId);
	timerIntervalId = setInterval(update_frame, refresh_time);
}
function update_frame(){
	if(keymap[37]){
		dl = character_speed;
	}else if(keymap[39]){
		dl = -1*character_speed;
	}else{
		dl = 0;
	}
	if(keymap[40]){
		dt = -1*character_speed;
	}else if(keymap[38]){
		dt = character_speed;
	}else{
		dt = 0;
	}
	if(keymap[37]||keymap[38]||keymap[39]||keymap[40]){
		if((character.style.left.slice(0,-2)-dl <= 0 && dl>0) || (character.style.left.slice(0,-2)-dl >=1540 && dl<0)){
			dl = 0;
		}
		character.style.left = character.style.left.slice(0,-2) - dl +'px';
		if((character.style.top.slice(0,-2)>=bottom_bound && dt<0) || (character.style.top.slice(0,-2)<=0 && dt>0)){
			dt = 0;
		}
		character.style.top = character.style.top.slice(0,-2) - dt + 'px';
	}
	load_stage(0);//스테이지에 따른 몹생성
	score++;
	update_scoreboard();
	attack_cool -= refresh_time/1000.0;
	if(attack_cool < min_attack_cool){
		attack_cool = min_attack_cool;
	}
	attacks_move();
}

function load_charcter(n){
	character.className = "character";
	character.classList.add(character_db[n]["className"]);
	
	character.style.position = "absolute";
	character.style.left = "725px";
	character.style.top = "400px";

	character.style.width = character_db[n]["width"];
	character.style.height = character_db[n]["height"];
	character_speed = character_db[n]["character_speed"];
}

function load_stage(n){
	if(attack_cool_timer >= attack_cool && score>=0){
		for(var i = 0; i < stage_score.length; i++){
			if(score>=stage_score[i]){
				create_attack(Math.floor(Math.random()*Object.keys(attack_db).length));
			}
		}
		//스테이지 파일을 만들고, 해당 스테이지 파일을 읽어서 적을 생성하는 인터프리팅 함수를 만들것.
		attack_cool_timer%=attack_cool;
		//enemy_regen_cooltime = 20000;
	}
	attack_cool_timer+=refresh_time;
}
function create_attack(n){ 
	var new_attack = document.createElement("div");
	var x,y;
	new_attack.innerHTML = `<div class="hp_bar"></div><img src="${image_path}`+'/'+attack_db[n]["img"]+'">';
	new_attack.className = "attack";
	new_attack.classList.add(attack_db[n]["className"]);
	x=Math.floor(Math.random()*2);
	y=Math.floor(Math.random()*2);
	new_attack.style.left = -100+ Math.random()*1700*x*!(x*y) +Math.random()*1700*!(x+y) + 1700*(x*y) +'px';
	new_attack.style.top = 900 - Math.random()*1000*y -1000*!(x+y) +'px';
	new_attack.style.width= attack_db[n]["width"];
	new_attack.style.height= attack_db[n]["height"];
	new_attack.style.backgroundColor = attack_db[n]["backgroundColor"];
	x=Math.random()*3-1;
	y=Math.random()*3-1;
	while(x==0 && y==0){
		x=Math.random()*3-1;
		y=Math.random()*3-1;
	}
	new_attack.setAttribute("data-directionX", x); //direction
	new_attack.setAttribute("data-directionY", y); //direction
	new_attack.setAttribute("data-speed", attack_db[n]["speed"]); //초당 픽셀 속도
	new_attack.setAttribute("data-warning", attack_db[n]["warning"]); 
	work_box.insertBefore(new_attack, character);
}

function attacks_move(){
	attacks = document.getElementsByClassName("attack");
	for(var i = 0; i < attacks.length; i++){
		now = attacks[i];
		attack_move(now);
	}
}

async function attack_bomb(now){
	if(now.style.width.slice(0,-2) > 50){
		now.remove();
		return;
	}
	now.style.width = now.style.width.slice(0,-2) - -4 + "px";
	now.style.height = now.style.height.slice(0,-2) - -4 + "px";
	now.style.left = now.style.left.slice(0,-2) - 2 + "px";
	now.style.top = now.style.top.slice(0,-2) - 2 + "px";
}

async function attack_move(now){
	var d= now.getAttribute("data-speed")*refresh_time/1000.0;
	now.style.top = now.style.top.slice(0,-2) - d*now.getAttribute("data-directionY") + "px";
	now.style.left = now.style.left.slice(0,-2) - d*now.getAttribute("data-directionX") + "px";
	check_attacked(now);
}


function check_attacked(atk){//각 어택별로 모든 에너미와 비교하여 겹치는지 체크 
	var used = false;
	var l,r,t,b;
	var a_l = parseFloat(atk.style.left.slice(0,-2));
	var a_r = parseFloat(atk.style.left.slice(0,-2)) + parseFloat(atk.style.width.slice(0,-2)); 
	var a_t = parseFloat(atk.style.top.slice(0,-2));
	var a_b = parseFloat(atk.style.top.slice(0,-2)) + parseFloat(atk.style.height.slice(0,-2));
	l = parseFloat(character.style.left.slice(0,-2));
	r = parseFloat(character.style.left.slice(0,-2)) +parseFloat(character.style.width.slice(0,-2)); 
	t = parseFloat(character.style.top.slice(0,-2));
	b = parseFloat(character.style.top.slice(0,-2)) + parseFloat(character.style.height.slice(0,-2));
	if(a_l <= r && r <= a_r){
		if(a_t <= t && t <= a_b){
			attacked(character, atk);
		}
		if(a_t <= b && b <= a_b){
			attacked(character, atk);
		}
	}
	if(a_l <= l && l <= a_r){
		if(a_t <= t && t <= a_b){
			attacked(character, atk);
		}
		if(a_t <= b && b <= a_b){
			attacked(character, atk);
		}
	}
	if(l <= a_r && a_r <= r){
		if(t <= a_t && a_t <= b){
			attacked(character, atk);
		}
		if(t <= a_b && a_b <= b){
			attacked(character, atk);
		}
	}
	if(l <= a_l && a_l <= r){
		if(t <= a_t && a_t <= b){
			attacked(character, atk);
		}
		if(t <= a_b && a_b <= b){
			attacked(character, atk);
		}
	}
}

function create_enemy(n){ 
	var new_enemy = document.createElement("div");
	new_enemy.innerHTML = `</div><img src="${image_path}`+'/'+enemy_db[n]["img"]+'">';
	new_enemy.className = "enemy";
	new_enemy.classList.add(enemy_db[n]["className"]);
	new_enemy.style.left = 100 + Math.random()*1500 +'px';
	new_enemy.style.top = 850 - Math.random()*800 +'px';
	new_enemy.style.width= enemy_db[n]["width"];
	new_enemy.style.height= enemy_db[n]["height"];
	work_box.insertBefore(new_enemy, character);
	
}

function attacked(enemy, atk){
	//enemy.remove();
	clearInterval(timerIntervalId);
	var warning_msg = document.getElementById("warning_msg");
	warning_msg.style.display = "block";
	warning_msg.children[0].innerText = atk.getAttribute("data-warning");
	return;
}

function retry(){
	warning_msg.style.display = "none";
	warning_msg.children[0].innerText = "적들을 피하세요!";
	score = 0;
	attacks_remove();
	main();
	start();
}

function update_scoreboard(){
	scoreboard.innerHTML = score;
}

function attacks_remove(){
	attacks = document.getElementsByClassName("attack");
	for(var i = 0; i < attacks.length; i++){
		now = attacks[i];
		now.remove();
		i--;
	}
}