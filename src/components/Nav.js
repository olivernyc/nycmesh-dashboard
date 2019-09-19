import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Autocomplete from "react-autocomplete";
import Octicon, {
	Pin,
	Home,
	Person,
	Unverified,
	Pulse,
	Search
} from "@primer/octicons-react";
import { useAuth0 } from "../react-auth0-wrapper";

const tabs = [
	{
		name: "Nodes",
		icon: <Octicon icon={Pin} />
	},
	{
		name: "Buildings",
		icon: <Octicon icon={Home} />
	},
	{ name: "Requests", icon: <Octicon icon={Unverified} /> },
	{
		name: "Members",
		icon: <Octicon icon={Person} />
	}
];

export default function Nav(props) {
	const [showSearch, setShowSearch] = useState(false);
	const pathComponents = props.location.pathname.split("/");
	const currentResource = pathComponents.length ? pathComponents[1] : "/";
	return (
		<div className="flex flex-column w-100 mw5-ns bg-near-white pa3 br b--light-gray f6">
			<div className="flex items-center justify-between">
				<Link
					to="/"
					className="link flex items-center black focus-no-outline"
				>
					<div className="flex justify-center items-center w2-ns mr2-ns mr3">
						<div className={`h1 w1 br-pill bg-gold`} />
					</div>
					<span className="fw5 nowrap">NYC Mesh</span>
				</Link>
			</div>

			<div className="mt3 db-ns dn">
				<Link
					to="/feed"
					className="link flex items-center near-black pointer pv1 mv1 focus-no-outline"
				>
					<div className="flex justify-center items-center w2 mr2 black-40">
						<Octicon icon={Pulse} />
					</div>
					<span>Feed</span>
				</Link>
				<Link
					to="/map"
					className="link flex items-center near-black pointer pv1 mv1 focus-no-outline"
				>
					<div className="flex justify-center items-center w2 mr2">
						<svg
							width="14"
							height="16"
							viewBox="0 0 14 16"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							className="black-40"
						>
							<path
								fill-rule="evenodd"
								clip-rule="evenodd"
								d="M7 0C3.14 0 0 3.14 0 7C0 10.86 3.14 14 7 14C7.48 14 7.94 13.95 8.38 13.86C8.21 13.78 8.18 13.13 8.36 12.77C8.55 12.36 9.17 11.32 8.56 10.97C7.95 10.62 8.12 10.47 7.75 10.06C7.38 9.65 7.53 9.59 7.5 9.48C7.42 9.14 7.86 8.59 7.89 8.54C7.91 8.48 7.91 8.27 7.89 8.21C7.89 8.13 7.62 7.99 7.55 7.98C7.49 7.98 7.44 8.09 7.35 8.11C7.26 8.13 6.85 7.86 6.76 7.78C6.67 7.7 6.62 7.55 6.49 7.44C6.36 7.31 6.35 7.41 6.16 7.33C5.97 7.25 5.36 7.02 4.88 6.85C4.4 6.66 4.36 6.38 4.36 6.19C4.34 5.99 4.06 5.72 3.94 5.52C3.8 5.32 3.78 5.05 3.74 5.11C3.7 5.17 3.99 5.89 3.94 5.92C3.89 5.94 3.78 5.72 3.64 5.54C3.5 5.35 3.78 5.45 3.34 4.59C2.9 3.73 3.48 3.29 3.51 2.84C3.54 2.39 3.89 3.01 3.7 2.71C3.51 2.41 3.7 1.82 3.56 1.6C3.43 1.38 2.68 1.85 2.68 1.85C2.7 1.63 3.37 1.27 3.84 0.93C4.31 0.59 4.62 0.87 5 0.98C5.39 1.11 5.41 1.07 5.28 0.93C5.15 0.8 5.34 0.76 5.64 0.8C5.92 0.85 6.02 1.21 6.47 1.16C6.94 1.13 6.52 1.25 6.58 1.38C6.64 1.51 6.52 1.49 6.2 1.68C5.9 1.88 6.22 1.9 6.75 2.29C7.28 2.68 7.13 2.04 7.06 1.74C6.99 1.44 7.45 1.68 7.45 1.68C7.78 1.9 7.72 1.7 7.95 1.76C8.18 1.82 8.86 2.4 8.86 2.4C8.03 2.84 8.55 2.88 8.69 2.99C8.83 3.1 8.41 3.29 8.41 3.29C8.24 3.12 8.22 3.31 8.11 3.37C8 3.43 8.09 3.59 8.09 3.59C7.53 3.68 7.65 4.28 7.67 4.42C7.67 4.56 7.29 4.78 7.2 5C7.11 5.2 7.45 5.64 7.26 5.66C7.07 5.69 6.92 5 5.95 5.25C5.65 5.33 5.01 5.66 5.36 6.33C5.72 7.02 6.28 6.14 6.47 6.24C6.66 6.34 6.41 6.77 6.45 6.79C6.49 6.81 6.98 6.81 7.01 7.4C7.04 7.99 7.78 7.93 7.93 7.95C8.1 7.95 8.63 7.51 8.7 7.5C8.76 7.47 9.08 7.22 9.73 7.59C10.39 7.95 10.71 7.9 10.93 8.06C11.15 8.22 11.01 8.53 11.21 8.64C11.41 8.75 12.27 8.61 12.49 8.95C12.71 9.29 11.61 11.04 11.27 11.23C10.93 11.42 10.79 11.87 10.43 12.15C10.07 12.43 9.62 12.79 9.16 13.06C8.75 13.29 8.69 13.72 8.5 13.86C11.64 13.16 13.98 10.36 13.98 7.02C13.98 3.16 10.84 0.02 6.98 0.02L7 0ZM8.64 6.56C8.55 6.59 8.36 6.78 7.86 6.48C7.38 6.18 7.05 6.25 7 6.2C7 6.2 6.95 6.09 7.17 6.06C7.61 6.01 8.15 6.47 8.28 6.47C8.41 6.47 8.47 6.34 8.69 6.42C8.91 6.5 8.74 6.55 8.64 6.56ZM6.34 0.699998C6.29 0.669998 6.37 0.619998 6.43 0.559998C6.46 0.529998 6.45 0.449998 6.48 0.419998C6.59 0.309998 7.09 0.169998 7 0.449998C6.89 0.719998 6.42 0.749998 6.34 0.699998ZM7.57 1.59C7.38 1.57 6.99 1.54 7.05 1.45C7.35 1.17 6.96 1.07 6.71 1.07C6.46 1.05 6.37 0.91 6.49 0.88C6.61 0.85 7.1 0.9 7.19 0.96C7.27 1.02 7.71 1.21 7.74 1.34C7.76 1.47 7.74 1.59 7.57 1.59ZM9.04 1.54001C8.9 1.63001 8.21 1.13001 8.09 1.02001C7.53 0.540007 7.2 0.710007 7.09 0.610007C6.98 0.510007 7.01 0.420007 7.2 0.270007C7.39 0.120007 7.89 0.330007 8.2 0.360007C8.5 0.390007 8.86 0.630007 8.86 0.910007C8.88 1.16001 9.19 1.41001 9.05 1.54001H9.04Z"
								transform="translate(0 1)"
								fill="currentColor"
							/>
						</svg>
					</div>
					<span>Map</span>
				</Link>
			</div>

			<ul className="mt3 list pa0 db-ns dn">
				{tabs.map(({ name, icon }) => (
					<li key={name} className="pv1 mv1">
						<Link
							to={`/${name.toLowerCase()}`}
							className={`link flex items-center focus-no-outline ${
								name.toLowerCase() === currentResource
									? "purple fw5"
									: "near-black"
							}`}
						>
							<div className="flex justify-center items-center w2 mr2">
								<div
									className={`h1 w1 br-pill flex items-center justify-center ${
										name.toLowerCase() === currentResource
											? "purple"
											: "black-40"
									}`}
								>
									{icon}
								</div>
							</div>
							<span>{name}</span>
						</Link>
					</li>
				))}
			</ul>
			<div className="mt3 db-ns dn">
				<div
					className="link flex items-center near-black pointer pv1 mv1"
					onClick={() => setShowSearch(true)}
				>
					<div className="flex justify-center items-center w2 mr2 black-40">
						<Octicon icon={Search} />
					</div>
					<span>Search</span>
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
	const { isAuthenticated, getTokenSilently } = useAuth0();
	const { onClick } = props;

	useEffect(() => {
		async function performSearch(query) {
			const res = await fetchSearch();
			setResults(res);
			async function fetchSearch() {
				const path = `${process.env.REACT_APP_API_ROOT}/search?s=${value}`;
				const token = await getTokenSilently();
				const options = {
					headers: {
						Authorization: `Bearer ${token}`
					}
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
	}, [isAuthenticated, getTokenSilently, value]);

	const sections = Object.keys(results);

	return (
		<div
			className="absolute absolute--fill bg-white-80 z-5"
			onClick={onClick}
		>
			<div className="h-100 w-100 flex items-start">
				<div
					className="w-100 mw6 center f5 bg-dark-gray br2 overflow-hidden white mt6 shadow"
					style={{ maxHeight: "calc(100vh - 16rem)" }}
					onClick={e => e.stopPropagation()}
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
							onChange={e => {
								setValue(e.target.value);
							}}
						/>
					</div>
					{sections.length && value ? (
						<div className="bt b--mid-gray overflow-y-scroll">
							{sections
								.filter(section => results[section].length)
								.map(section => (
									<div className="">
										{results[section].map(result => (
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
							📡
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
							🏠
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
							🙏
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
							👤
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
