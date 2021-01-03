import React from "react";

export default function Button(props) {
	const { icon, title, type = "button" } = props;
	return (
		<button
			className="bg-white black ph2 pv1 br2 fw5 flex items-center pointer bn button-shadow"
			onClick={props.onClick}
			type={type}
		>
			{icon}
			<span className={icon ? "ml2" : ""}>{title}</span>
		</button>
	);
}
