var isDown, curObject;
var objectCoords = [[300, 100], [100, 0]];
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
		if(curObject == 1){
			$("#connecter").css({"left": e.pageX + 12,
							     "top": e.pageY + 10});
		}

		objectCoords[curObject - 1] = [e.pageX, e.pageY];
		connectObjects();
	}
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
	//returns postion(TL, TR, BL, BR) of obj2 in reference to obj1
	pos_y = ((objectCoords[obj1 - 1][1] - objectCoords[obj2 - 1][1]) > 0) ? "T" : "B";
	pos_x = ((objectCoords[obj1 - 1][0] - objectCoords[obj2 - 1][0]) > 0) ? "L" : "R";
	return pos_y + pos_x;
}

function connectObjects(){
	//curently only works with object1 on top
	pos = objectPosition(1, 2);
	//length of connecter
	//a^2 = b^2 + c^2
	b = (pos[1] == "L") ? (objectCoords[0][0] - objectCoords[1][0]) : (objectCoords[1][0] - objectCoords[0][0]);
	c = (pos[0] == "T") ? (objectCoords[0][1] - objectCoords[1][1]) : (objectCoords[1][1] - objectCoords[0][1]);
	//c = objectCoords[1][1] - objectCoords[0][1];
	//a = b + c;
	a = Math.pow(Math.pow(b, 2) + Math.pow(c, 2), 0.5);
	$("#connecter").width(a + "px");
	//console.log(b, c, a);

	//angle of connceter for object1
	sina = (Math.sin(90 * Math.PI / 180) / a) * b;
	a_deg = Math.round(((Math.asin(sina) / Math.PI) * 180) * 100 / 100);

	if(pos == "BR"){a_deg = 90 - a_deg}
	else if(pos == "BL"){a_deg = 90 + a_deg}
	else if(pos == "TL"){a_deg = 270 - a_deg}
	else if(pos == "TR"){a_deg = 270 + a_deg}

	$("#connecter").css("transform", "rotate(" + (a_deg) + "deg)");
}