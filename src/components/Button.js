import React from "react";

export default function Button(props) {
	const { icon, title } = props;
	return (
		<div
			className="bg-near-white ph2 pv1 br2 button-shadow fw5 flex items-center"
			style={{
				boxShadow: "#ccc 0px 1px 0px 0px"
			}}
		>
			{icon}
			<span className="ml2">{title}</span>
		</div>
	);
}
