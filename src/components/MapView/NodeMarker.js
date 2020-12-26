import React, { useContext } from "react";
import { Marker } from "@react-google-maps/api";

import Sector from "./Sector";
import Tooltip from "./Tooltip";
import { MapContext } from ".";

export default function NodeMarker({ node, onClick }) {
	const { selectedNode } = useContext(MapContext);
	const selected =
		selectedNode === node.id ||
		(node.connected_nodes &&
			node.connected_nodes.filter((n) => n.id === selectedNode).length);
	const dimmed = selectedNode && selectedNode !== node.id;
	return (
		<NodeMarkerMemo
			node={node}
			selected={selected}
			dimmed={dimmed}
			onClick={onClick}
		/>
	);
}

const NodeMarkerMemo = React.memo(NodeMarker2);

function NodeMarker2({ node, selected, dimmed, onClick }) {
	const { lat, lng } = node;
	const title = node.name || String(node.id);
	const icon = getIcon(node);
	const zIndex = getZ(node);
	const opacity = dimmed ? 0.25 : 1;
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
			{node.devices.map((device, index) => (
				<Sector key={device.id} device={device} dimmed={dimmed} />
			))}
			{selected && (
				<Tooltip lat={lat} lng={lng} label={node.name || node.id} />
			)}
		</React.Fragment>
	);
}

function getIcon(node) {
	const { name, notes, devices } = node;

	// Supernode -- TODO: Have a flag in db like "upstream"
	if (name && name.includes("Supernode"))
		return {
			url: "/img/map/supernode.svg",
			anchor: { x: 9, y: 9 },
		};

	// Hub
	if (notes && notes.includes("hub"))
		return {
			url: "/img/map/hub.svg",
			anchor: { x: 9, y: 9 },
		};

	// Omni
	if (devices.filter((device) => device.type.name === "Omni").length)
		return {
			url: "/img/map/omni.svg",
			anchor: { x: 6, y: 6 },
		};

	return {
		url: "/img/map/active.svg",
		anchor: { x: 6, y: 6 },
	};
}

function getZ(node) {
	const { name, notes, devices } = node;

	if (name && name.includes("Supernode")) return 4;
	if (notes && notes.includes("hub")) return 3;
	if (devices.filter((device) => device.type.name === "Omni").length)
		return 2;
	return 1;
}
