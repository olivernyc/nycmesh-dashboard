import React from "react";

import ResourceList from "../Resource/ResourceList";

export default function Buildings(props) {
	return (
		<ResourceList
			resourceName="buildings"
			columns={[
				{
					name: "address",
					width: 350,
					cellRenderer: ({ cellData }) => (
						<span className="fw5 near-black truncate">
							{cellData}
						</span>
					),
				},
				{
					name: "nodes",
					cellRenderer: ({ cellData }) =>
						cellData ? (
							<div className="flex">
								{cellData
									.filter((node) => node) // Handle null values from API bug
									.map((node) => (
										<div
											key={node.id}
											className=" bg-near-white br2 ph1 pv05 flex items-center mr2"
										>
											<div
												className="h05 w05 br-pill mr1"
												style={{
													backgroundColor:
														node.status === "active"
															? "rgb(48,209,88)"
															: "rgb(142,142,147)",
												}}
											/>
											<span className="fw5">
												{node.name || node.id}
											</span>
										</div>
									))}
							</div>
						) : null,
				},
				{ name: "requests" },
			]}
		/>
	);
}
