import React from "react";

import { classNames } from '../utils';

export default function Button({ type, primary, label, icon, onClick, disabled }) {
	const classes = classNames("ph2 pv1 ba b--black-20 br2 fw5", {
		pointer: !disabled,
		"bg-purple white": primary && !disabled,
		"bg-purple silver": primary && disabled,
		"bg-white dark-gray": !primary && !disabled,
		"bg-white-80 silver": !primary && disabled,
	});

	return (
		<button
			className={classes}
			onClick={onClick}
			type={type || "button"}
			disabled={disabled}
		>
			{icon} <span className={icon ? "ml2" : ""}>{label}</span>
		</button>
	);
}
