import React, { useEffect } from "react";

import NodeMarker from "./NodeMarker";

function NodeLayer(props) {
	const { nodes, selectedNodes, onClick } = props;

	console.log("render nodes");
	return nodes
		.filter((node) => node.status === "active")
		.map((node) => (
			<NodeMarker
				key={node.id}
				node={node}
				dimmed={
					Object.keys(selectedNodes).length && !selectedNodes[node.id]
				}
				onClick={() => onClick(node)}
			/>
		));
}

export default React.memo(NodeLayer);
