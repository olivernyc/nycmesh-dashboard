import React, { useState, useEffect } from "react";
import { withScriptjs, withGoogleMap, GoogleMap } from "react-google-maps";
import Octicon, { Settings } from "@primer/octicons-react";
import { useAuth0 } from "../Auth0";

import Button from "../Button";
import NodeMarker from "./NodeMarker";
import LinkLine from "./LinkLine";
import Sector from "./Sector";
import { fetchResource } from "../../api";

const DEFAULT_ZOOM = 11;
const DEFAULT_CENTER = { lat: 40.69, lng: -73.9595798 };
const MAP_STYLES = [
	{
		elementType: "labels.icon",
		stylers: [
			{
				visibility: "off"
			}
		]
	},
	{
		featureType: "road",
		elementType: "labels.icon",
		stylers: [
			{
				visibility: "off"
			}
		]
	},
	{
		featureType: "road.highway",
		stylers: [
			{
				visibility: "off"
			}
		]
	},
	{
		featureType: "transit",
		stylers: [
			{
				visibility: "off"
			}
		]
	}
];

const options = {
	styles: MAP_STYLES,
	fullscreenControl: false,
	streetViewControl: false,
	mapTypeControl: false,
	zoomControlOptions: {
		position: "9"
	},
	mapTypeControlOptions: {
		position: "3"
	},
	backgroundColor: "#fff",
	gestureHandling: "greedy",
	clickableIcons: false
};

const GoogleMapComponent = withScriptjs(
	withGoogleMap(props => (
		<GoogleMap ref={props.mapRef} {...props}>
			{props.children}
		</GoogleMap>
	))
);

export default function MapComponent(props) {
	const { nodes, links } = props;
	if (!nodes || !links) throw new Error("Missing nodes or links");
	return (
		<div className="h-100 w-100 flex flex-column">
			<GoogleMapComponent
				defaultZoom={DEFAULT_ZOOM}
				defaultCenter={DEFAULT_CENTER}
				defaultOptions={options}
				loadingElement={<div className="flex" style={{ flex: 1 }} />}
				containerElement={<div className="flex" style={{ flex: 1 }} />}
				mapElement={<div className="g-map flex" style={{ flex: 1 }} />}
				googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyBNClp7oJsw-eleEoR3-PQKV23tpeW-FpE"
			>
				<NodeLayer nodes={nodes} />
				<LinkLayer links={links} />
				<SectorLayer nodes={nodes} />
			</GoogleMapComponent>
		</div>
	);
}

function NodeLayer(props) {
	const { nodes } = props;
	return nodes.map(node => <NodeMarker key={node.id} node={node} />);
}

function LinkLayer(props) {
	const { links } = props;
	return links.map(link => <LinkLine key={link.id} link={link} />);
}

function SectorLayer(props) {
	const { nodes } = props;
	return nodes.map(node =>
		node.devices.map((device, index) => (
			<Sector key={device.id} device={device} />
		))
	);
}
