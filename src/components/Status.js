import React from "react";

export default function Status(props) {
	let bg = "bg-light-gray";
	if (props.status === "active") {
		bg = "bg-light-green";
	}
	if (props.status === "open") {
		bg = "bg-light-blue";
	}
	return (
		<div className={`${bg} black-80 flex items-center br2`}>
			<span className={`f7 ph1 pv05 ttc`}>{props.status}</span>
		</div>
	);
}
