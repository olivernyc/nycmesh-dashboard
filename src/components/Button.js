import React from "react";

export default function Button(props) {
	const { icon, title, type = "button" } = props;
	return (
		<button
			className="bg-near-white ph2 pv1 br2 button-shadow fw5 flex items-center pointer"
			style={{
				boxShadow: "#ccc 0px 1px 0px 0px",
			}}
			onClick={props.onClick}
			type={type}
		>
			{icon}
			<span className={icon ? "ml2" : ""}>{title}</span>
		</button>
	);
}
