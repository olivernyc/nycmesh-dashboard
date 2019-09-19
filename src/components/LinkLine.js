import React from "react";
import { Polyline } from "react-google-maps";

export default function LinkLine(props) {
	const { link, visible } = props;
	const { devices } = link;
	const { lat: lat1, lng: lng1 } = devices[0];
	const { lat: lat2, lng: lng2 } = devices[1];
	const path = [{ lat: lat1, lng: lng1 }, { lat: lat2, lng: lng2 }];
	const options = {
		strokeColor: "rgba(0,122,255,1)",
		strokeWeight: 1.5,
		strokeOpacity: 1,
		zIndex: 1
	};
	return <Polyline path={path} options={options} visible={visible} />;
}
