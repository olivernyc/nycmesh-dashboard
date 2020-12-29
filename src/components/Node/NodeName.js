import React from "react";

export default function NodeName(props) {
	const { node } = props;
	if (!node) throw new Error("Missing node");
	return (
		<div className="bg-near-white br2 ph1 pv05 flex items-center mr1">
			<div
				className="h05 w05 br-pill mr1"
				style={{
					backgroundColor:
						node.status === "active" ? "rgb(48,209,88)" : "rgb(142,142,147)",
				}}
			/>
			<span className="fw5">{node.name || node.id}</span>
		</div>
	);
}
