import React from "react";

export default function Button(props) {
	return (
		<button
			className={`ph2 pv1 ba b--black-20 br2 fw5 pointer ${
				props.primary ? "bg-purple white" : "bg-white dark-gray"
			}`}
			onClick={props.onClick}
			type={props.type || "button"}
		>
			{props.label}
		</button>
	);
}
