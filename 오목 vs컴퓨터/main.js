var table_size = 19;
var table_point_distance = 3;
var is_black_turn = 1; 
var computer_turn = -1; //1이면 컴퓨터가 검은돌(선공), -1이면 하얀돌(후공)
var hover_color = "#e69b00";
var default_color = "#964b00";
var filled_color = "#ff1100";
var turn_count = 0;
var visual_table;
var stone_history = [];
var gomoku_cells = document.getElementsByClassName("gomoku_cell");
 
 
window.onload = main;

function main(){
	init_visual_table();
	init_actions();
	document.getElementById("restart_box").style.display="block";
}


function show_restart_box(){
	document.getElementById("restart_box").style.display="block";
	var victory_text;
	if(is_black_turn == computer_turn){
		victory_text = "컴퓨터 승!";
	}else{
		victory_text = "플레이어 승!";
	}
	document.getElementById("restart_back").innerText = victory_text;
}

function restart(){
	document.getElementById("restart_box").style.display="none";
	document.getElementById("restart_button").innerText ="재시작";
	init_stones();
	init_gomoku_cell();
	turn_count = 0;
	if(is_black_turn == computer_turn){
		computer_do();
	}
}

function change_order(){
	computer_turn *= -1;
	if(computer_turn == 1){
		document.getElementById("order_button").innerHTML="컴퓨터가 검은돌!";
		document.getElementById("order_button").style.color="white";
		document.getElementById("order_button").style.backgroundColor="black";
	}else{
		document.getElementById("order_button").innerHTML="컴퓨터가 하얀돌!";
		document.getElementById("order_button").style.color="black";
		document.getElementById("order_button").style.backgroundColor="white";
	}
}

function init_visual_table(){
	visual_table = document.getElementById("visual_table");
	var row_;
	var cell_;
	for(var i = 0; i < table_size; i++){
		row_ = visual_table.insertRow();
		row_.className = "gomoku_row";
		for(var j = 0; j < table_size; j++){
			cell_ = row_.insertCell();
			cell_.className = "gomoku_cell";
			cell_.name = i*100+j;
			cell_.value = 0;
			cell_.innerHTML = '<div class="stone"></div><table class="gomoku_cell_table"><tr><td class="cell1"></td><td class="cell2"></td></tr><tr><td class="cell3"></td><td class="cell4"></td></tr></table><div class="table_point"></div>';
		}
	}
	deco_visual_table();
}

function deco_visual_table(){
	for(var i = 0; i < table_size; i++){
		document.querySelector("#visual_table > tbody > tr:nth-child(1) > td:nth-child("+(i+1)+") > table > tbody > tr:nth-child(1) > td.cell1").style.borderRight = "none";
		document.querySelector("#visual_table > tbody > tr:nth-child("+(table_size)+") > td:nth-child("+(i+1)+") > table > tbody > tr:nth-child(2) > td.cell3").style.borderRight = "none";
		document.querySelector("#visual_table > tbody > tr:nth-child("+(i+1)+") > td:nth-child("+1+") > table > tbody > tr:nth-child(1) > td.cell1").style.borderBottom = "none";
		document.querySelector("#visual_table > tbody > tr:nth-child("+(i+1)+") > td:nth-child("+(table_size)+") > table > tbody > tr:nth-child(1) > td.cell2").style.borderBottom = "none";
	}
	for(var i = table_point_distance+1; i < table_size; i+=table_point_distance*2){
		for(var j = table_point_distance+1; j < table_size; j+=table_point_distance*2){
			document.querySelector("#visual_table > tbody > tr:nth-child("+i+") > td:nth-child("+j+") > div.table_point").style.backgroundColor = "black";
		}
	}
	var center_p = (table_size- table_size%2)/2  + 1;
	document.querySelector("#visual_table > tbody > tr:nth-child("+center_p+") > td:nth-child("+center_p+") > div.table_point").className = "big_table_point";	
}

function init_stones(){
	var stones = document.getElementsByClassName("stone");
	var stone;
	for(var i = 0; i < stones.length; i++){
		stone = stones[i];
		stone.style.backgroundColor="";
		stone.innerText = "";
	}
}

function init_actions(){
	init_gomoku_cell();
}

function init_gomoku_cell(){
	var gomoku_cells = document.getElementsByClassName("gomoku_cell");
	var gomoku_cell;
	for(var i = 0; i < gomoku_cells.length; i++){
		gomoku_cell = gomoku_cells[i];
		gomoku_cell.value = 0;
		gomoku_cell.onclick = gomoku_cell_click;
		gomoku_cell.onmouseover = gomoku_cell_onmouseover;
		gomoku_cell.onmouseout = gomoku_cell_onmouseout;
	}
}

function gomoku_cell_click(){
	this.focus();
	if(this.value != 0){
		return;
	}
	var n = this.name;
	var j_ = n%100;
	var i_ = (n-j_)/100;
	//console.log(`${i_}, ${j_}`);
	//console.log(this.value);
	this.value = is_black_turn;
	show_stone(this, is_black_turn);
	this.children[0].innerText = turn_count;
	add_history(i_, j_);
	visual_table = document.getElementById("visual_table");
	if(turn_count >= (table_size)*(table_size) || (is_omock() && check_line_length(i_, j_,5))){
		show_restart_box();
	}
	is_black_turn = is_black_turn*-1;
	if(is_black_turn == computer_turn){
		computer_do();
	}
}

