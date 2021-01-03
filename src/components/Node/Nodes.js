import React from "react";
import DocumentTitle from "react-document-title";

import ResourceList from "../Resource/ResourceList";
import DateCell from "../Resource/DateCell";
import Status from "../Status";

export default function Nodes(props) {
	return (
		<DocumentTitle title="Nodes - NYC Mesh">
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
						cellRenderer: ({ cellData }) => <Status status={cellData} />,
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
		</DocumentTitle>
	);
}
