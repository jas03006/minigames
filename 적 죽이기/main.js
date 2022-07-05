var character;
var scoreboard;
var image_path = "./image";
var attacks;
var enemies;
window.onload = main;

function main(){
	scoreboard = document.getElementById("scoreboard");
	character = document.getElementById("character");
	load_charcter(0);
	work_box = document.getElementById("work_box");
	init_frame_timer();
}

//각 변수들은 필요에 따라 바꿀수있게 하드코딩 보다는 사용자입력/ 스테이지파일에서 가져오게 바꿀 것.


//키입력값과 캐릭터 움직임 거리계산을 위한 변수
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
var enemy_regen_cooltime = 2000;

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
	if(attack_cool_timer > attack_cool && (keymap[32]||keymap[81])){ //어택마다 키코드를 정하여 배열화 시켜서 체크하도록 바꿀것.
		if(keymap[32]){ //spacebar
			shoot(0);
		}else if(keymap[81]){ //q
			shoot(1);
		}
		//keymap[32] = false;
		//keymap[113] = false;
		attack_cool_timer = 0;
	}else{
		attack_cool_timer += refresh_time;
	}
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
		character.style.left = character.style.left.slice(0,-2) - dl +'px';
		if((character.style.top.slice(0,-2)>=bottom_bound && dt<0) || (character.style.top.slice(0,-2)<=0 && dt>0)){
			dt = 0;
		}
		character.style.top = character.style.top.slice(0,-2) - dt + 'px';
	}
	load_stage(0);//스테이지에 따른 몹생성
	attacks_move();
}

function load_charcter(n){
	character.className = "character";
	character.classList.add(character_db[n]["className"]);
	
	character.style.position = "absolute";
	character.style.left = "425px";
	character.style.top = "700px";

	character.style.width = character_db[n]["width"];
	character.style.height = character_db[n]["height"];
	attack_cool = character_db[n]["attack_cool"];
	character_speed = character_db[n]["character_speed"];
}

function load_stage(n){
	if(enemy_regen_cooltimer >= enemy_regen_cooltime){
		create_enemy(Math.floor(0.5+Math.random())); //스테이지 파일을 만들고, 해당 스테이지 파일을 읽어서 적을 생성하는 인터프리팅 함수를 만들것.
		enemy_regen_cooltimer%=enemy_regen_cooltime;
		//enemy_regen_cooltime = 20000;
	}
	enemy_regen_cooltimer+=refresh_time;
}

function shoot(n){
	if(character.style.backgroundColor == "yellow"){
		character.style.backgroundColor = "red";
	}else{
		character.style.backgroundColor = "yellow";
	}
	create_attack(n);
}
function create_attack(n){ //어택마다 id넘버와 각 설정값을 가진 db를 만들어 함수 하나와 id만으로 어택을 생성할 수 있도록 할 것.
	var new_attack = document.createElement("div");
	new_attack.className = "attack";
	new_attack.classList.add(attack_db[n]["className"]);
	new_attack.style.left = parseFloat(character.style.left.slice(0,-2)) + parseFloat(character.style.width.slice(0,-2))/2.0 - parseFloat(attack_db[n]["width"].slice(0,-2))/2.0 +'px';
	new_attack.style.top = character.style.top.slice(0,-2) - parseFloat(attack_db[n]["height"].slice(0,-2))/1.5 +'px';
	new_attack.style.width= attack_db[n]["width"];
	new_attack.style.height= attack_db[n]["height"];
	new_attack.style.backgroundColor = attack_db[n]["backgroundColor"];
	new_attack.setAttribute("data-direction", attack_db[n]["direction"]); //direction
	new_attack.setAttribute("data-speed", attack_db[n]["speed"]); //초당 픽셀 속도
	new_attack.setAttribute("data-fuel", attack_db[n]["fuel"]); 
	new_attack.setAttribute("data-damage", attack_db[n]["damage"]); 
	work_box.insertBefore(new_attack, character);
}

