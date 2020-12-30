import React, { useState } from "react";

export default function Panos({ panos }) {
	const [selected, setSelected] = useState(null);
	if (!panos)
		return (
			<div className="pv3">
				<span className="light-silver">No panoramas</span>
			</div>
		);
	return (
		<div>
			{panos.map((pano) => (
				<img
					key={pano.url}
					src={pano.url}
					alt="rooftop panorama thumbnail"
					className="bg-near-white mt2"
					onClick={() => setSelected(pano)}
				/>
			))}
			{selected ? (
				<div className="fixed absolute--fill z-5 bg-black">
					<button
						className="absolute top-0 left-0 ma3 white b"
						onClick={() => setSelected(null)}
					>
						<svg
							className="db ma0"
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="3"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<line x1="18" y1="6" x2="6" y2="18" />
							<line x1="6" y1="6" x2="18" y2="18" />
						</svg>
					</button>
					<div className="h-100 w-100 flex items-center justify-center">
						<a href={selected.url} className="db cursor-zoom-in">
							<img
								src={selected.url}
								alt="rooftop panorama"
								className="h-100 w-100"
								style={{ objectFit: "contain" }}
							/>
						</a>
					</div>
				</div>
			) : null}
		</div>
	);
}
