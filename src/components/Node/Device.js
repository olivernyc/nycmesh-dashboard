import React from "react";

import Status from "../Status";

export default function Device(props) {
	const { device } = props;
	return (
		<div className="pv2 flex bb b--light-gray">
			{sector(device)}
			<div>
				<div className="mb1 flex items-center">
					<span className="fw5 mr2">{device.type.name}</span>
					<Status status={device.status} />
				</div>
				<span className="mid-gray">
					{device.type.width}° {deviceDirection(device)}
				</span>
			</div>
		</div>
	);
}

function sector(device) {
	const rotate = device.azimuth;
	const skew = device.type.width - 90;

	if (device.type.width === 360)
		return (
			<div className="h2 w2 ml1 mr2 flex items-center justify-center mr2">
				<div className="h1 w1 br-pill bg-blue o-40" />
			</div>
		);
	return (
		<div className="h2 w2 ml1 mr2">
			<div className="pie">
				<button
					className="bg-blue o-40"
					style={{
						transform: `rotate(${rotate}deg) skewY(${skew}deg)`,
					}}
				/>
			</div>
		</div>
	);
}

function deviceDirection(device) {
	const { azimuth } = device;
	if (device.type.width === 360) return "";
	if (azimuth >= 337.5 || azimuth < 22.5) return "N";
	if (azimuth >= 22.5 && azimuth < 67.5) return "NE";
	if (azimuth >= 67.5 && azimuth < 112.5) return "E";
	if (azimuth >= 112.5 && azimuth < 157.5) return "SE";
	if (azimuth >= 157.5 && azimuth < 202.5) return "S";
	if (azimuth >= 202.5 && azimuth < 247.5) return "SW";
	if (azimuth >= 247.5 && azimuth < 292.5) return "W";
	if (azimuth >= 292.5 && azimuth < 337.5) return "NW";
}
