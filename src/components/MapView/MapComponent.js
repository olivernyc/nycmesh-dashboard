import React from "react";
import { GoogleMap, LoadScript } from "@react-google-maps/api";

import NodeLayer from "./NodeLayer";
import RequestLayer from "./RequestLayer";
import LinkLayer from "./LinkLayer";

import Tooltip from "./Tooltip";

const DEFAULT_ZOOM = 11;
const DEFAULT_CENTER = { lat: 40.69, lng: -73.9595798 };

const options = {
	fullscreenControl: false,
	streetViewControl: false,
	mapTypeControl: false,
	zoomControlOptions: {
		position: "9",
	},
	mapTypeControlOptions: {
		position: "3",
	},
	backgroundColor: "#fff",
	gestureHandling: "greedy",
	clickableIcons: false,
	styles: [
		{
			elementType: "labels.icon",
			stylers: [
				{
					visibility: "off",
				},
			],
		},
		{
			featureType: "road",
			elementType: "labels.icon",
			stylers: [
				{
					visibility: "off",
				},
			],
		},
	],
};

function MapComponent(props) {
	console.log("render map");
	const { nodes, links, requests, selectedNodes = [] } = props;
	if (!nodes || !links) throw new Error("Missing nodes or links");

	return (
		<div className="h-100-l h5 w-100 flex flex-column">
			<LoadScript
				id="script-loader"
				googleMapsApiKey="AIzaSyBNClp7oJsw-eleEoR3-PQKV23tpeW-FpE"
				loadingElement={<div />}
			>
				<GoogleMap
					zoom={DEFAULT_ZOOM}
					center={DEFAULT_CENTER}
					options={options}
					mapContainerClassName="flex h-100 w-100"
					onLoad={props.onLoad}
					onClick={props.onClick}
				>
					<NodeLayer
						nodes={props.nodes}
						selectedNodes={props.selectedNodes}
						onClick={props.onNodeClick}
					/>
					<LinkLayer links={links} />
					<RequestLayer
						requests={requests}
						selectedNodes={props.selectedNodes}
						onClick={props.onRequestClick}
					/>
					{Object.values(selectedNodes).map((node) => (
						<Tooltip node={node} />
					))}
				</GoogleMap>
			</LoadScript>
		</div>
	);
}

export default React.memo(MapComponent);
