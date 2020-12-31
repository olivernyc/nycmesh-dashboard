import React from "react";

export default function Button({ type, primary, label, icon, onClick }) {
	return (
		<button
			className={`ph2 pv1 ba b--black-20 br2 fw5 pointer ${
				primary ? "bg-purple white" : "bg-white dark-gray"
			}`}
			onClick={onClick}
			type={type || "button"}
		>
			{icon} <span className={icon ? "ml2" : ""}>{label}</span>
		</button>
	);
}
