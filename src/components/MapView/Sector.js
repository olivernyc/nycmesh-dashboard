import React, { useState, useEffect } from "react";
import { Polygon } from "@react-google-maps/api";

const INTERVAL_PER_MILE = 8;

export default React.memo(Sector);

function Sector({ device, opacityMultiplier = 1 }) {
	const { range } = device.type;
	const intervalCount = Math.ceil(INTERVAL_PER_MILE * range);
	const fillOpacity =
		((range < 1 ? 0.04 : 0.05) / intervalCount) * opacityMultiplier;
	const fillColor = range < 1 ? "rgb(90,200,250)" : "rgb(0,122,255)";

	const paths = usePaths(device, intervalCount);

	return paths.map((path, index) => {
		return (
			<Polygon
				key={index}
				path={path}
				options={{
					strokeColor: "transparent",
					strokeOpacity: 0,
					strokeWidth: 0,
					fillColor,
					fillOpacity: fillOpacity / ((index + 1) / paths.length),
					clickable: false,
					zIndex: 1,
				}}
			/>
		);
	});
}

function usePaths(device, intervalCount) {
	const [paths, setPaths] = useState([]);
	useEffect(() => {
		const stepSize = device.type.range / intervalCount;
		const radiusIndices = [...Array(intervalCount).keys()];
		const paths = radiusIndices.map((index) =>
			getPath(device, stepSize * (index + 1))
		);
		setPaths(paths);
	}, [device, intervalCount]);
	return paths;
}

function getPath(device, radius) {
	const { lat, lng, azimuth } = device;
	const { width } = device.type;
	var centerPoint = { lat, lng };
	var PRlat = (radius / 3963) * (180 / Math.PI); // using 3963 miles as earth's radius
	var PRlng = PRlat / Math.cos(lat * (Math.PI / 180));
	var PGpoints = [];
	PGpoints.push(centerPoint);

	const lat1 = lat + PRlat * Math.cos((Math.PI / 180) * (azimuth - width / 2));
	const lon1 = lng + PRlng * Math.sin((Math.PI / 180) * (azimuth - width / 2));
	PGpoints.push({ lat: lat1, lng: lon1 });

	const lat2 = lat + PRlat * Math.cos((Math.PI / 180) * (azimuth + width / 2));
	const lon2 = lng + PRlng * Math.sin((Math.PI / 180) * (azimuth + width / 2));

	var theta = 0;
	var gamma = (Math.PI / 180) * (azimuth + width / 2);

	for (var a = 1; theta < gamma; a++) {
		theta = (Math.PI / 180) * (azimuth - width / 2 + a);
		const PGlon = lng + PRlng * Math.sin(theta);
		const PGlat = lat + PRlat * Math.cos(theta);

		PGpoints.push({ lat: PGlat, lng: PGlon });
	}

	PGpoints.push({ lat: lat2, lng: lon2 });
	PGpoints.push(centerPoint);

	return PGpoints;
}
