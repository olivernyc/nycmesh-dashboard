import React from "react";

import NodeMarker from "./NodeMarker";

function NodeLayer({ nodes, selectedNode, onClick }) {
	return nodes
		.filter((node) => node.status === "active")
		.map((node) => (
			<NodeMarker
				key={node.id}
				node={node}
				selected={false}
				dimmed={false}
				onClick={() => onClick(node)}
			/>
		));
}

export default React.memo(NodeLayer);
