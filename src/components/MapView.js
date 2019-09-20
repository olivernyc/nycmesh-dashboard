import React, { useState, useEffect } from "react";
import { withScriptjs, withGoogleMap, GoogleMap } from "react-google-maps";
import Octicon, { Settings } from "@primer/octicons-react";
import { useAuth0 } from "../react-auth0-wrapper";

import Button from "./Button";
import NodeMarker from "./NodeMarker";
import LinkLine from "./LinkLine";
import Sector from "./Sector";
import { fetchResource } from "../api";

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
	backgroundColor: "#f5f5f5",
	gestureHandling: "greedy",
	clickableIcons: false
};

const MapComponent = withScriptjs(
	withGoogleMap(props => (
		<GoogleMap ref={props.mapRef} {...props}>
			{props.children}
		</GoogleMap>
	))
);

export default function NodeMap(props) {
	const [nodes, setNodes] = useState([]);
	const [links, setLinks] = useState([]);
	const { isAuthenticated, getTokenSilently } = useAuth0();
	useEffect(() => {
		async function fetchNodes() {
			const token = await getTokenSilently();
			const nodesRes = await fetchResource("nodes", token);
			setNodes(nodesRes);
		}
		async function fetchLinks() {
			const token = await getTokenSilently();
			const linksRes = await fetchResource("links", token);
			setLinks(linksRes);
		}
		if (!isAuthenticated) return;
		fetchNodes();
		fetchLinks();
	}, [isAuthenticated, getTokenSilently]);
	return (
		<div className="h-100 w-100 flex flex-column">
			<div className="flex items-center justify-between ph4-ns ph3">
				<h1 className="mv0 f5 fw5 ttc pv3">Map</h1>
				<div>
					<Button
						title="Filters"
						icon={<Octicon icon={Settings} />}
					/>
				</div>
			</div>
			<MapComponent
				defaultZoom={DEFAULT_ZOOM}
				defaultCenter={DEFAULT_CENTER}
				defaultOptions={options}
				loadingElement={<div className="flex" style={{ flex: 1 }} />}
				containerElement={<div className="flex" style={{ flex: 1 }} />}
				mapElement={<div className="flex" style={{ flex: 1 }} />}
				googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyBNClp7oJsw-eleEoR3-PQKV23tpeW-FpE"
			>
				<NodeLayer nodes={nodes} />
				<LinkLayer links={links} />
				<SectorLayer nodes={nodes} />
			</MapComponent>
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
