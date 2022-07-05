var game_select_box;

window.onload = main;

function main(){
	game_select_box = document.getElementById("game_select_box");
	create_game_buttons();
}

function create_game_buttons(){
	var now;
	//var l =Object.keys(games).length;
	for(var i in games){
		now = games[i];
		var new_game_button = document.createElement("button");
		new_game_button.innerHTML = now.name;
		new_game_button.className = "game_buttons";
		new_game_button.setAttribute("path", "./"+ now.mainpath);
		new_game_button.onclick = function(){
			window.location = this.getAttribute("path");
		}
		game_select_box.insertAdjacentElement("beforeend",new_game_button);
	}
}


	