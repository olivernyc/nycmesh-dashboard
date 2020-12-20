import React from "react";
import { Marker } from "@react-google-maps/api";

export default function RequestMarker(props) {
	const { request, visible, onClick, dimmed } = props;
	const { id, building } = request;
	const { lat, lng } = building;
	const title = String(id);
	const icon = {
		url: "/img/map/request.svg",
		anchor: { x: 6, y: 6 },
	};
	const zIndex = 0;
	const opacity = dimmed ? 0.5 : 1;
	if (lat === "NaN" || lng === "NaN") return null;
	return (
		<Marker
			position={{ lat, lng }}
			title={title}
			icon={icon}
			options={{ opacity }}
			zIndex={zIndex}
			visible={visible}
			onClick={onClick}
		/>
	);
}
