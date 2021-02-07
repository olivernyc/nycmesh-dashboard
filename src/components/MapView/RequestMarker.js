import React, { useContext, useCallback } from "react";
import { Marker } from "@react-google-maps/api";
import Tooltip from "./Tooltip";
import { MapContext } from ".";

const regularIcon = {
	url: "/img/map/request.svg",
	anchor: { x: 5, y: 5 },
};

const panoIcon = {
	url: "/img/map/request-pano.svg",
	anchor: { x: 5, y: 5 },
};

function RequestMarker({ request, onClick }) {
	const { selectedNode, selectedRequest } = useContext(MapContext);
	const selected = selectedRequest === request.id;
	const dimmed =
		(selectedRequest && selectedRequest !== request.id) ||
		(selectedNode && selectedRequest !== request.id);
	const onClickMemo = useCallback(() => onClick(request), [request, onClick]);

	if (request.status === "closed" && !selected) return null;

	return (
		<RequestMarkerMemo
			request={request}
			selected={selected}
			dimmed={dimmed}
			onClick={onClickMemo}
		/>
	);
}

const RequestMarkerMemo = React.memo(RequestMarker2);

function RequestMarker2({ request, selected, dimmed, onClick }) {
	const { id, lat, lng } = request;
	const title = String(id);
	const panoAndRoof = request.has_panoramas && request.roof_access;
	const zIndex = panoAndRoof ? 1 : 0;
	const opacity = selected ? 1 : dimmed ? 0.2 : panoAndRoof ? 1 : 0.4;
	const icon = panoAndRoof ? panoIcon : regularIcon;
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
