import React from "react";

import ResourceDetail from "../Resource/ResourceDetail";

export default function Building(props) {
	return (
		<ResourceDetail
			resourceName="buildings"
			resourceId={props.match.params.id}
			titleExtractor={(resource) => resource.address}
			blacklist={["id", "lat", "lng", "bin_address", "requests"]}
		/>
	);
}
