import React, { useContext, useCallback } from "react";
import { Marker } from "@react-google-maps/api";

import Sector from "./Sector";
import Tooltip from "./Tooltip";
import { MapContext } from ".";

export default React.memo(NodeMarker);

function NodeMarker({ node, onClick }) {
	const { selectedNode, connectedNodes } = useContext(MapContext);
	const neighbors = connectedNodes[node.id];
	const isSelected = selectedNode === node.id;
	const isNeighbor =
		neighbors && neighbors.filter((n) => n.id === selectedNode).length;
	const isDimmed = selectedNode && !isSelected && !isNeighbor;
	const onClickMemo = useCallback(() => onClick(node), [node, onClick]);
	return (
		<NodeMarkerMemo
			node={node}
			isSelected={isSelected}
			isNeighbor={isNeighbor}
			isDimmed={isDimmed}
			onClick={onClickMemo}
		/>
	);
}

const NodeMarkerMemo = React.memo(NodeMarker2);

function NodeMarker2({ node, isSelected, isNeighbor, isDimmed, onClick }) {
	const { lat, lng } = node;
	const title = node.name || String(node.id);
	const icon = getIcon(node);
	let zIndex = getZ(node);
	const opacity = isDimmed ? 0.25 : 1;
	if (node.status !== "active" && !isSelected) return null;
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
			<SectorsMemo
				node={node}
				isSelected={isSelected}
				isNeighbor={isNeighbor}
				isDimmed={isDimmed}
			/>
			{isSelected && (
				<Tooltip lat={lat} lng={lng} label={node.name || node.id} />
			)}
		</React.Fragment>
	);
}

const SectorsMemo = React.memo(Sectors2);

function Sectors2({ node, isSelected, isNeighbor, isDimmed }) {
	const opacityMultiplier = isSelected ? 2 : isNeighbor ? 0 : isDimmed ? 0 : 1;
	return node.devices.map((device) => (
		<Sector
			key={device.id}
			device={device}
			opacityMultiplier={opacityMultiplier}
			isSelected={isSelected}
		/>
	));
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
	if (notes && notes.toLowerCase().includes("hub"))
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

	if (name && name.includes("Supernode")) return 5;
	if (notes && notes.toLowerCase().includes("hub")) return 4;
	if (devices.filter((device) => device.type.name === "Omni").length) return 3;
	return 2;
}
