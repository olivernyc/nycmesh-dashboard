import React from "react";

export default function Input({
	type,
	label,
	value,
	required,
	options,
	onChange,
}) {
	let input;
	const inputClass = "ba b--moon-gray bg-white black br2 pa1";
	if (type === "textarea") {
		input = (
			<textarea
				id={label}
				className={inputClass}
				value={value}
				required={required}
				onChange={(event) => onChange && onChange(event.target.value)}
			/>
		);
	} else if (type === "select") {
		input = (
			<select
				id={label}
				value={value}
				required={required}
				onChange={(event) => onChange && onChange(event.target.value)}
			>
				{options &&
					options.map((option) => <option value={option}>{option}</option>)}
			</select>
		);
	} else {
		input = (
			<input
				id={label}
				className={inputClass}
				value={value}
				type={type}
				required={required}
				onChange={(event) => onChange && onChange(event.target.value)}
			/>
		);
	}
	return (
		<div className="flex flex-column mv3">
			<label for="name" className="mb2 ttc">
				{label}
			</label>
			{input}
		</div>
	);
}
