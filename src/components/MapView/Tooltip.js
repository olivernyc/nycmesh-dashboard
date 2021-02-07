import React from "react";
import { OverlayView } from "@react-google-maps/api";

const getPixelPositionOffset = (width, height) => ({
	x: -width / 2,
	y: -height,
});

export default function Tooltip({ lat, lng, label }) {
	return (
		<OverlayView
			position={{ lat, lng }}
			mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
			getPixelPositionOffset={getPixelPositionOffset}
		>
			<div className="flex flex-column items-center">
				<div
					className="flex items-center bg-white br1 overflow-hidden shadow pv05 ph1"
					ref={handleRef}
				>
					<span className="f6 nowrap helvetica ttc db">{label}</span>
				</div>
				<svg
					viewBox="0 5 12 12"
					version="1.1"
					width="12"
					height="12"
					aria-hidden="true"
					style={{ marginTop: "-1px" }}
					className="tooltip-triangle"
				>
					<path fillRule="evenodd" d="M0 5l6 6 6-6H0z" fill="white" />
				</svg>
			</div>
		</OverlayView>
	);
}

function handleRef(ref) {
	if (!ref) return;
	window.google.maps.OverlayView.preventMapHitsFrom(ref);
}
