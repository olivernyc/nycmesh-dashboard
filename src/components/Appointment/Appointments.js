import React from "react";
import DocumentTitle from "react-document-title";

import ResourceList from "../Resource/ResourceList";
import DateCell from "../Resource/DateCell";

export default function Appointments() {
  return (
    <DocumentTitle title="Buildings - NYC Mesh">
      <ResourceList
        resourceName="appointments"
        columns={[
          {
            name: "building",
            width: 400,
            cellRenderer: ({ cellData }) => (
              <span className="fw5 near-black truncate">
                {cellData.address}
              </span>
            ),
          },
          {
            name: "date",
            width: 250,
            cellRenderer: DateCell,
          },
          {
            name: "type",
            width: 250,
            cellRenderer: ({ cellData }) => (
              <span className="near-black truncate ttc">{cellData}</span>
            ),
          },
          {
            name: "member",
            width: 250,
            cellRenderer: ({ cellData }) => (
              <span className="near-black truncate">{cellData.name}</span>
            ),
          },
          {
            name: "request",
            title: "apartment",
            width: 250,
            cellRenderer: ({ cellData }) => (
              <span className="near-black truncate">{cellData.apartment}</span>
            ),
          },
        ]}
      />
    </DocumentTitle>
  );
}
