import React, { useState, useEffect, useCallback } from "react";
import Octicon, { Settings } from "@primer/octicons-react";
import { useAuth0 } from "../Auth0";

import MapComponent from "./MapComponent";
import Node from "../Node";
import Request from "../Request";
import Member from "../Member";
import Button from "../Button";
import { fetchResource } from "../../api";

export default function NodeMap(props) {
	const [selectedNodes, setSelectedNodes] = useState({});
	const [selectedRequests, setSelectedRequests] = useState({});
	const [nodes, setNodes] = useState([]);
	const [links, setLinks] = useState([]);
	const [requests, setRequests] = useState([]);
	const { isAuthenticated, getTokenSilently } = useAuth0();
	useEffect(() => {
		async function fetchNodes(token) {
			try {
				const nodesRes = await fetchResource("nodes", token);
				setNodes(nodesRes);
			} catch (error) {
				alert("Failed to fetch nodes");
			}
		}
		async function fetchLinks(token) {
			try {
				const linksRes = await fetchResource("links", token);
				setLinks(linksRes);
			} catch (error) {
				alert("Failed to fetch links");
			}
		}
		async function fetchRequests(token) {
			try {
				const requestsRes = await fetchResource("requests", token);
				setRequests(requestsRes);
			} catch (error) {
				alert("Failed to fetch requests");
			}
		}
		async function fetchAll() {
			const token = await getTokenSilently();
			fetchNodes(token);
			fetchLinks(token);
			fetchRequests(token);
		}
		if (!isAuthenticated) return;
		try {
			fetchAll();
		} catch (error) {
			alert(error);
		}
	}, [isAuthenticated, getTokenSilently]);

	const [map, setMap] = useState(null);

	const handleNodeClick = useCallback(
		(node) => {
			props.history.push(`/map/nodes/${node.id}`);
			map.panTo({ lat: node.lat, lng: node.lng });

			// Update selected nodes
			let commandPressed = false;
			let newSelectedNodes = commandPressed ? { ...selectedNodes } : {};
			if (selectedNodes[node.id]) {
				delete newSelectedNodes[node.id];
			} else {
				newSelectedNodes[node.id] = node;
			}
			setSelectedNodes(newSelectedNodes);
		},
		[map, selectedNodes]
	);

	const handleRequestClick = useCallback(
		(request) => {
			props.history.push(`/map/requests/${request.id}`);
			map.panTo({ lat: request.building.lat, lng: request.building.lng });

			// Update selected nodes
			// let newSelectedNodes = { ...selectedNodes };
			// let commandPressed = true;
			// if (selectedNodes[node.id]) {
			// 	delete newSelectedNodes[node.id];
			// } else if (commandPressed) {
			// 	newSelectedNodes[node.id] = true;
			// } else {
			// 	newSelectedNodes = {
			// 		[node.id]: true,
			// 	};
			// }
			// setSelectedNodes(newSelectedNodes);
		},
		[map, selectedNodes]
	);

	const handleMapClick = useCallback((node) => {
		props.history.push("/map");
		setSelectedNodes({});
	});

	const { nodeId, requestId, memberId } = props.match.params;

	return (
		<div className="h-100 w-100 flex flex-column">
			<div className="h-100 flex flex-row-l flex-column-l flex-column-reverse">
				{nodeId && (
					<div className="w-100 h-100 overflow-y-scroll map-sidebar">
						<Node id={nodeId} />
					</div>
				)}
				{requestId && (
					<div className="w-100 h-100 overflow-y-scroll map-sidebar">
						<Request id={requestId} />
					</div>
				)}
				{memberId && (
					<div className="w-100 h-100 overflow-y-scroll map-sidebar">
						<Member id={memberId} />
					</div>
				)}
				<MapComponent
					nodes={nodes}
					links={links}
					requests={requests}
					selectedNodes={selectedNodes}
					selectedRequests={selectedRequests}
					onNodeClick={handleNodeClick}
					onRequestClick={handleRequestClick}
					onClick={handleMapClick}
					onLoad={(map) => {
						setMap(map);
					}}
				/>
			</div>
		</div>
	);
}
