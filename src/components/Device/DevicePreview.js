import React from "react";

import Status from "../Status";

export default function DevicePreview(props) {
	const { device } = props;
	return (
		<div className="pv2 flex bb b--light-gray black">
			{sector(device)}
			<div>
				<div className="mb1 flex items-center">
					<span className="fw5 mr2">{device.type.name}</span>
					<Status status={device.status} />
				</div>
				<span className="mid-gray">{device.ssid || "No SSID"}</span>
			</div>
		</div>
	);
}

function sector(device) {
	const rotate = device.azimuth - device.type.width / 2;
	const skew = device.type.width - 90;

	if (!device.type.width)
		return (
			<div className="h2 w2 ml1 mr2 flex items-center justify-center mr2">
				<div className="h05 w05 br-pill bg-blue o-40" />
			</div>
		);

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
