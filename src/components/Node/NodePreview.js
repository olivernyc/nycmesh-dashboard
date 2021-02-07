import React from "react";
import { Link } from "react-router-dom";
import { BroadcastIcon } from "@primer/octicons-react";

import Status from "../Status";

export default function NodePreview({ node, device }) {
  let iconBg = node.status === "active" ? "bg-green" : "bg-silver";

  let subtitle;
  if (node.distance) {
    subtitle = `${parseFloat(node.distance / 1000).toFixed(1)}km`;
  }

  if (device) {
    subtitle += ` • ${device.type.name}`;
  }

  // if (node.devices) {
  //   subtitle = node.devices.map((device) => device.type.name).join(", ");
  // }

  return (
    <Link to={`/map/nodes/${node.id}`} className="link">
      <li className="bb b--light-gray pv2 pointer flex items-start justify-between">
        <div className="flex items-center mr4">
          <div
            className={`${iconBg} h2 w2 br2 ml1 mr2 flex items-center justify-center white`}
          >
            <BroadcastIcon />
          </div>
          <div className="f6">
            <div className="flex fw5 items-center">
              <span className="black mr2">{node.name || `${node.id}`}</span>
              <Status status={node.status} />
            </div>
            <div className="mt1">
              <span className="mid-gray">{subtitle}</span>
            </div>
          </div>
        </div>
      </li>
    </Link>
  );
}
