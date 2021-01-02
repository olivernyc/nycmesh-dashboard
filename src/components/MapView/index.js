import React, { useState, useEffect, useCallback } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import DocumentTitle from "react-document-title";

import { fetchResource } from "../../api";
import MapComponent from "./MapComponent";
import Node from "../Node/Node";
import Request from "../Request/Request";
import Member from "../Member/Member";
import Building from "../Building/Building";

export default React.memo(NodeMap);

export const MapContext = React.createContext();

function NodeMap({ history, match }) {
	const mapData = useMapData();
	const [map, setMap] = useState(null);
	const [isFirstLoad, setIsFirstLoad] = useState(true);

	const handleLoad = useCallback((map) => {
		setMap(map);
	}, []);

	const { nodeId, requestId, memberId, buildingId } = match.params;

	// Pan to selected item
	useEffect(() => {
		if (!map || !mapData.nodesById || !mapData.requestsById) return;
		if (nodeId) {
			const node = mapData.nodesById[nodeId];
			if (!node) return;
			map.panTo({ lat: node.lat, lng: node.lng });
		} else if (requestId) {
			const request = mapData.requestsById[requestId];
			if (!request) return;
			map.panTo({ lat: request.lat, lng: request.lng });
		}
	}, [nodeId, requestId, memberId, mapData, map]);

	// Fit bounds to node + connected nodes on first load
	useEffect(() => {
		const { nodesById, requestsById, connectedNodes } = mapData;
		if (!map || !nodesById || !requestsById || !connectedNodes) return;

		if (!isFirstLoad) return;
		setIsFirstLoad(false);

		if (!nodeId && !requestId) return;

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
				map.setZoom(14);
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
			map.setZoom(14);
			return;
		}
	}, [mapData, map, nodeId, requestId, isFirstLoad]);

	// Dismiss sidebar on escape
	useEffect(() => {
		const upHandler = ({ key }) => {
			if (key === "Escape") {
				history.push("/map");
			}
		};
		window.addEventListener("keyup", upHandler);
		return () => {
			window.removeEventListener("keyup", upHandler);
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

	const handleMapClick = useCallback(
		(node) => {
			history.push("/map");
		},
		[history]
	);

	const sidebar = (nodeId || requestId || memberId || buildingId) && (
		<div className="z-2 w-100 h-100 bg-white overflow-y-scroll-l map-sidebar">
			{nodeId && <Node id={nodeId} />}
			{requestId && <Request id={requestId} />}
			{memberId && <Member id={memberId} />}
			{buildingId && <Building id={buildingId} />}
		</div>
	);

	return (
		<DocumentTitle title="Map - NYC Mesh">
			<div className="h-100 w-100 overflow-hidden flex flex-row-l flex-column-l flex-column-reverse bg-white">
				{sidebar}
				<MapContext.Provider
					value={{
						selectedNode: parseInt(nodeId),
						selectedRequest: parseInt(requestId),
						connectedNodes: mapData.connectedNodes,
						nodesById: mapData.nodesById,
						requestsById: mapData.requestsById,
					}}
				>
					<MapComponent
						nodes={mapData.nodes}
						links={mapData.links}
						requests={mapData.requests}
						onLoad={handleLoad}
						onNodeClick={handleNodeClick}
						onRequestClick={handleRequestClick}
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
		nodesById: null,
		requestsById: null,
		connectedNodes: null,
	});
	const { isAuthenticated, getAccessTokenSilently } = useAuth0();
	useEffect(() => {
		if (!isAuthenticated) return;
		try {
			fetchMap();
		} catch (error) {
			alert(error);
		}
		async function fetchMap() {
			const token = await getAccessTokenSilently();
			const mapData = await fetchResource("map", token);
			const nodesById = {};
			const requestsById = {};
			const connectedNodes = {};
			mapData.nodes.forEach((node) => {
				nodesById[node.id] = node;
			});
			mapData.requests.forEach((request) => {
				requestsById[request.id] = request;
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
				connectedNodes,
			});
		}
	}, [isAuthenticated, getAccessTokenSilently]);
	return mapData;
}
