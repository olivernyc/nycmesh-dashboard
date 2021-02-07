import React, { useContext, useCallback } from "react";
import { Marker } from "@react-google-maps/api";
import Tooltip from "./Tooltip";
import { MapContext } from ".";

const icon = {
  url: "/img/map/appointment.svg",
  anchor: { x: 9, y: 9 },
};

function AppointmentMarker({ appointment, onClick }) {
  const { selectedNode, selectedRequest, selectedAppointment } = useContext(
    MapContext
  );
  const selected = selectedAppointment === appointment.id;
  const dimmed = selectedNode || selectedRequest;
  const onClickMemo = useCallback(() => onClick(appointment), [
    appointment,
    onClick,
  ]);
  if (appointment.status === "closed" && !selected) return null;
  return (
    <AppointmentMarkerMemo
      appointment={appointment}
      selected={selected}
      dimmed={dimmed}
      onClick={onClickMemo}
    />
  );
}

const AppointmentMarkerMemo = React.memo(AppointmentMarker2);

function AppointmentMarker2({ appointment, selected, dimmed, onClick }) {
  const { id, lat, lng } = appointment;
  const title = String(id);
  const zIndex = 5;
  const opacity = selected ? 1 : dimmed ? 0.2 : 1;
  if (lat === "NaN" || lng === "NaN") return null;
  return (
    <React.Fragment>
      <Marker
        position={{ lat, lng }}
        title={title}
        icon={icon}
        options={{ opacity }}
        zIndex={zIndex}
        onClick={onClick}
      />
      {selected && <Tooltip lat={lat} lng={lng} label={appointment.type} />}
    </React.Fragment>
  );
}

export default React.memo(AppointmentMarker);
