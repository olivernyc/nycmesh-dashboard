import React from "react";

import NodeMarker from "./NodeMarker";

function NodeLayer({ nodes, selectedNode, onClick }) {
	return nodes.map((node) => (
		<NodeMarker
			key={`node-${node.id}`}
			node={node}
			selected={false}
			dimmed={false}
			onClick={onClick}
		/>
	));
}

export default React.memo(NodeLayer);
