import React from "react";
import ResourceDetail from "./ResourceDetail";

export default function Member(props) {
	const { id } = props;
	return (
		<ResourceDetail
			resourceName="members"
			resourceId={id}
			titleExtractor={(resource) => resource.name}
			blacklist={["id"]}
			renderers={{
				email: (value) => (
					<a className="link blue" href={`mailto:${value}`}>
						{value}
					</a>
				),
				phone: (value) => (
					<a className="link blue" href={`tel:${value}`}>
						{value}
					</a>
				),
			}}
		/>
	);
}
