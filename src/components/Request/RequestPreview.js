import React from "react";
import { Link } from "react-router-dom";
import { TelescopeIcon } from "@primer/octicons-react";

import Status from "../Status";

export default function RequestPreview({ request }) {
  let iconBg = request.status === "open" ? "bg-light-blue" : "bg-silver";
  const apartmentLabel = isNaN(request.apartment)
    ? request.apartment
    : `Apt ${request.apartment}`;

  return (
    <Link to={`/map/requests/${request.id}`} className="link">
      <li className="bb b--light-gray pv2 pointer flex items-start justify-between">
        <div className="flex items-center mr4">
          <div
            className={`${iconBg} h2 w2 br2 ml1 mr2 flex items-center justify-center white`}
          >
            <TelescopeIcon />
          </div>
          <div className="f6">
            <div className="flex fw5 items-center">
              <span className="black mr2">{request.member.name}</span>
              <Status status={request.status} />
            </div>
            <div className="mt1">
              <span className="mid-gray db nowrap ttc">{apartmentLabel}</span>
            </div>
          </div>
        </div>
      </li>
    </Link>
  );
}
