import React, { useState, useEffect } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";

import NodeLayer from "./NodeLayer";
import RequestLayer from "./RequestLayer";
import LinkLayer from "./LinkLayer";
import Filters from "./Filters";
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
		zoomControl: false,
		mapTypeControlOptions: {
			position: 7,
		},
		backgroundColor: "transparent",
		gestureHandling: "greedy",
		clickableIcons: false,
		styles: colorStyles,
	};

	const { isLoaded, loadError } = useJsApiLoader({
		googleMapsApiKey: "AIzaSyBNClp7oJsw-eleEoR3-PQKV23tpeW-FpE",
		loadingElement: <div className="flex h-100 w-100 bg-white" />,
	});

	if (loadError) {
		return <div>Error loading map</div>;
	}

	if (!isLoaded) return null;

	return (
		<div className="h-100-l vh-75 w-100 flex flex-column">
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
				<Filters />
			</GoogleMap>
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
