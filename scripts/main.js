//stores nodes an theire coords
var nodes = {}
//stores list of all node numbers in use
var	active_nodes = [];
var nodeCntr = 0;
var removingNode = 0;
var removeNodes = []
var curNode = -1;
var isDown = 0;
var connecters = [];
var newConnecters = [];
var addingConnecters = 0;
var removingConnecters = 0;
var connectersToRemove = [];

$(document).ready(function(){
	$(".act_butn.add_node").click(addNode);
	$(".act_butn.remove_node").click(removeNode);
	$(".act_butn.add_connecter").click(addConnecters);
	$("#container").mousemove(mouseMove);
	$("#container").mousedown(function(e){
		if(removingNode == 0 && addingConnecters == 0){
			curNode = whatNode(e);
			curNode = (curNode != -1) ? curNode : curNode;
			isDown = (curNode != -1) ? 1 : 0;
			if(curNode != -1){
				$("#node_" + curNode).css("border", "3px solid #323A45");
			}
		}
	})
	$("#container").mouseup(function(e){
		if(removingNode == 0 && addingConnecters == 0){
			isDown = 0;
			if(curNode != -1){
				nodes[curNode] = [e.pageX, e.pageY];
				$("#node_" + curNode).css("border", "0px solid #323A45");
			}

			updateConnections();
			curNode = -1;
		}
	})
	$("#container").click(function(e){
		if(removingNode){
			var node = whatNode(e);
			if(node != -1){
				if(removeNodes.indexOf(node) != -1){
					$("#node_" + node).css("border", "none");
					removeNodes[removeNodes.indexOf(node)] = -1;
				}
				else{
					removeNodes.push(node);
					$("#node_" + node).css("border", "3px solid #ED6454");
				}
			}
		}
		if(addingConnecters){
			var node = whatNode(e);
			if(node != -1){
				if(newConnecters.indexOf(node) != -1){
					$("#node_" + node).css("border", "none");
					newConnecters[newConnecters.indexOf(node)] = -1;
				}
				else{
					newConnecters.push(node);
					$("#node_" + node).css("border", "3px solid #10266F");
				}
			}
		}
	})
})

function connecterClick(connecterID){
	console.log(connecterID);
}

function removeConnecters(){
	
}

function mouseMove(e){
	if(isDown && curNode != -1){
		//-15 puts the cursor inside of the nodeect as appose
		//to outside; when moving the nodeect
		$("#node_" + curNode).css({"left": e.pageX + "px",
								   "top": e.pageY + "px"});

		var connects = whatConnecters(curNode, 0);

		for(var i = 0; i < connects.length; i++){
			var c = connects[i];
			$("#connecter_" + connecters[c][0] + connecters[c][1]).css({"left": e.pageX + 12,
							     "top": e.pageY + 10});
		}

		nodes[curNode] = [e.pageX, e.pageY];
		updateConnections();
	}
}

function addNode(){
	if(removingNode == 0 && addingConnecters == 0){
		var newNode = $('<div class="node" id="node_' + nodeCntr + '"></div');
		$("#container").append(newNode);
		$("#node_" + nodeCntr).append(nodeCntr);
		nodes[nodeCntr] = [0, 0];
		active_nodes.push(nodeCntr);
		nodeCntr++;
	}
	else{
		alert("Can't add nodes while removing nodes or adding connecters.");
	}
}

function removeNode(){
	if(removingNode == 0){
		if(addingConnecters == 0){
			removingNode = 1;
			alert("Click on nodes you wish to remove, then click OK when finished.");
			$(".act_butn.remove_node").text("OK");
		}
		else{
			alert("Can't remove node while adding connecters");
		}
	}

	else{
		//TODO: remove connecters that connect to nodes that are being removed
		for(var i = 0; i < removeNodes.length; ++i){
			var r = active_nodes.indexOf(removeNodes[i]);
			if(r != -1){
				var n = active_nodes[r];
				$("#node_" + n).remove();
				delete nodes[n];
				toRemove = whatConnecters(active_nodes[n], 1);
				//console.log(toRemove);
				//console.log(connecters);
				//remove connecters from container
				if(toRemove.length > 0){
					for(var j = 0; j < toRemove.length; ++j){
						var x = toRemove[j];
						var c = connecters[x];
						//console.log("#connecter_" + c[0] + c[1]);
						$("#connecter_" + c[0] + c[1]).remove();
					}
				}

				connecters = removeInt(connecters, n);
				active_nodes[r] = -1;
			}
		}

		removingNode = 0;
		removeNodes = [];
		$(".act_butn.remove_node").text("REMOVE NODES");
	}
}

function removeInt(arr, x){
	//returns arr with all indexes that have x removed
	newArr = [];

	for(var i = 0; i < arr.length; ++i){
		if(arr[i][0] != x && arr[i][1] != x){
			newArr.push(arr[i]);
		}
	}

	return newArr;
}

