import React, { useEffect, useCallback } from "react";
import DocumentTitle from "react-document-title";
import MeshMap from "mesh-map";

import useMapData from "./useMapData";
import Sidebar from "./Sidebar";

export default function NodeMap({ history, match }) {
	const [mapData, loading] = useMapData();
	const {
		nodeId,
		requestId,
		memberId,
		buildingId,
		deviceId,
		appointmentId,
	} = match.params;

	// Dismiss sidebar on escape
	useEffect(() => {
		const upHandler = ({ key }) => {
			if (key === "Escape") {
				history.push("/map");
			}
		};
		window.addEventListener("keyup", upHandler, false);
		return () => {
			window.removeEventListener("keyup", upHandler, false);
		};
	}, [history]);

	const handleNodeClick = useCallback(
		(node) => {
			history.push(`/map/nodes/${node.id}`);
		},
		[history]
	);

	const handleRequestClick = useCallback(
		(request) => {
			history.push(`/map/requests/${request.id}`);
		},
		[history]
	);

	const handleAppointmentClick = useCallback(
		(appointment) => {
			history.push(`/map/appointments/${appointment.id}`);
		},
		[history]
	);

	const handleMapClick = useCallback(
		(node) => {
			history.push("/map");
		},
		[history]
	);

	return (
		<DocumentTitle title="Map - NYC Mesh">
			<div className="h-100 w-100 overflow-hidden flex flex-row-l flex-column-l flex-column-reverse bg-white">
				<Sidebar
					nodeId={parseInt(nodeId)}
					requestId={parseInt(requestId)}
					appointmentId={parseInt(appointmentId)}
					memberId={parseInt(memberId)}
					buildingId={parseInt(buildingId)}
					deviceId={parseInt(deviceId)}
				/>
				<MeshMap
					googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
					loading={loading}
					data={mapData}
					selectedNode={parseInt(nodeId)}
					selectedRequest={parseInt(requestId)}
					selectedAppointment={parseInt(appointmentId)}
					onNodeClick={handleNodeClick}
					onRequestClick={handleRequestClick}
					onAppointmentClick={handleAppointmentClick}
					onClick={handleMapClick}
				/>
			</div>
		</DocumentTitle>
	);
}
