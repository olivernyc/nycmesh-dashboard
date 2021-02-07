import React, { useContext } from "react";
import { Polyline } from "@react-google-maps/api";
import { MapContext } from ".";

export default function LinkLine({ link }) {
	const { selectedNode, nodesById } = useContext(MapContext);
	const [nodeId1, nodeId2] = link.devices.map((d) => d.node_id);
	const selected = selectedNode === nodeId1 || selectedNode === nodeId2;
	const dimmed =
		selectedNode && selectedNode !== nodeId1 && selectedNode !== nodeId2;
	return (
		<LinkLineMemo
			link={link}
			selected={selected}
			dimmed={dimmed}
			nodesById={nodesById}
		/>
	);
}

function LinkLine2({ link, selected, dimmed, nodesById }) {
	const [device1, device2] = link.devices;
	const [node1, node2] = link.devices.map((d) => nodesById[d.node_id]);
	if (!device1 || !device2 || !node1 || !node2) {
		console.error("Link missing node or device", link);
		return null;
	}
	const path = [
		{ lat: device1.lat, lng: device1.lng },
		{ lat: device2.lat, lng: device2.lng },
	];
	const strokeColor = getColor(node1, node2);
	const strokeOpacity = getOpacity(
		node1,
		node2,
		device1,
		device2,
		dimmed,
		selected
	);
	const strokeWeight = getWeight(node1, node2, device1, device2);
	const zIndex = getZIndex(node1, node2, device1, device2);
	const options = {
		strokeColor,
		strokeWeight,
		strokeOpacity,
		zIndex,
	};
	return <Polyline path={path} options={options} />;
}

const LinkLineMemo = React.memo(LinkLine2);

const isSupernode = (node) => node.name && node.name.includes("Supernode");
const isHub = (node) => node.notes && node.notes.toLowerCase().includes("hub");
const hasOmni = (node) =>
	node.devices.filter((d) => d.type.name === "Omni").length;
const isBackbone = (node, device) =>
	isSupernode(node) || isHub(node) || hasOmni(node);

function getColor(node1, node2) {
	if (isSupernode(node1) && isSupernode(node2)) return "rgb(0,122,255)";
	if (isSupernode(node1) && isHub(node2)) return "rgb(0,122,255)";
	if (isHub(node1) && isSupernode(node2)) return "rgb(0,122,255)";
	if (isHub(node1) && isHub(node2)) return "rgb(0,122,255)";
	if (isBackbone(node1) && isBackbone(node2)) return "rgb(100,210,255)";
	return "rgb(255,45,85)";
}

function getOpacity(node1, node2, device1, device2, dimmed, selected) {
	if (selected) return 1;
	if (dimmed) return 0.2;
	if (
		(isHub(node1) || isSupernode(node1)) &&
		(isHub(node2) || isSupernode(node2))
	)
		return 1;
	if (isBackbone(node1, device1) && isBackbone(node2, device2)) return 1;
	return 0.75;
}

function getWeight(node1, node2) {
	if (
		(isHub(node1) || isSupernode(node1)) &&
		(isHub(node2) || isSupernode(node2))
	)
		return 2;
	return 2;
}

function getZIndex(node1, node2) {
	if (
		(isHub(node1) || isSupernode(node1)) &&
		(isHub(node2) || isSupernode(node2))
	)
		return 2;
	return 1;
}
