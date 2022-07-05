var map0 = [
[0,0,0,0,0,0,0,0,1],
[0,0,0,0,0,0,0,0,2],
[0,0,0,0,0,0,0,0,3],
[0,0,0,0,0,0,0,0,4],
[0,0,0,0,0,0,0,0,5],
[0,0,0,0,0,0,0,0,6],
[0,0,0,0,0,0,0,0,7],
[0,0,0,0,0,0,0,0,8],
[0,0,0,0,0,0,0,0,9]
];

var drop_button = document.getElementsByClassName("dropbtn")[0];
var difficulty = drop_button.value;
var temp = 0;

map_generate();

function clear_map(){
	for(var i = 0; i < map0.length; i++){
		for(var j = 0; j<map0[i].length; j++){
			map0[i][j] = 0;
		}
	}
} 

function map_generate(){
	clear_map();
	//console.log(map0);
	full_map_generate();
	//console.log(map0);
	temp=0;
	make_problem(difficulty);
	//console.log(map0);
	//console.log(temp);
}

function make_problem(dif){
	var eliminate_step = 36 + dif*17;
	var x;
	var y;
	var v;
	var c;
	if(eliminate_step <= 0){
		eliminate_step = 1;
	}
	for(var i = 0; i < eliminate_step; i++){
		x = Math.floor(Math.random() * map0.length);
		y = Math.floor(Math.random() * map0[0].length);
		v = map0[x][y];
		map0[x][y] = 0;
		c = cal_solution_cnt();
		if(c != 1){
			map0[x][y] = v;
		}else{
			temp++;
		}
	}
}
	
function cal_solution_cnt(){
	var availables;
	var cnt =0;
	for(var i = 0; i < map0.length; i++){
		for(var j = 0; j < map0[i].length; j++){
			if(map0[i][j] == 0){
				availables = get_availables(i,j);
				for(var k = 0; k < availables.length; k++){
					map0[i][j] = availables[k];
					if(is_full()){
						map0[i][j] = 0;
						return 1;
					}
					cnt += cal_solution_cnt();
				}
				map0[i][j] = 0;
				return cnt;
			}
		}
	}
}

function full_map_generate(){
	var availables;
	var b = false;
	for(var i = 0; i < map0.length; i++){
		for(var j = 0; j < map0[i].length; j++){
			if(map0[i][j] == 0){
				//console.log(i+", "+j);
				availables = get_availables(i, j);
				availables = shuffle(availables);
				//console.log(availables);
				for(var k =0; k < availables.length; k++){
					map0[i][j] = availables[k];
					if(map0[i][j] == 0){
						return false;
					}
					if(is_full()){ 
						return true;
					}
					if(full_map_generate()){
						return true;
					}
				}
				map0[i][j] = 0;
				b = true;
				break;
			}
		}
		if(b){
			break;
		}
	}
	return false;
}

function is_full(){
	for(var i = map0.length-1; i > -1; i--){
		for(var j = map0[i].length-1; j > -1; j--){
			if(map0[i][j] == 0){
				return false;
			}
		}
	}
	return true;
}

function eliminate_cell(i, j){
	var success = true;
	return success;
}

function shuffle(availables){
	if(availables.length == 0){
		return availables;
	}
	var ind;
	var r = [];
	for(var i = 0; i < availables.length; i++){
		ind = Math.floor(Math.random() * availables.length);
		r.push(availables[ind]);
		availables.splice(ind, 1);
	}
	return r;
}

function get_availables(x, y){
	var availables = new Array(1,2,3,4,5,6,7,8,9);
	var ind;
	
	for(var i = 0; i < map0.length; i++){
		ind = availables.indexOf(map0[i][y]);
		if(ind > -1){
			availables.splice(ind, 1);
		}
	}
	
	for(var j = 0; j < map0[x].length; j++){
		ind = availables.indexOf(map0[x][j]);
		if(ind > -1){
			availables.splice(ind, 1);
		}
	}
	
	var bx = x-x%3;
	var by = y-y%3;
	for(var i = bx; i < bx+3; i++){
		for(var j = by; j < by+3; j++){
			if(map0[i][j] != 0){
				ind = availables.indexOf(map0[i][j]);
				if(ind > -1){
					availables.splice(ind, 1);
				}
			}
		}
	}
	return availables;
}