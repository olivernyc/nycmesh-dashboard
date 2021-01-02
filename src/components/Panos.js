import React, { useState, useEffect, useCallback } from "react";
import { XIcon } from "@primer/octicons-react";

export default function Panos({ panos }) {
	const [selected, setSelected] = useState(null);

	const upHandler = useCallback(
		(event) => {
			event.stopPropagation();
			if (!panos) return;
			if (event.key === "Escape") {
				setSelected(null);
			}
		},
		[panos]
	);

	const downHandler = useCallback(
		(event) => {
			event.stopPropagation();
			if (!panos) return;
			if (event.key === "ArrowRight") {
				setSelected((s) => (s !== null ? (s + 1) % panos.length : null));
			} else if (event.key === "ArrowLeft") {
				setSelected((s) =>
					s !== null ? (s + panos.length - 1) % panos.length : null
				);
			}
		},
		[panos]
	);

	useEffect(() => {
		if (selected == null) return;
		window.addEventListener("keyup", upHandler, true);
		window.addEventListener("keydown", downHandler, true);
		return () => {
			window.removeEventListener("keyup", upHandler, true);
			window.removeEventListener("keydown", downHandler, true);
		};
	}, [selected, downHandler, upHandler]);

	if (!panos)
		return (
			<div className="pv3">
				<span className="light-silver">No panoramas</span>
			</div>
		);
	return (
		<div>
			<div className="overflow-x-scroll pt2">
				<div
					className="flex"
					style={{ marginLeft: "-0.25rem", marginRight: "-0.25rem" }}
				>
					{panos.map((pano, index) => (
						<img
							key={pano.url}
							src={pano.url}
							alt="rooftop panorama thumbnail"
							className="h3 mh1 bg-near-white pointer"
							style={{ maxWidth: "none" }}
							onClick={() => setSelected(index)}
						/>
					))}
				</div>
			</div>
			{selected !== null ? (
				<div className="fixed absolute--fill z-5 pv4 bg-black">
					<div className="absolute top-0 left-0 right-0 ma3 flex items-center">
						<button
							className="pa0 bn bg-transparent white pointer"
							onClick={() => setSelected(null)}
						>
							<XIcon size="medium" />
						</button>

						<span
							className="w-100 tc mr4 f5 silver"
							style={{ justifySelf: "center" }}
						>
							{selected + 1} of {panos.length}
						</span>
					</div>
					<div className="h-100 w-100 flex items-center justify-center">
						<a
							key={panos[selected].url}
							href={panos[selected].url}
							className="cursor-zoom-in"
						>
							<img
								src={panos[selected].url}
								alt="rooftop panorama bg-dark-gray dib"
								style={{
									maxHeight: "calc(100vh - 8rem)",
								}}
							/>
						</a>
					</div>
				</div>
			) : null}
		</div>
	);
}
