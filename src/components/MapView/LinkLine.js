import React from "react";
import { Polyline } from "@react-google-maps/api";

export default function LinkLine(props) {
	const { link, visible } = props;
	const { nodes, devices } = link; // TODO: This is weird
	const { lat: lat1, lng: lng1 } = devices[0];
	const { lat: lat2, lng: lng2 } = devices[1];
	const path = [
		{ lat: lat1, lng: lng1 },
		{ lat: lat2, lng: lng2 },
	];
	const strokeColor = getColor(nodes[0], nodes[1], devices[0], devices[1]);
	const strokeOpacity = getOpacity(
		nodes[0],
		nodes[1],
		devices[0],
		devices[1]
	);
	const strokeWeight = getWeight(nodes[0], nodes[1], devices[0], devices[1]);
	const zIndex = getZIndex(nodes[0], nodes[1], devices[0], devices[1]);
	const options = {
		strokeColor,
		strokeWeight,
		strokeOpacity,
		zIndex,
	};
	return <Polyline path={path} options={options} visible={visible} />;
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

function getOpacity(node1, node2, device1, device2) {
	if (
		(isHub(node1) || isSupernode(node1)) &&
		(isHub(node2) || isSupernode(node2))
	)
		return 1;
	if (isBackbone(node1, device1) && isBackbone(node2, device2)) return 1;
	return 0.5;
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
