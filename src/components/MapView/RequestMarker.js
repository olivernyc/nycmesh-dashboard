import React, { useContext } from "react";
import { Marker } from "@react-google-maps/api";
import Tooltip from "./Tooltip";
import { MapContext } from ".";

const icon = {
	url: "/img/map/request.svg",
	anchor: { x: 5, y: 5 },
};

function RequestMarker({ request, onClick }) {
	const { selectedNode, selectedRequest } = useContext(MapContext);
	const selected = selectedRequest === request.id;
	if (request.status === "closed" && !selected) return null;
	const dimmed =
		(selectedRequest && selectedRequest !== request.id) ||
		(selectedNode && selectedRequest !== request.id);
	return (
		<RequestMarkerMemo
			request={request}
			selected={selected}
			dimmed={dimmed}
			onClick={onClick}
		/>
	);
}

const RequestMarkerMemo = React.memo(RequestMarker2);

function RequestMarker2({ request, selected, dimmed, onClick }) {
	const { id, lat, lng } = request;
	const title = String(id);
	const zIndex = 0;
	const opacity = selected ? 1 : dimmed ? 0.2 : 0.4;
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
			{selected && <Tooltip lat={lat} lng={lng} label={request.id} />}
		</React.Fragment>
	);
}

export default React.memo(RequestMarker);
