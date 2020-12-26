import React from "react";
import { GoogleMap, LoadScript } from "@react-google-maps/api";

import NodeLayer from "./NodeLayer";
import RequestLayer from "./RequestLayer";
import LinkLayer from "./LinkLayer";
import { styles, darkStyles } from "./styles";

const DEFAULT_ZOOM = 12;
const DEFAULT_CENTER = { lat: 40.69, lng: -73.9595798 };

// TODO: Add event listener to handle darkmode change
const darkMode =
	window.matchMedia &&
	window.matchMedia("(prefers-color-scheme: dark)").matches;

if (darkMode) {
	styles.push(...darkStyles);
}

const options = {
	fullscreenControl: false,
	streetViewControl: false,
	mapTypeControl: false,
	zoomControlOptions: {
		position: 9,
	},
	mapTypeControlOptions: {
		position: 7,
	},
	backgroundColor: "transparent",
	gestureHandling: "greedy",
	clickableIcons: false,
	styles,
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
					mapContainerClassName="flex h-100 w-100 bg-white"
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
