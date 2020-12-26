import React, { useContext } from "react";
import { Polyline } from "@react-google-maps/api";
import { MapContext } from ".";

export default function LinkLine({ link }) {
	const { selectedNode } = useContext(MapContext);
	const selected =
		selectedNode === link.nodes[0].id || selectedNode === link.nodes[1].id;
	const dimmed =
		selectedNode &&
		selectedNode !== link.nodes[0].id &&
		selectedNode !== link.nodes[1].id;
	return <LinkLineMemo link={link} selected={selected} dimmed={dimmed} />;
}

const LinkLineMemo = React.memo(LinkLine2);

function LinkLine2({ link, selected, dimmed }) {
	// TODO: This is weird
	const [node1, node2] = link.nodes;
	const [device1, device2] = link.devices;
	const path = [
		{ lat: device1.lat, lng: device1.lng },
		{ lat: device2.lat, lng: device2.lng },
	];
	const strokeColor = getColor(node1, node2, device1, device2);
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

const isSupernode = (node) => node.name && node.name.includes("Supernode");
const isHub = (node) => node.notes && node.notes.includes("hub");
const isOmni = (device) => device.type.name === "Omni";
const isBackbone = (node, device) =>
	isSupernode(node) || isHub(node) || isOmni(device);

function getColor(node1, node2, device1, device2) {
	if (isSupernode(node1) && isSupernode(node2)) return "rgb(0,122,255)";
	if (isSupernode(node1) && isHub(node2)) return "rgb(0,122,255)";
	if (isHub(node1) && isSupernode(node2)) return "rgb(0,122,255)";
	if (isHub(node1) && isHub(node2)) return "rgb(0,122,255)";
	if (isBackbone(node1, device1) && isBackbone(node2, device2))
		return "rgb(90,200,250)";
	return "rgb(255,45,85)";
}

function getOpacity(node1, node2, device1, device2, dimmed, selected) {
	if (selected) return 1;
	if (dimmed) return 0.25;
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
