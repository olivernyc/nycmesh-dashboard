import React from "react";

import DateCell from "../Resource/DateCell";
import ResourceList from "../Resource/ResourceList";

export default function Requests(props) {
  return (
    <ResourceList
      resourceName="requests"
      columns={[
        {
          name: "building",
          width: 350,
          cellRenderer: ({ cellData }) => (
            <span className="fw5 near-black truncate">{cellData.address}</span>
          ),
        },
        {
          name: "member",
          cellRenderer: ({ cellData }) => <span>{cellData.name}</span>,
        },
        {
          name: "roof_access",
          width: 120,
          cellRenderer: ({ cellData }) => (
            <span className="ttc">{cellData}</span>
          ),
        },
        {
          name: "date",
          width: 150,
          cellRenderer: DateCell,
        },
      ]}
    />
  );
}
