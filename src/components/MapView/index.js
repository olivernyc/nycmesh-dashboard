import React, { useState, useEffect, useCallback } from "react";
import { useAuth0 } from "../Auth0";

import { fetchResource } from "../../api";
import MapComponent from "./MapComponent";
import Node from "../Node";
import Request from "../Request";
import Member from "../Member";

export default React.memo(NodeMap);

export const MapContext = React.createContext();

function NodeMap({ history, match }) {
	const mapData = useMapData();
	const [map, setMap] = useState(null);

	const handleNodeClick = useCallback(
		(node) => {
			history.push(`/map/nodes/${node.id}`);
			map.panTo({ lat: node.lat, lng: node.lng });
		},
		[map, history]
	);

	const handleRequestClick = useCallback(
		(request) => {
			history.push(`/map/requests/${request.id}`);
			map.panTo({ lat: request.building.lat, lng: request.building.lng });
		},
		[map, history]
	);

	const handleMapClick = useCallback(
		(node) => {
			history.push("/map");
		},
		[history]
	);

	const handleLoad = useCallback((map) => {
		setMap(map);
	}, []);

	const { nodeId, requestId, memberId } = match.params;
	const sidebar = (nodeId || requestId || memberId) && (
		<div className="w-100 h-100 overflow-y-scroll map-sidebar">
			{nodeId && <Node id={nodeId} />}
			{requestId && <Request id={requestId} />}
			{memberId && <Member id={memberId} />}
		</div>
	);

	return (
		<div className="h-100 w-100 overflow-hidden flex flex-row-l flex-column-l flex-column-reverse">
			{sidebar}
			<MapContext.Provider
				value={{
					selectedNode: parseInt(nodeId),
					selectedRequest: parseInt(requestId),
				}}
			>
				<MapComponent
					nodes={mapData.nodes}
					links={mapData.links}
					requests={mapData.requests}
					selectedNode={parseInt(nodeId)}
					selectedRequest={parseInt(requestId)}
					onNodeClick={handleNodeClick}
					onRequestClick={handleRequestClick}
					onClick={handleMapClick}
					onLoad={handleLoad}
				/>
			</MapContext.Provider>
		</div>
	);
}

function useMapData() {
	const [mapData, setMapData] = useState({
		nodes: [],
		requests: [],
		links: [],
	});
	const { isAuthenticated, getTokenSilently } = useAuth0();
	useEffect(() => {
		async function fetchAll() {
			const token = await getTokenSilently();
			const [nodesRes, requestsRes, linksRes] = await Promise.all([
				fetchResource("nodes", token),
				fetchResource("requests", token),
				fetchResource("links", token),
			]);
			setMapData({
				nodes: nodesRes,
				requests: requestsRes,
				links: linksRes,
			});
		}
		if (!isAuthenticated) return;
		try {
			fetchAll();
		} catch (error) {
			alert(error);
		}
	}, [isAuthenticated, getTokenSilently]);
	return mapData;
}
