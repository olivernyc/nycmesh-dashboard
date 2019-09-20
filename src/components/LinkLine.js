import React from "react";
import { Polyline } from "react-google-maps";

export default function LinkLine(props) {
	const { link, visible } = props;
	const { nodes, devices, device_types } = link; // TODO: This is weird
	const { lat: lat1, lng: lng1 } = devices[0];
	const { lat: lat2, lng: lng2 } = devices[1];
	const path = [{ lat: lat1, lng: lng1 }, { lat: lat2, lng: lng2 }];
	const strokeColor = getColor(
		nodes[0],
		nodes[1],
		device_types[0],
		device_types[1]
	);
	const strokeWeight = getWeight(
		nodes[0],
		nodes[1],
		device_types[0],
		device_types[1]
	);
	const zIndex = getZIndex(
		nodes[0],
		nodes[1],
		device_types[0],
		device_types[1]
	);
	const options = {
		strokeColor,
		strokeWeight,
		strokeOpacity: 1,
		zIndex
	};
	return <Polyline path={path} options={options} visible={visible} />;
}

const isSupernode = node => node.name && node.name.includes("Supernode");
const isHub = node => node.notes && node.notes.includes("hub");
const isOmni = device_type => device_type.name === "Omni";
const isBackbone = (node, device_type) =>
	isSupernode(node) || isHub(node) || isOmni(device_type);

function getColor(node1, node2, device_type1, device_type2) {
	if (isBackbone(node1, device_type1) && isBackbone(node2, device_type2))
		return "rgba(0,122,255,0.75)";
	return "rgba(255,45,85,0.5)";
}

function getWeight(node1, node2, device_type1, device_type2) {
	if (
		(isHub(node1) || isSupernode(node1)) &&
		(isHub(node2) || isSupernode(node2))
	)
		return 2.5;
	return 1.5;
}

function getZIndex(node1, node2, device_type1, device_type2) {
	if (
		(isHub(node1) || isSupernode(node1)) &&
		(isHub(node2) || isSupernode(node2))
	)
		return 2;
	return 1;
}
