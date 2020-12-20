import React from "react";

import ResourceList from "./ResourceList";
import DateCell from "./DateCell";

export default function Nodes(props) {
	return (
		<ResourceList
			resourceName="nodes"
			columns={[
				{
					name: "id",
					width: 64,
					cellRenderer: ({ cellData }) => (
						<span className="fw5 near-black">{cellData}</span>
					),
				},
				{
					name: "status",
					width: 80,
					cellRenderer: ({ cellData }) => (
						<div
							className="ph1 pv1 br2 f7 fw5 ttc black-60"
							style={{
								backgroundColor:
									cellData === "active"
										? "rgba(48,209,88,0.25)"
										: "rgba(142,142,147,0.25)",
							}}
						>
							{cellData}
						</div>
					),
				},
				{ name: "building", width: 350 },
				{ name: "notes" },
				{
					name: "create_date",
					width: 150,
					cellRenderer: DateCell,
				},
			]}
		/>
	);
}
