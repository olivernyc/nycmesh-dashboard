import React, { useState } from "react";
import Section from "./Section";
import Modal from "./Modal";

export default function LinksList({ node }) {
	const [showAll, setShowAll] = useState(false);
	const [editing, setEditing] = useState(false);

	const content = node.connected_nodes ? (
		node.connected_nodes
			.slice(0, showAll ? undefined : 5)
			.map((node) => <NodePreview key={node.id} node={node} />)
	) : (
		<div className="pv3">
			<span className="light-silver">No links</span>
		</div>
	);

	return (
		<Section title="Links" editLabel="Add" onEdit={() => setEditing(true)}>
			{content}
			{node.connected_nodes && node.connected_nodes.length > 5 && (
				<button
					className="purple bn bg-transparent pa0 mv3 pointer"
					onClick={() => setShowAll(!showAll)}
				>
					{showAll ? "Show less" : "Show all"}
				</button>
			)}
			{editing && (
				<Modal title="Add link" onCancel={() => setEditing(false)} />
			)}
		</Section>
	);
}

function NodePreview({ node }) {
	if (!node) return <div>Invalid node</div>;
	return (
		<div className="pv2 bb b--light-gray">
			<div className="">
				<span className="fw5">{node.name || node.id}</span>
			</div>
		</div>
	);
}
