import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

import Node from "../Node/Node";
import Request from "../Request/Request";
import Member from "../Member/Member";
import Building from "../Building/Building";
import Device from "../Device/Device";
import Appointment from "../Appointment/Appointment";

export default function Sidebar({
  nodeId,
  requestId,
  memberId,
  buildingId,
  deviceId,
  appointmentId,
  setLos,
}) {
  const { isAuthenticated } = useAuth0();

  return (
    <SidebarContainer>
      {nodeId && <Node id={nodeId} />}
      {requestId && isAuthenticated && (
        <Request id={requestId} setLos={setLos} />
      )}
      {memberId && isAuthenticated && <Member id={memberId} />}
      {buildingId && isAuthenticated && <Building id={buildingId} />}
      {deviceId && <Device id={deviceId} />}
      {appointmentId && isAuthenticated && <Appointment id={appointmentId} />}
    </SidebarContainer>
  );
}

function SidebarContainer({ children }) {
  const filteredChildren = children.filter((child) => child);
  if (!filteredChildren.length) return null;
  return (
    <div className="w-100 h-100 bg-white overflow-y-scroll-l map-sidebar">
      {filteredChildren}
    </div>
  );
}
