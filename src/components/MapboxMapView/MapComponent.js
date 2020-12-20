import React, { useState, useEffect } from "react";
import ReactMapGL, {
	Layer,
	Marker,
	Popup,
	Source,
	FlyToInterpolator,
} from "react-map-gl";

function MapComponent(props) {
	const { selectedNode, onMarkerClick, onMapClick } = props;

	const [viewport, setViewport] = useState({
		latitude: 40.72,
		longitude: -73.9595798,
		zoom: 11,
	});

	const buildingLayer = {
		id: "3d-buildings",
		source: "composite",
		"source-layer": "building",
		filter: ["==", "extrude", "true"],
		type: "fill-extrusion",
		minzoom: 15,
		paint: {
			"fill-extrusion-color": "#eee",
			"fill-extrusion-height": ["get", "height"],
			"fill-extrusion-opacity": 0.6,
		},
	};

	return (
		<ReactMapGL
			{...viewport}
			width="100%"
			height="100%"
			mapboxApiAccessToken="pk.eyJ1Ijoib2xpdmVybWVzaCIsImEiOiJjazhmMTA5MXAwMjE5M2ltcG01c2htZHBzIn0.-JsGM7fBiC7L7yhAnrLlbA"
			mapStyle="mapbox://styles/olivermesh/ck9oz9ski3zcr1iqqd8m60ovb"
			onViewportChange={setViewport}
			onClick={onMapClick}
		>
			<Layer {...buildingLayer} />
			<MemoLinks links={props.links} />
			<MemoMarkers
				nodes={props.nodes}
				requests={props.requests}
				// onClick={(node) => {
				// 	setViewport({
				// 		...viewport,
				// 		latitude: node.lat,
				// 		longitude: node.lng,
				// 		transitionDuration: 100,
				// 	});
				// 	onMarkerClick(node);
				// }}
			/>
			{selectedNode && (
				<Popup
					latitude={selectedNode.lat}
					longitude={selectedNode.lng}
					closeButton={false}
					tipSize={5}
				>
					<div>{selectedNode.name || selectedNode.id}</div>
				</Popup>
			)}
		</ReactMapGL>
	);
}

const MemoMarkers = React.memo(Markers);

function Markers(props) {
	console.log("render markers");
	const nodeMarkers = props.nodes.map((node) => {
		if (node.status !== "active") return null;
		const size = nodeSize(node);
		const strokeWidth = nodeStroke(node);
		return (
			<Marker
				key={`node-${node.id}`}
				latitude={node.lat}
				longitude={node.lng}
				offsetLeft={-size / 2}
				offsetTop={-size / 2}
				captureDrag={false}
			>
				<svg
					width={size}
					height={size}
					viewBox={`0 0 ${size} ${size}`}
					style={{
						cursor: "pointer",
						fill: nodeColor(node),
					}}
				>
					<g>
						<circle
							cx={size / 2}
							cy={size / 2}
							r={size / 2 - strokeWidth}
							stroke="white"
							strokeWidth={strokeWidth}
							onClick={() => props.onClick(node)}
						/>
					</g>
				</svg>
			</Marker>
		);
	});

	const requestMarkers = props.requests.map((request) => {
		const size = 14;
		const strokeWidth = 2;
		const color = "#555";
		if (isNaN(request.building.lat) || isNaN(request.building.lng))
			return null;
		return (
			<Marker
				key={`request-${request.id}`}
				latitude={request.building.lat}
				longitude={request.building.lng}
				offsetLeft={-size / 2}
				offsetTop={-size / 2}
				captureDrag={false}
			>
				<svg
					width={size}
					height={size}
					viewBox={`0 0 ${size} ${size}`}
					style={{
						cursor: "pointer",
						fill: color,
					}}
				>
					<g>
						<circle
							cx={size / 2}
							cy={size / 2}
							r={size / 2 - strokeWidth}
							stroke="white"
							strokeWidth={strokeWidth}
							// onClick={() => props.onClick(request)}
						/>
					</g>
				</svg>
			</Marker>
		);
	});

	return [...requestMarkers, ...nodeMarkers];

	function nodeColor(node) {
		const { name, notes, devices } = node;
		if (isSupernode(node)) return "#007aff";
		if (isHub(node)) return "#007aff";
		if (devices.filter(isOmni).length) return "#007aff";
		return "#f00";
	}

	function nodeSize(node) {
		const { name, notes, devices } = node;
		if (isSupernode(node)) return 24;
		if (isHub(node)) return 20;
		if (devices.filter(isOmni).length) return 14;
		return 14;
	}

	function nodeStroke(node) {
		const { name, notes, devices } = node;
		if (isSupernode(node)) return 4;
		if (isHub(node)) return 3;
		if (devices.filter(isOmni).length) return 2;
		return 2;
	}
}

const MemoLinks = React.memo(Links);

function Links(props) {
	const { links } = props;
	const geojson = {
		type: "FeatureCollection",
		features: links
			.filter((link) => link.status === "active")
			.map((link) => ({
				type: "Feature",
				properties: {
					color: linkColor(link),
				},
				geometry: {
					type: "LineString",
					coordinates: [
						[link.devices[0].lng, link.devices[0].lat],
						[link.devices[1].lng, link.devices[1].lat],
					],
				},
			})),
	};
	return (
		<Source id={`links`} type="geojson" data={geojson}>
			<Layer
				id={`links`}
				type="line"
				paint={{
					"line-width": 2,
					"line-color": ["get", "color"],
				}}
			/>
		</Source>
	);

	function linkColor(link) {
		const { nodes, devices } = link;
		if (isHub(nodes[0]) && isHub(nodes[1])) return "rgba(0,122,255,1)";
		if (
			isBackbone(nodes[0], devices[0]) &&
			isBackbone(nodes[1], devices[1])
		)
			return "rgba(0,122,255,1)";
		return "rgba(255,0,0,0.5)";
	}
}

function isOmni(device) {
	return device.type.name === "Omni";
}
function isSupernode(node) {
	return node.name && node.name.includes("Supernode");
}
function isHub(node) {
	return node.notes && node.notes.includes("hub");
}
function isBackbone(node, device) {
	return isSupernode(node) || isHub(node) || isOmni(device);
}

export default MapComponent;
