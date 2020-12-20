import React from "react";

export default function Input(props) {
	let input;
	const inputClass = "ba b--moon-gray br2 pa1";
	if (props.type === "textarea") {
		input = (
			<textarea
				id={props.label}
				className={inputClass}
				value={props.value}
				onChange={(event) => props.onChange(event.target.value)}
			/>
		);
	} else if (props.type === "select") {
		input = (
			<select
				id={props.label}
				value={props.value}
				onChange={(event) => props.onChange(event.target.value)}
			>
				{props.options &&
					props.options.map((option) => (
						<option value={option}>{option}</option>
					))}
			</select>
		);
	} else {
		input = (
			<input
				id={props.label}
				className={inputClass}
				value={props.value}
				onChange={(event) => props.onChange(event.target.value)}
			/>
		);
	}
	return (
		<div className="flex flex-column mv3">
			<label for="name" className="mb2 ttc">
				{props.label}
			</label>
			{input}
		</div>
	);
}
