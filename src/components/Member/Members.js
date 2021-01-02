import React from "react";
import DocumentTitle from "react-document-title";

import ResourceList from "../Resource/ResourceList";

export default function Members() {
	return (
		<DocumentTitle title="Members - NYC Mesh">
			<ResourceList
				resourceName="members"
				columns={[
					{
						name: "email",
						width: 250,
						cellRenderer: ({ cellData }) => (
							<span className="fw5 near-black">{cellData}</span>
						),
					},
					{ name: "name", width: 200 },
					{ name: "phone" },
					{
						name: "nodes",
						cellRenderer: ({ cellData }) =>
							cellData ? (
								<div className="flex">
									{cellData
										.filter((node) => node) // Handle null values from API bug
										.map((node) => (
											<div className=" bg-near-white br2 ph1 pv05 flex items-center mr1">
												<div
													className="h05 w05 br-pill mr1"
													style={{
														backgroundColor:
															node.status === "active"
																? "rgb(48,209,88)"
																: "rgb(142,142,147)",
													}}
												/>
												<span className="fw5">{node.name || node.id}</span>
											</div>
										))}
								</div>
							) : null,
					},
				]}
			/>
		</DocumentTitle>
	);
}