function attacks_move(){
	attacks = document.getElementsByClassName("attack");
	enemies = document.getElementsByClassName("enemy");
	for(var i = 0; i < attacks.length; i++){
		now = attacks[i];
		if(now.getAttribute("data-fuel") < 0){ //연료가 다되면 터진다.
			attack_bomb(now);
			//check_attacked(now);
		}else{
			attack_move(now);
		}
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
	//for(var j = 0; j < now.getAttribute("data-speed"); j++){
		var d= now.getAttribute("data-speed")*refresh_time/1000.0;
		now.style.top = now.style.top.slice(0,-2) - d + "px";
		now.setAttribute("data-fuel", now.getAttribute("data-fuel")-d);
		check_attacked(now);
	//}
}


function check_attacked(atk){//각 어택별로 모든 에너미와 비교하여 겹치는지 체크 
	var now_enemy;
	var used = false;
	var l,r,t,b;
	var dmg = parseFloat(atk.getAttribute("data-damage"));
	var a_l = parseFloat(atk.style.left.slice(0,-2));
	var a_r = parseFloat(atk.style.left.slice(0,-2)) + parseFloat(atk.style.width.slice(0,-2)); 
	var a_t = parseFloat(atk.style.top.slice(0,-2));
	var a_b = parseFloat(atk.style.top.slice(0,-2)) + parseFloat(atk.style.height.slice(0,-2));
	for(var i = 0; i < enemies.length; i++){
		now_enemy = enemies[i];
		l = parseFloat(now_enemy.style.left.slice(0,-2));
		r = parseFloat(now_enemy.style.left.slice(0,-2)) +parseFloat(now_enemy.style.width.slice(0,-2)); 
		t = parseFloat(now_enemy.style.top.slice(0,-2));
		b = parseFloat(now_enemy.style.top.slice(0,-2)) + parseFloat(now_enemy.style.height.slice(0,-2));
		if(a_l <= r && r <= a_r){
			if(a_t <= t && t <= a_b){
				attacked(now_enemy, atk);
			}
			else if(a_t <= b && b <= a_b){
				attacked(now_enemy, atk);
			}
		}
		else if(a_l <= l && l <= a_r){
			if(a_t <= t && t <= a_b){
				attacked(now_enemy, atk);
			}
			else if(a_t <= b && b <= a_b){
				attacked(now_enemy, atk);
			}
		}
		else if(l <= a_r && a_r <= r){
			if(t <= a_t && a_t <= b){
				attacked(now_enemy, atk);
			}
			else if(t <= a_b && a_b <= b){
				attacked(now_enemy, atk);
			}
		}
		else if(l <= a_l && a_l <= r){
			if(t <= a_t && a_t <= b){
				attacked(now_enemy, atk);
			}
			else if(t <= a_b && a_b <= b){
				attacked(now_enemy, atk);
			}
		}
	}
	return;
}

function create_enemy(n){ 
	//에너미도 db를 만들어 id만 있으면 에너미를 만들수 있도록 할 것.
	//적도 공격할 수 있게 할 것.
	//적의 공격과 아군의 공격을 구분하여 적용시킬 것.
	var new_enemy = document.createElement("div");
	new_enemy.innerHTML = `<div class="hp_bar"></div><img src="${image_path}`+'/'+enemy_db[n]["img"]+'">';
	new_enemy.className = "enemy";
	new_enemy.classList.add(enemy_db[n]["className"]);
	new_enemy.style.left = 100 + Math.random()*1400 +'px';
	new_enemy.style.top = 300 - Math.random()*250 +'px';
	new_enemy.style.width= enemy_db[n]["width"];
	new_enemy.style.height= enemy_db[n]["height"];
	new_enemy.setAttribute("data-totalhp", enemy_db[n]["totalhp"]);
	new_enemy.setAttribute("data-hp", enemy_db[n]["hp"]);
	//new_enemy.style.width= "50px";
	//new_enemy.style.height= "50px";
	//new_enemy.setAttribute("data-totalhp", 10);
	//new_enemy.setAttribute("data-hp", 10);
	new_enemy.children[0].style.width = parseFloat(new_enemy.getAttribute("data-hp"))/parseFloat(new_enemy.getAttribute("data-totalhp"))*100+"%";
	work_box.insertBefore(new_enemy, character);
	
}

function attacked(enemy, atk){
	var dmg = atk.getAttribute("data-damage");
	//console.log(dmg);
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