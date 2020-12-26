import React from "react";

export default function BuildingPreview(props) {
	const { building } = props;
	if (!building) return <div>Invalid building</div>;
	return (
		<div className="pv2 bb b--light-gray flex items-center">
			<div>
				<div className="mb1">
					<span className="fw5">{building.address}</span>
				</div>
				<div className="mid-gray">
					<span>{building.alt}m</span>
				</div>
			</div>
		</div>
	);
}
