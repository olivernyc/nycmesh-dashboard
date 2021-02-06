import React from "react";

import AppointmentMarker from "./AppointmentMarker";

function AppointmentLayer({
  appointments,
  selectedAppointment,
  selectedNode,
  onClick,
}) {
  return appointments.map((appointment) => (
    <AppointmentMarker
      key={appointment.id}
      appointment={appointment}
      onClick={onClick}
    />
  ));
}

export default React.memo(AppointmentLayer);
