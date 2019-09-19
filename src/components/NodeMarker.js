import React from "react";
import { Marker } from "react-google-maps";

export default function NodeMarker(props) {
	const { node, visible, onClick } = props;
	const { notes, lat, lng, name } = node;
	const title = node.name || String(node.id);
	const icon = getIcon(node);
	const zIndex = getZ(node);
	const opacity = 1;
	return (
		<Marker
			defaultPosition={{ lat, lng }}
			defaultTitle={title}
			icon={icon}
			options={{ opacity }}
			zIndex={zIndex}
			visible={visible}
			onClick={onClick}
		/>
	);
}

function getIcon(node) {
	const { name, notes, device_types } = node;

	// Supernode -- TODO: Have a flag in db like "upstream"
	if (name && name.includes("Supernode"))
		return {
			url: "/img/map/supernode.svg",
			anchor: { x: 9, y: 9 }
		};

	// Hub
	if (notes && notes.includes("hub"))
		return {
			url: "/img/map/hub.svg",
			anchor: { x: 9, y: 9 }
		};

	// Omni
	if (device_types && device_types.filter(d => d.name !== "Unknown").length)
		// TODO: Less hacky
		return {
			url: "/img/map/omni.svg",
			anchor: { x: 6, y: 6 }
		};

	return {
		url: "/img/map/active.svg",
		anchor: { x: 6, y: 6 }
	};
}

function getZ(node) {
	const { name, notes, device_types } = node;

	if (name && name.includes("Supernode")) return 4;
	if (notes && notes.includes("hub")) return 3;
	if (device_types && device_types.filter(d => d.name === "Omni").length)
		return 2;
	return 1;
}
