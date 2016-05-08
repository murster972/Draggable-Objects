var isDown, nodes;
isDown = 0;
nodes = new Nodes();

$(document).ready(function(){
	$(".act_butn.add_node").click(function(){
		nodes.addNode();
	});

	$("#container").mousedown(function(e){
		nodes.curNode = nodes.whatNode(e);
		isDown = (nodes.curNode != -1) ? 1 : 0;
		if(nodes.curNode != -1){
			$("#node_" + nodes.curNode).css("border", "3px solid #323A45");
		}
	})

	$("#container").mouseup(function(e){
		if(nodes.curNode != -1 && isDown){
			nodes.nodeCoords[nodes.curNode] = [e.pageX, e.pageY];
			$("#node_" + nodes.curNode).css("border", "none");
			curNode = - 1;
			isDown = 0;
		}
	})

	$("#container").mousemove(function(e){
		if(isDown && nodes.curNode != -1){
			$("#node_" + nodes.curNode).css({"left": e.pageX + "px",
									   "top": e.pageY + "px"});
			
			nodes.nodeCoords[nodes.curNode] = [e.pageX, e.pageY];
		}
	})
})

$(document).keyup(function(e){
	if(e.which == 46){
		nodes.removeNodes(-1, 1);
	}
})