function addConnecters(){
	if(addingConnecters == 0){
		if(removingNode == 0){
			addingConnecters = 1;
			//alert("Click on nodes you wish to connect and click this button again when finished.");
			$(".act_butn.add_connecter").text("OK");
		}
		else{
			alert("Can't add connecters while removing nodes.");
		}
	}

	else{
		var connecterNodes = [];

		//removes all -1's from newConnecters
		for(var i = 0; i < newConnecters.length; ++i){
			if(newConnecters[i] != -1){
				$("#node_" + newConnecters[i]).css("border", "none");
				connecterNodes.push(newConnecters[i]);
			}
		}
		newPairs = [];
		//puts into pairs and adds to connecters		
		for(var j = 1; j < connecterNodes.length; ++j){
			pair = [connecterNodes[j - 1], connecterNodes[j]];

			//check if connecter already exists
			if(connecters.length != 0){
				match = 0;
				for(var i = 0; i < connecters.length; ++i){
					if((connecters[i][0] == pair[0] || connecters[i][0] == pair[1]) && (connecters[i][1] == pair[1] || connecters[i][1] == pair[0])){
						match = 1;;
					}
				}

				if(match == 0){
					newPairs.push(pair);
					connecters.push(pair);
				}
			}
			else{
				newPairs.push(pair);
				connecters.push(pair);
			}
		}

		//create connecters and add to container
		for(var i = 0; i < newPairs.length; ++i){
			var newConnecter = $('<div class="connecter" id="connecter_' + newPairs[i][0] + newPairs[i][1] + '" onclick="tst(this.id)"></div');
			$("#container").append(newConnecter);
		}

		addingConnecters = 0;
		newConnecters = [];
		$(".act_butn.add_connecter").text("ADD CONNECTERS");
		updateConnections(1);
	}
}

function whatNode(e){
	//returns node number if node else -1
	for(var i = active_nodes.length - 1; i >= 0; --i){
		n = active_nodes[i];
		if(n == -1){continue;}
		if((e.pageX >= nodes[n][0] - 25 && e.pageX <= nodes[n][0] + 25) && (e.pageY >= nodes[n][1] - 25 && e.pageY <= nodes[n][1] + 25)){
			return i;
		}
	}
	return -1;
}

function whatConnecters(node, updating){
	connects = []

	for(var i = 0; i < connecters.length; ++i){
		if(connecters[i][0] == node || (connecters[i][1] == node) && updating){
			connects.push(i);
		}
	}

	return connects;
}

function nodePosition(node1, node2){
	//returns postion(TL, TR, BL, BR) of node2 in reference to 
	pos_y = ((nodes[node1][1] - nodes[node2][1]) > 0) ? "T" : "B";
	pos_x = ((nodes[node1][0] - nodes[node2][0]) > 0) ? "L" : "R";
	return pos_y + pos_x;
}

function updateConnections(init){
	connects = whatConnecters(curNode, 1);

	if(init){
		//initalizes coords of connections
		for(var i = 0; i < connecters.length; i++){
			var c = connecters[i]
			var l = parseInt($("#node_" + c[0]).css("left").replace("px", ""));
			var r = parseInt($("#node_" + c[0]).css("top").replace("px", ""));
			$("#connecter_" + c[0] + c[1]).css({"left": l + 12,
												"top": r + 10});
		}

		connects = []
		for(var i = 0; i < connecters.length; ++i){
			connects.push(i);
		}
	}

	for(var i = 0; i < connects.length; ++i){
		node1 = connecters[connects[i]][0];
		node2 = connecters[connects[i]][1];
		pos = nodePosition(node1, node2);
		//length of connecter	
		b = (pos[1] == "L") ? (nodes[node1][0] - nodes[node2][0]) : (nodes[node2][0] - nodes[node1][0]);
		c = (pos[0] == "T") ? (nodes[node1][1] - nodes[node2][1]) : (nodes[node2][1] - nodes[node1][1]);
		a = Math.pow(Math.pow(b, 2) + Math.pow(c, 2), 0.5);
		$("#connecter_" + node1 + node2).width(a + "px");
		
		//angle of connecter
		sina = (Math.sin(90 * Math.PI / 180) / a) * b;
		a_deg = Math.round(((Math.asin(sina) / Math.PI) * 180) * 100 / 100);

		if(pos == "BR"){a_deg = 90 - a_deg}
		else if(pos == "BL"){a_deg = 90 + a_deg}
		else if(pos == "TL"){a_deg = 270 - a_deg}
		else if(pos == "TR"){a_deg = 270 + a_deg}
		
		$("#connecter_" + node1 + node2).css("transform", "rotate(" + (a_deg) + "deg)");
	}
}