import React, { useState, useEffect, useCallback } from "react";
import DocumentTitle from "react-document-title";
import { useAuth0 } from "@auth0/auth0-react";

import { fetchResource } from "../../api";

import MapComponent from "./MapComponent";
import Node from "../Node/Node";
import Request from "../Request/Request";
import Member from "../Member/Member";
import Building from "../Building/Building";
import Device from "../Device/Device";
import Appointment from "../Appointment/Appointment";

export default React.memo(NodeMap);

export const MapContext = React.createContext({});

function NodeMap({ history, match }) {
	const [mapData, loading, reloadMap, setLos] = useMapData();
	const [map, setMap] = useState(null);
	const [isFirstLoad, setIsFirstLoad] = useState(true);
	const { isAuthenticated } = useAuth0();

	const handleLoad = useCallback((map) => {
		setMap(map);
	}, []);

	const {
		nodeId,
		requestId,
		memberId,
		buildingId,
		deviceId,
		appointmentId,
	} = match.params;

	// Pan to selected item
	useEffect(() => {
		if (
			!map ||
			!mapData.nodesById ||
			!mapData.requestsById ||
			!mapData.appointmentsById
		)
			return;
		if (nodeId) {
			const node = mapData.nodesById[nodeId];
			if (!node) return;
			map.panTo({ lat: node.lat, lng: node.lng });
		} else if (requestId) {
			const request = mapData.requestsById[requestId];
			if (!request) return;
			map.panTo({ lat: request.lat, lng: request.lng });
		} else if (appointmentId) {
			const appointment = mapData.appointmentsById[appointmentId];
			if (!appointment) return;
			map.panTo({ lat: appointment.lat, lng: appointment.lng });
		}
	}, [nodeId, requestId, memberId, appointmentId, mapData, map]);

	// Fit bounds to node + connected nodes on first load
	useEffect(() => {
		const {
			nodesById,
			requestsById,
			appointmentsById,
			connectedNodes,
		} = mapData;
		if (
			!map ||
			!nodesById ||
			!requestsById ||
			!appointmentsById ||
			!connectedNodes
		)
			return;

		if (!isFirstLoad) return;
		setIsFirstLoad(false);

		if (!nodeId && !requestId && !appointmentId) return;

		if (nodeId) {
			const newBounds = {
				east: -999,
				north: -999,
				south: 999,
				west: 999,
			};
			const node = nodesById[nodeId];
			if (!node) return;
			const neighbors = connectedNodes[nodeId];
			if (!neighbors) {
				map.setZoom(15);
				return;
			}
			[node, ...neighbors].forEach(({ lat, lng }) => {
				newBounds.west = Math.min(lng, newBounds.west);
				newBounds.east = Math.max(lng, newBounds.east);
				newBounds.south = Math.min(lat, newBounds.south);
				newBounds.north = Math.max(lat, newBounds.north);
			});
			map.fitBounds(newBounds);
		} else if (requestId) {
			const request = requestsById[requestId];
			if (!request) return;
			map.setZoom(15);
			return;
		} else if (appointmentId) {
			const appointment = appointmentsById[appointmentId];
			if (!appointment) return;
			map.setZoom(15);
		}
	}, [mapData, map, nodeId, requestId, appointmentId, isFirstLoad]);

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

	const sidebar = (nodeId ||
		(requestId && isAuthenticated) ||
		(memberId && isAuthenticated) ||
		(buildingId && isAuthenticated) ||
		(appointmentId && isAuthenticated) ||
		deviceId) && (
		<div className="w-100 h-100 bg-white overflow-y-scroll-l map-sidebar">
			{nodeId && <Node id={nodeId} />}
			{requestId && <Request id={requestId} />}
			{memberId && <Member id={memberId} />}
			{buildingId && <Building id={buildingId} />}
			{deviceId && <Device id={deviceId} />}
			{appointmentId && <Appointment id={appointmentId} />}
		</div>
	);

	return (
		<DocumentTitle title="Map - NYC Mesh">
			<div className="h-100 w-100 overflow-hidden flex flex-row-l flex-column-l flex-column-reverse bg-white">
				<MapContext.Provider
					value={{
						selectedNode: parseInt(nodeId),
						selectedRequest: parseInt(requestId),
						selectedAppointment: parseInt(appointmentId),
						connectedNodes: mapData.connectedNodes,
						nodesById: mapData.nodesById,
						requestsById: mapData.requestsById,
						reloadMap,
						setLos,
					}}
				>
					{sidebar}
					<MapComponent
						loading={loading}
						data={mapData}
						onLoad={handleLoad}
						onNodeClick={handleNodeClick}
						onRequestClick={handleRequestClick}
						onAppointmentClick={handleAppointmentClick}
						onClick={handleMapClick}
					/>
				</MapContext.Provider>
			</div>
		</DocumentTitle>
	);
}

function useMapData() {
	const [mapData, setMapData] = useState({
		nodes: [],
		requests: [],
		links: [],
		appointments: [],
		los: null,
		nodesById: null,
		requestsById: null,
		connectedNodes: null,
	});
	const [loading, setLoading] = useState(false);
	const [stale, setStale] = useState(true);

	const { isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0();

	// Set connected nodes, requests / nodes by id upon initial load
	useEffect(() => {
		if (isLoading) return;
		// Hack to trigger map reload from child components
		if (!stale) return;
		try {
			fetchMap();
		} catch (error) {
			alert(error);
			setLoading(false);
			setStale(false);
		}
		async function fetchMap() {
			setLoading(true);
			let token;
			if (isAuthenticated) {
				token = await getAccessTokenSilently();
			}
			const mapData = await fetchResource("map", token);
			const nodesById = {};
			const requestsById = {};
			const appointmentsById = {};
			const connectedNodes = {};
			mapData.nodes.forEach((node) => {
				nodesById[node.id] = node;
			});
			mapData.requests.forEach((request) => {
				requestsById[request.id] = request;
			});
			mapData.appointments.forEach((appointment) => {
				appointmentsById[appointment.id] = appointment;
			});
			mapData.links.forEach((link) => {
				const [nodeId1, nodeId2] = link.devices.map((d) => d.node_id);
				connectedNodes[nodeId1] = connectedNodes[nodeId1] || [];
				connectedNodes[nodeId2] = connectedNodes[nodeId2] || [];
				connectedNodes[nodeId1].push(nodesById[nodeId2]);
				connectedNodes[nodeId2].push(nodesById[nodeId1]);
			});
			setMapData({
				...mapData,
				nodesById,
				requestsById,
				appointmentsById,
				connectedNodes,
			});
			setLoading(false);
			setStale(false);
		}
	}, [isLoading, isAuthenticated, getAccessTokenSilently, stale]);

	const reloadMap = useCallback(() => {
		setStale(true);
	}, [setStale]);

	const setLos = useCallback(
		(los) => {
			setMapData((mapData) => ({
				...mapData,
				los,
			}));
		},
		[setMapData]
	);

	return [mapData, loading, reloadMap, setLos];
}
