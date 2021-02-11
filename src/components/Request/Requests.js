import React from "react";
import DocumentTitle from "react-document-title";

import DateCell from "../Resource/DateCell";
import ResourceList from "../Resource/ResourceList";
import Status from "../Status";

export default function Requests(props) {
  return (
    <DocumentTitle title="Requests - NYC Mesh">
      <ResourceList
        resourceName="requests"
        columns={[
          {
            name: "id",
            width: 64,
            cellRenderer: ({ cellData }) => <span>{cellData}</span>,
          },
          {
            name: "status",
            width: 80,
            cellRenderer: ({ cellData }) => <Status status={cellData} />,
          },
          {
            name: "building",
            width: 512,
            cellRenderer: ({ cellData }) => (
              <span className="fw5 near-black truncate">
                {cellData.address}
              </span>
            ),
          },
          {
            name: "member",
            width: 256,
            cellRenderer: ({ cellData }) => <span>{cellData.name}</span>,
          },
          {
            name: "roof_access",
            cellRenderer: ({ cellData }) => (
              <span className="ttc">{cellData ? "Yes" : "No"}</span>
            ),
          },
          {
            name: "date",
            width: 150,
            cellRenderer: DateCell,
          },
        ]}
      />
    </DocumentTitle>
  );
}
