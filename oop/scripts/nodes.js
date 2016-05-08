function Nodes(){
	this.nodeCoords = [];
	this.nodeCntr = 0;
	this.activeNodes = [];
	this.toRemove = [];
	this.curNode = -1;
}
	
Nodes.prototype.addNode = function(){
	var newNode = $('<div class="node" id="node_' + this.nodeCntr + '" ondblclick="nodes.removeNodes(this.id, 0)">' + this.nodeCntr + '</div>');
	//var newNode = $('<div class="node" id="node_' + this.nodeCntr + '">' + this.nodeCntr + '</div>')
	$("#container").append(newNode);

	this.nodeCoords.push([0, 0]);
	this.activeNodes.push(this.nodeCntr);

	this.nodeCntr++;
}

Nodes.prototype.removeNodes = function(nodeID, keyPressed){
	//double click selects/deselects node, delet key deletes node
	if(keyPressed && this.toRemove.length > 0){
		for(var i = 0; i < this.toRemove.length; ++i){
			var n = this.toRemove[i];
			this.activeNodes = removeItem(this.activeNodes, n);
			this.nodeCoords[n] = -1;
			$("#node_" + n).remove();
		}
	}

	if(nodeID != -1){
		nodeNum = nodeID.split("_")[1];
		if(this.toRemove.indexOf(nodeNum) == -1){
			$("#" + nodeID).css("border", "3px solid #ED6454");
			this.toRemove.push(nodeNum);
		}
		else{
			$("#" + nodeID).css("border", "none");
			this.toRemove = removeItem(this.toRemove, nodeNum);
		}
	}
}

Nodes.prototype.whatNode = function(e){
	for(var i = this.activeNodes.length - 1; i >= 0; i--){
		var n = this.activeNodes[i];
		if((e.pageX >= this.nodeCoords[n][0] - 25 && e.pageX <= this.nodeCoords[n][0] + 25) && (e.pageY >= this.nodeCoords[n][1] - 25 && e.pageY <= this.nodeCoords[n][1] + 25)){
			return n;
		}
	}
	return -1;
}

function removeItem(arr, item){
	//removes item from arr
	var newArr = [];

	for(var i = 0; i < arr.length; ++i){
		if(arr[i] != item){newArr.push(arr[i]);}
	}
	return newArr;
}