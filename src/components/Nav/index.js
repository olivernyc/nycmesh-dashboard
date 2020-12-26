import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Octicon, {
	PinIcon,
	HomeIcon,
	PersonIcon,
	UnverifiedIcon,
	PulseIcon,
	GlobeIcon,
} from "@primer/octicons-react";
import { useAuth0 } from "@auth0/auth0-react";

const tabs = [
	{
		name: "Nodes",
		icon: <Octicon icon={PinIcon} />,
	},
	{
		name: "Buildings",
		icon: <Octicon icon={HomeIcon} />,
	},
	{ name: "Requests", icon: <Octicon icon={UnverifiedIcon} /> },
	{
		name: "Members",
		icon: <Octicon icon={PersonIcon} />,
	},
];

export default function Nav(props) {
	const [showSearch, setShowSearch] = useState(false);
	const pathComponents = props.location.pathname.split("/");
	const currentResource = pathComponents.length ? pathComponents[1] : "/";
	return (
		<div>
			<div className="fixed-l bg-near-white w-100 mw5-l h-100-l db-l dn">
				<div className="flex flex-column w-100 h-100-ns mw5-ns bg-near-white pa3 br b--light-gray f6">
					<div>
						<div className="flex items-center justify-between">
							<Link
								to="/"
								className="link flex items-center black focus-no-outline"
							>
								<div className="flex justify-center items-center w2-ns mr1-ns mr2">
									<div
										className={`  br-pill bg-gold`}
										style={{
											height: "1.75rem",
											width: "1.75rem",
										}}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											height="100%"
											width="100%"
											viewBox="0 0 128 128"
										>
											<g>
												<path
													id="svg_2"
													d="m60.96,0l5.52,0c14.98,0.66 29.71,6.57 40.72,16.79c12.46,11.23 19.94,27.53 20.8,44.24l0,5.49c-0.72,17.12 -8.47,33.83 -21.34,45.17c-10.96,9.96 -25.49,15.67 -40.24,16.31l-5.7,0c-14.21,-0.91 -28.19,-6.33 -38.86,-15.85c-13.2,-11.39 -21.2,-28.37 -21.86,-45.77l0,-5.64c0.96,-16.62 8.42,-32.8 20.82,-43.97c10.87,-10.1 25.37,-15.94 40.14,-16.77z"
													fill="rgb(255,204,0)"
												/>
												<path
													id="svg_4"
													d="m57.68,23.75c5.46,-3.86 14.14,-1.11 16.09,5.37c1.16,2.94 0.4,6.08 -0.61,8.93c6.62,8.4 13.18,16.85 19.88,25.19c-2.31,1.29 -4.47,2.85 -6.25,4.82c-7.04,-7.95 -13.26,-16.63 -19.93,-24.91c-3.83,0.34 -8.16,-0.05 -10.88,-3.11c-4.62,-4.43 -3.75,-12.91 1.7,-16.29z"
													fill="#010000"
												/>
												<path
													id="svg_5"
													d="m28.79,70.15c6.65,-8.51 13.39,-16.95 20.11,-25.4c1.85,1.99 4.06,3.6 6.35,5.05c-6.66,8.32 -13.22,16.72 -19.85,25.06c3.06,5.34 1.14,13.13 -4.84,15.44c-6.49,3.26 -15.18,-2 -15.09,-9.3c-0.63,-6.94 6.74,-12.54 13.32,-10.85z"
													fill="#010000"
												/>
												<path
													id="svg_8"
													d="m96.61,70.62c6.16,-3.23 14.66,1.33 15.15,8.31c0.78,4.93 -2.49,9.9 -7.17,11.42c-3.33,0.71 -6.94,0.45 -9.87,-1.4c-16.28,8.84 -36.28,10.13 -53.66,3.86c1.54,-2.28 2.81,-4.74 3.77,-7.32c14.78,5.5 31.76,3.91 45.67,-3.34c-0.62,-4.66 1.67,-9.65 6.11,-11.53z"
													fill="#010000"
												/>
											</g>
										</svg>
									</div>
								</div>
								<span className="fw5 nowrap">NYC Mesh</span>
							</Link>
						</div>
					</div>

					<div className="mt3 db-ns dn">
						{
							<Link
								to="/feed"
								className={`link flex items-center pointer pv1 mv1 focus-no-outline ${
									currentResource === "feed"
										? "purple fw5"
										: "mid-gray"
								}`}
							>
								<div className="flex justify-center items-center w2 mr1">
									<Octicon icon={PulseIcon} />
								</div>
								<span>Feed</span>
							</Link>
						}
						<Link
							to="/map"
							className={`link flex items-center pointer pv1 mb1 mv1 focus-no-outline ${
								currentResource === "map" ||
								currentResource === ""
									? "purple fw5"
									: "mid-gray hover-black"
							}`}
						>
							<div className="flex justify-center items-center w2 mr1">
								<Octicon icon={GlobeIcon} />
							</div>
							<span>Map</span>
						</Link>
					</div>

					<ul className="mt2 mb0 list pa0 db-ns dn">
						{tabs.map(({ name, icon }) => (
							<li key={name} className="pv1 mv1">
								<Link
									to={`/${name.toLowerCase()}`}
									className={`link flex items-center focus-no-outline ${
										name.toLowerCase() === currentResource
											? "purple fw5"
											: "mid-gray hover-black"
									}`}
								>
									<div className="flex justify-center items-center w2 mr1">
										<div className="h1 w1 br-pill flex items-center justify-center">
											{icon}
										</div>
									</div>
									<span>{name}</span>
								</Link>
							</li>
						))}
					</ul>
				</div>
			</div>
			{showSearch ? (
				<SearchBar onClick={() => setShowSearch(false)} />
			) : null}
		</div>
	);
}

