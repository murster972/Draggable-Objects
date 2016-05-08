var isDown, curObject;
var objectCoords = [[0, 0], [100, 0], [200, 0], [300, 0], [400, 0]];
var connections = [[1, 2], [1, 3], [1, 4], [1, 5]];
curObject = -1;

$(document).ready(function(){
	$("#container").mousemove(mouseMove);
	$("#container").mousedown(function(e){
		curObject = whatObject(e);
		curObject = (curObject != -1) ? curObject + 1 : curObject;
		isDown = (curObject != -1) ? 1 : 0
	})

	$("#container").mouseup(function(e){
		isDown = 0;
		if(curObject != -1){
			objectCoords[curObject - 1] = [e.pageX, e.pageY];
		}
		curObject = -1;
	})

	connectObjects();
})

function mouseMove(e){
	if(isDown && curObject != -1){
		//-15 puts the cursor inside of the object as appose
		//to outside; when moving the object
		$("#object_" + curObject.toString()).css({"left": e.pageX + "px",
												  "top": e.pageY + "px"});
		/*if(curObject == 1){
			$("#connecter").css({"left": e.pageX + 12,
							     "top": e.pageY + 10});
		}*/
		var connects = whatConnecters(0);

		for(var i = 0; i < connects.length; i++){
			var c = connects[i];
			$("#connecter_" + connections[c][0] + connections[c][1]).css({"left": e.pageX + 12,
							     "top": e.pageY + 10});
		}

		objectCoords[curObject - 1] = [e.pageX, e.pageY];
		connectObjects();
	}
}

function whatConnecters(updating){
	//returns connecters relavent to curObj
	//:updating: indecates if length of connecters are being updated
	connects = []

	for(var i = 0; i < connections.length; ++i){
		if(connections[i][0] == curObject || (connections[i][1] == curObject) && updating){
			connects.push(i);
		}
	}

	return connects;
}

function whatObject(e){
	//returns object number if object else -1
	for(var i = 0; i < objectCoords.length; ++i){
		if((e.pageX >= objectCoords[i][0] - 20 && e.pageX <= objectCoords[i][0] + 20) && (e.pageY >= objectCoords[i][1] - 20 && e.pageY <= objectCoords[i][1] + 20)){
			return i;
		}
	}
	return -1;
}

function objectPosition(obj1, obj2){
	//returns postion(TL, TR, BL, BR) of obj2 in reference to 
	pos_y = ((objectCoords[obj1 - 1][1] - objectCoords[obj2 - 1][1]) > 0) ? "T" : "B";
	pos_x = ((objectCoords[obj1 - 1][0] - objectCoords[obj2 - 1][0]) > 0) ? "L" : "R";
	return pos_y + pos_x;
}

function connectObjects(){
	var obj1, obj2, pos, a, b, c, a, sina, adeg;

	//uses whatConnecters to get relative connecters so every connecter
	//doesn't have to be updated every time
	var connects = whatConnecters(1);

	for(var i = 0; i < connects.length; ++i){
		obj1 = connections[connects[i]][0] - 1;
		obj2 = connections[connects[i]][1] - 1;
		pos = objectPosition(obj1 + 1, obj2 + 1);
		//length of connecter	
		b = (pos[1] == "L") ? (objectCoords[obj1][0] - objectCoords[obj2][0]) : (objectCoords[obj2][0] - objectCoords[obj1][0]);
		c = (pos[0] == "T") ? (objectCoords[obj1][1] - objectCoords[obj2][1]) : (objectCoords[obj2][1] - objectCoords[obj1][1]);
		a = Math.pow(Math.pow(b, 2) + Math.pow(c, 2), 0.5);
		$("#connecter_" + (obj1 + 1) + (obj2 + 1)).width(a + "px");
		
		//angle of connecter
		sina = (Math.sin(90 * Math.PI / 180) / a) * b;
		a_deg = Math.round(((Math.asin(sina) / Math.PI) * 180) * 100 / 100);

		if(pos == "BR"){a_deg = 90 - a_deg}
		else if(pos == "BL"){a_deg = 90 + a_deg}
		else if(pos == "TL"){a_deg = 270 - a_deg}
		else if(pos == "TR"){a_deg = 270 + a_deg}
		
		$("#connecter_" + (obj1 + 1) + (obj2 + 1)).css("transform", "rotate(" + (a_deg) + "deg)");
	}
}