function gomoku_cell_onmouseover(){
	if(this.value == 0){
		this.style.cursor = "pointer";
		show_stone(this, is_black_turn);
		this.style.backgroundColor = hover_color;
		this.children[0].style.opacity = 0.85;
	}else{
		this.style.backgroundColor = filled_color;
		this.children[0].style.opacity = 0.95;
	}
}
function gomoku_cell_onmouseout(){
	this.style.cursor = "default";
	this.style.backgroundColor = default_color;
	show_stone(this, this.value);
}
function show_stone(cell_, stone_color){
	var stone = cell_.children[0];
	if(stone_color == 1){
		stone.style.backgroundColor ="black";
		stone.style.color="white";
	}
	else if(stone_color == -1){
		stone.style.backgroundColor ="white";
		stone.style.color="black";
	}else if(stone_color == 0){
		stone.style.backgroundColor ="";
		stone.style.innerText="";
	}
	stone.style.opacity = 1;
}

function add_history(i_, j_){
	if(stone_history.length > turn_count){
		stone_history.splice(turn_count, stone_history.length);
	}
	stone_history.push([i_,j_]); //push index 0
	turn_count++; //turn_count should be 1
}

function undo(){
	if(turn_count==0 ||(computer_turn==1 && turn_count==1)){
		return;
	}
	for(var i = 0; i<2; i++){
		turn_count--;
		var x = stone_history[turn_count][0];
		var y = stone_history[turn_count][1];
		var cell_ = visual_table.rows[x].cells[y];
		cell_.value = 0;
		cell_.children[0].innerText = "";
		cell_.children[0].style.backgroundColor = "";
		is_black_turn = is_black_turn*-1;
	}
}

function redo(){
	if(turn_count == stone_history.length){
		return;
	}
	var x = stone_history[turn_count][0];
	var y = stone_history[turn_count][1];
	var cell_ = visual_table.rows[x].cells[y];
	cell_.value = is_black_turn;
	cell_.children[0].innerText = turn_count;
	show_stone(cell_, is_black_turn);
	is_black_turn = is_black_turn*-1;
	turn_count++;
}

function check_line_length(x, y, l){//돌(x,y)를 포함하고 길이가 l인 줄이 존재하는지 확인 
	if(check_line(x, y, 1, 1) + check_line(x, y, -1, -1) == l-1){
		return true;
	}
	if(check_line(x, y, 1, 0) + check_line(x, y, -1, 0) == l-1){
		return true;
	}
	if(check_line(x, y, 1, -1) + check_line(x, y, -1, 1) == l-1){
		return true;
	}
	if(check_line(x, y, 0, 1) + check_line(x, y, 0, -1) == l-1){
		return true;
	}
	return false;
}

function check_line(x, y, dx, dy){
	if(x+dx < 0 || x+dx > table_size-2 || y+dy < 0 || y+dy > table_size-2){
		console.log("OUT!");
		return 0;
	}
	if(visual_table.rows[x].cells[y].value == visual_table.rows[x+dx].cells[y+dy].value){
		return 1+check_line(x+dx, y+dy, dx, dy);
	}else{
		return 0;
	}
}

function is_omock(){
	return true;
}


function computer_do(){
	var now;
	var availables = [];
	var priority =[[],[],[],[],[]];
	var n, x, y, p;
	for(var i =0; i < gomoku_cells.length; i++){
		now = gomoku_cells[i];
		if(now.value == 0){
			n = now.name;
			y = n%100;
			x = (n-y)/100;
			p = check_adjacent_stone_priority(x, y);
			priority[p].push(now);
		}
	}
	//console.log(priority);
	for(var i =priority.length-1; i >0; i--){
		if(priority[i].length==0){
			continue;
		}
		priority[i][Math.floor(Math.random()*priority[i].length)].click();	
		return;
	}
	visual_table.rows[Math.floor(table_size/2)].cells[Math.floor(table_size/2)].click();//아무것도 없으면 중앙에 클릭
}

function check_adjacent_stone_priority(x, y){//돌(x,y)를 포함하고 길이가 l인 줄이 존재하는지 확인 
	var priority =0;
	var x_l = [-1, 0, 1];
	var y_l = [-1, 0, 1];
	var x_,y_;
	var temp_pri;
	var is_black;
	
	for(var i =0; i<3; i++){
		for(var j =0; j<3; j++){
			if(i==1 && j ==1){
				continue;
			}
			x_ = x+x_l[i];
			y_ = y+y_l[j];
			if(x_ < 0 || x_ > table_size-2 || y_ < 0 || y_ > table_size-2){
				continue;
			}
			is_black =visual_table.rows[x_].cells[y_].value;
			if(is_black ==0){
				continue;
			}
			temp_pri = computer_check_line_priority(x_, y_, x_l[i], y_l[j], is_black,1)+computer_check_line_priority(x+-1*x_l[i], y+-1*y_l[j], -1*x_l[i], -1*y_l[j], is_black,1);
			if(temp_pri > priority){
				priority = temp_pri;
			}
		}
	}
	return priority;
}

function computer_check_line_priority(x, y, dx, dy, is_black,l){//기본적으로 줄의 길이가 우선도
	if(x < 0 || x > table_size-2 || y < 0 || y > table_size-2){
		//console.log("OUT!");
		return 0;
	}
	if(visual_table.rows[x].cells[y].value != is_black){
		return 0;
	}
	if(x+dx < 0 || x+dx > table_size-2 || y+dy < 0 || y+dy > table_size-2){
		//console.log("OUT!");
		return l-1;//막혀있으면 길이에서 1을 뺀다.
	}
	if(is_black == visual_table.rows[x+dx].cells[y+dy].value){
		return computer_check_line_priority(x+dx, y+dy, dx, dy, is_black, l+1);
	}else if(0 == visual_table.rows[x+dx].cells[y+dy].value){//열려있으면
		return l;//+computer_check_line_priority(x+2*dx, y+2*dy, dx, dy, is_black, 1);
	}else{
		return l-1;//막혀있으면
	}
}

