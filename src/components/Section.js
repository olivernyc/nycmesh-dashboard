import React from "react";

export default function Section({ title, editLabel, children, onEdit }) {
	return (
		<div className="mt3">
			<div className="pv3 flex item-center justify-between bb b--light-gray">
				<span className="f5 fw7">{title}</span>
				<button
					className="bn pa0 bg-transparent purple pointer fw5"
					onClick={onEdit}
				>
					{editLabel || "Edit"}
				</button>
			</div>
			{children}
		</div>
	);
}
