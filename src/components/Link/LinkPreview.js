import React from "react";
import { Link } from "react-router-dom";
import { BroadcastIcon } from "@primer/octicons-react";

import Status from "../Status";

export default function NodePreview({ link }) {
  let iconBg = link.status === "active" ? "bg-green" : "bg-silver";

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
              <span className="black mr2">asdf</span>
              <Status status={link.status} />
            </div>
            <div className="mt1">
              <span className="mid-gray">asdf</span>
            </div>
          </div>
        </div>
      </li>
    </Link>
  );
}
