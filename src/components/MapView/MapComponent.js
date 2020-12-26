import React from "react";
import { GoogleMap, LoadScript } from "@react-google-maps/api";

import NodeLayer from "./NodeLayer";
import RequestLayer from "./RequestLayer";
import LinkLayer from "./LinkLayer";

const DEFAULT_ZOOM = 12;
const DEFAULT_CENTER = { lat: 40.69, lng: -73.9595798 };

const options = {
	fullscreenControl: false,
	streetViewControl: false,
	mapTypeControl: true,
	zoomControlOptions: {
		position: 9,
	},
	mapTypeControlOptions: {
		position: 7,
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

function MapComponent({
	nodes,
	links,
	requests,
	onLoad,
	onClick,
	onNodeClick,
	onRequestClick,
}) {
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
					onLoad={onLoad}
					onClick={onClick}
				>
					<NodeLayer nodes={nodes} onClick={onNodeClick} />
					<RequestLayer
						requests={requests}
						onClick={onRequestClick}
					/>
					<LinkLayer links={links} />
				</GoogleMap>
			</LoadScript>
		</div>
	);
}

export default React.memo(MapComponent);
