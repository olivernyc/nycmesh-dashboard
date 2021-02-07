import React from "react";
import { Link } from "react-router-dom";
import { BroadcastIcon } from "@primer/octicons-react";

export default function BuildingPreview(props) {
	const { building } = props;
	if (!building) return <div>Invalid building</div>;
	return (
		<Link to={`/map/buildings/${building.id}`} className="link">
			<div className="pv2 bb b--light-gray flex items-center">
				<div className="bg-silver h2 w2 br2 ml1 mr2 flex items-center justify-center white">
					<BroadcastIcon />
				</div>
				<div>
					<div className="mb1">
						<span className="fw5 black">{building.address}</span>
					</div>
					<div className="mid-gray">
						<span>{building.alt}m</span>
					</div>
				</div>
			</div>
		</Link>
	);
}
