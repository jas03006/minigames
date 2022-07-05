var answer;
var answer_arr;
var num_len = 4;
var correct_color = "#22ff00";
var start_color = "#ff3333";

window.onload = main;

function main(){
	set_input_box();
	start_game(num_len);
}

function set_input_box(){
	var input_ = document.getElementById("myinput");
	input_.addEventListener("keyup", function(event){
		if(event.keyCode === 13){
			document.getElementById("submit_btn").click();
		}
	});
}

function generate_number(num_len){
	if(num_len < 2 || num_len > 9){
		return -1;
	}
	var digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
	answer = 0;
	var now;
	answer_arr=[];
	for(var i = 0; i < num_len; i++){
		now = Math.floor(Math.random() * digits.length);
		answer *=10;
		answer += digits[now];
		answer_arr.push(digits[now]);
		if(answer == 0){
			i--;
			answer_arr = [];
		}else{
			digits.splice(now,1);
		}
	}
	console.log(answer);
	//console.log(answer_arr);
}

function show_result(input, msg){//strike, ball, out){
	var table = document.getElementById("result_table");
	var row = table.insertRow(table.length);
	var result_cell = row.insertCell(0);
	var input_cell = row.insertCell(0);
	input_cell.innerHTML = input;
	if(msg == 0){
		result_cell.innerHTML = "Start New Game!";
		input_cell.style.backgroundColor = start_color;
		result_cell.style.backgroundColor = start_color; 		
	}else if(msg == 1){
		result_cell.innerHTML = "Correct!";
		input_cell.style.backgroundColor = correct_color;
		result_cell.style.backgroundColor = correct_color; 		
	}else{
		result_cell.innerHTML = msg; 
	}
	var table_div = document.getElementById("result_box");
	table_div.scrollTop = table_div.scrollHeight;
	return;
}

function check_input(){
	var myinput = document.getElementById("myinput"); 
	var input = myinput.value;
	myinput.value = "";
	myinput.focus();
	
	var temp = input;
	var now;
	var one_hot_arr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	var arr = [];
	var strike = 0;
	var ball = 0;
	var out = 0;
	for(var i = 0; i < num_len; i++){
		arr.push(0);
	}
	for(var i = 0; i < num_len-1; i++){
		now = temp%10;
		//console.log(temp + " " +temp%10);
		one_hot_arr[now] = one_hot_arr[now]+1;
		arr[num_len-i-1] = now;
		if(one_hot_arr[now] > 1){
			//console.log("Input should not have duplicate digits! "+input);
			show_result(input, "Input should not have duplicate digits! ");
			return;
		}
		temp = (temp- now)/10 ;
		if(temp < 1){
			//console.log("Input should be " +num_len +" digits! "+input);
			show_result(input, "Input should be " +num_len +" digits! ");
			return;
		}
	}
	now = temp%10;
	one_hot_arr[now] = one_hot_arr[now]+1;
	arr[0] = now;
	if(one_hot_arr[now] > 1){
		//console.log("Input should not have duplicate digits! "+input);
		show_result(input, "Input should not have duplicate digits! ");
		return;
	}
	temp = (temp- now)/10 ;
	if(temp > 1){
		//console.log("Input should be " +num_len +" digits! "+input);
		show_result(input, "Input should be " +num_len +" digits! ");
		return;
	}
	//console.log(one_hot_arr);
	//console.log(arr);
	for(var i = 0; i < num_len; i++){
		if(answer_arr[i] == arr[i]){
			strike++;
		}
		else if(one_hot_arr[answer_arr[i]] == 1){
			ball++;
		}else{
			out++;
		}
	}
	console.log(strike+"S "+ball+"B "+out+"O");
	if(strike == num_len){
		show_result(input, 1);
		start_game(num_len);
		return;
	}
	var msg = `${strike}S ${ball}B ${out}O`;
	show_result(input, msg);
	return;
}

function start_game(len){
	generate_number(len);
	var str = ""
	for(var i=0; i < len; i++){
		str += "?";
	}
	show_result(str,0);
}
