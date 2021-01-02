import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript } from "@react-google-maps/api";

import NodeLayer from "./NodeLayer";
import RequestLayer from "./RequestLayer";
import LinkLayer from "./LinkLayer";
import { styles, darkStyles } from "./styles";

const DEFAULT_ZOOM = 12;
const DEFAULT_CENTER = { lat: 40.69, lng: -73.9595798 };

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

	const colorScheme = useColorScheme();
	const colorStyles =
		colorScheme === "dark" ? [...styles, ...darkStyles] : styles;

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
		styles: colorStyles,
	};

	return (
		<div
			className="h-100-l w-100 flex flex-column"
			style={{ height: "calc(100vh - 51px)" }}
		>
			<LoadScript
				id="script-loader"
				googleMapsApiKey="AIzaSyBNClp7oJsw-eleEoR3-PQKV23tpeW-FpE"
				loadingElement={<div className="flex h-100 w-100 bg-white" />}
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
					<RequestLayer requests={requests} onClick={onRequestClick} />
					<LinkLayer links={links} />
				</GoogleMap>
			</LoadScript>
		</div>
	);
}

function useColorScheme() {
	const [colorScheme, setColorScheme] = useState(
		window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
	);

	const changeHandler = (e) => {
		const newColorScheme = e.matches ? "dark" : "light";
		setColorScheme(newColorScheme);
	};

	useEffect(() => {
		window
			.matchMedia("(prefers-color-scheme: dark)")
			.addEventListener("change", changeHandler);
		return () => {
			window
				.matchMedia("(prefers-color-scheme: dark)")
				.removeEventListener("change", changeHandler);
		};
	});

	return colorScheme;
}

export default React.memo(MapComponent);