function SearchBar(props) {
	const [value, setValue] = useState("");
	const [results, setResults] = useState({});
	const { isAuthenticated, getAccessTokenSilently } = useAuth0();
	const { onClick } = props;

	useEffect(() => {
		async function performSearch(query) {
			const res = await fetchSearch();
			setResults(res);
			async function fetchSearch() {
				const path = `${process.env.REACT_APP_API_ROOT}/search?s=${value}`;
				const token = await getAccessTokenSilently();
				const options = {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				};
				try {
					const res = await fetch(path, options);
					if (res.status !== 200) throw Error(res.error);
					return await res.json();
				} catch (error) {
					alert(`Failed to fetch /search`);
					return [];
				}
			}
		}
		if (!isAuthenticated) return;
		if (!value) return;
		performSearch();
	}, [isAuthenticated, getAccessTokenSilently, value]);

	const sections = Object.keys(results);

	return (
		<div className="fixed absolute--fill bg-white-80 z-5" onClick={onClick}>
			<div className="h-100 w-100 flex items-start">
				<div
					className="w-100 mw6 center f5 bg-dark-gray br2 overflow-hidden white mt6 shadow"
					style={{ maxHeight: "calc(100vh - 16rem)" }}
					onClick={(e) => e.stopPropagation()}
				>
					<div className="flex items-center pl3">
						<svg
							width="24"
							height="24"
							viewBox="0 0 16 16"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								fillRule="evenodd"
								clipRule="evenodd"
								d="M14.7 13.3L10.89 9.47C11.59 8.49 12 7.3 12 6C12 2.69 9.31 0 6 0C2.69 0 0 2.69 0 6C0 9.31 2.69 12 6 12C7.3 12 8.48 11.59 9.47 10.89L13.3 14.7C13.49 14.9 13.75 15 14 15C14.25 15 14.52 14.91 14.7 14.7C15.09 14.31 15.09 13.68 14.7 13.29V13.3ZM6 10.7C3.41 10.7 1.3 8.58999 1.3 5.99999C1.3 3.40999 3.41 1.29999 6 1.29999C8.59 1.29999 10.7 3.40999 10.7 5.99999C10.7 8.58999 8.59 10.7 6 10.7Z"
								transform="translate(1)"
								fill="currentColor"
							/>
						</svg>
						<input
							className="w-100 pa3 bn bg-transparent white"
							value={value}
							autoFocus={true}
							spellCheck={false}
							style={{ outline: "none" }}
							onChange={(e) => {
								setValue(e.target.value);
							}}
						/>
					</div>
					{sections.length && value ? (
						<div className="bt b--mid-gray overflow-y-scroll">
							{sections
								.filter((section) => results[section].length)
								.map((section) => (
									<div className="">
										{results[section].map((result) => (
											<div onClick={onClick}>
												{renderResult(section, result)}
											</div>
										))}
									</div>
								))}
						</div>
					) : null}
				</div>
			</div>
		</div>
	);

	function renderResult(section, result) {
		switch (section) {
			case "nodes":
				return (
					<Link
						to={`/nodes/${result.id}`}
						className="moon-gray link pointer"
					>
						<div className="pa3 hover-bg-gray">
							<span role="img" aria-label="Node icon">
								📡
							</span>
							<span className="ml3 truncate">
								{result.name || `Node ${result.id}`}
							</span>
						</div>
					</Link>
				);
			case "buildings":
				return (
					<Link
						to={`/buildings/${result.id}`}
						className="moon-gray link pointer"
					>
						<div className="pa3">
							<span role="img" aria-label="Building icon">
								🏠
							</span>
							<span className="ml3 truncate">
								{result.address}
							</span>
						</div>
					</Link>
				);
			case "requests":
				return (
					<Link
						to={`/requests/${result.id}`}
						className="moon-gray link pointer"
					>
						<div className="pa3">
							<span role="img" aria-label="Request icon">
								🙏
							</span>
							<span className="ml3 truncate">
								{result.building.address}
							</span>
						</div>
					</Link>
				);

			case "members":
				return (
					<Link
						to={`/members/${result.id}`}
						className="moon-gray link pointer"
					>
						<div className="pa3">
							<span role="img" aria-label="Member icon">
								👤
							</span>
							<span className="ml3 ttc truncate">
								{result.name}
							</span>
						</div>
					</Link>
				);
			default:
				return null;
		}
	}
}
