import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Autocomplete from "react-autocomplete";
import { useAuth0 } from "../react-auth0-wrapper";

const tabs = ["Nodes", "Buildings", "Requests", "Members"];

export default function Nav(props) {
	const [showSearch, setShowSearch] = useState(false);
	const pathComponents = props.location.pathname.split("/");
	const currentResource = pathComponents.length ? pathComponents[1] : "/";
	return (
		<div className="w5-ns bg-near-white pa3 br b--light-gray f6">
			<div className="flex items-center justify-between">
				<Link to="/" className="link flex items-center black">
					<div className="flex justify-center items-center w2-ns mr2-ns mr3">
						<div className={`h1 w1 br-pill bg-gold`} />
					</div>
					<span className="fw5 nowrap">NYC Mesh</span>
				</Link>
			</div>
			<ul className="mb0 mt3 list pa0 db-ns dn">
				{tabs.map(tab => (
					<li key={tab} className="pv1 mv1">
						<Link
							to={`/${tab.toLowerCase()}`}
							className={`link flex items-center ${
								tab.toLowerCase() === currentResource
									? "purple fw5"
									: "near-black"
							}`}
						>
							<div className="flex justify-center items-center w2 mr2">
								<div
									className={`h1 w1 br-pill ${
										tab.toLowerCase() === currentResource
											? "bg-purple"
											: "bg-black-20"
									}`}
								/>
							</div>
							<span>{tab}</span>
						</Link>
					</li>
				))}
			</ul>
			<div className="mt4 db-ns dn">
				<div
					className="link flex items-center near-black pointer"
					onClick={() => setShowSearch(true)}
				>
					<div className="flex justify-center items-center w2 mr2">
						<svg
							width="16"
							height="16"
							viewBox="0 0 16 16"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							className="black-20"
						>
							<path
								fillRule="evenodd"
								clipRule="evenodd"
								d="M14.7 13.3L10.89 9.47C11.59 8.49 12 7.3 12 6C12 2.69 9.31 0 6 0C2.69 0 0 2.69 0 6C0 9.31 2.69 12 6 12C7.3 12 8.48 11.59 9.47 10.89L13.3 14.7C13.49 14.9 13.75 15 14 15C14.25 15 14.52 14.91 14.7 14.7C15.09 14.31 15.09 13.68 14.7 13.29V13.3ZM6 10.7C3.41 10.7 1.3 8.58999 1.3 5.99999C1.3 3.40999 3.41 1.29999 6 1.29999C8.59 1.29999 10.7 3.40999 10.7 5.99999C10.7 8.58999 8.59 10.7 6 10.7Z"
								transform="translate(1)"
								fill="currentColor"
							/>
						</svg>
					</div>
					<span>Search</span>
				</div>
			</div>
			{showSearch ? (
				<Search onClick={() => setShowSearch(false)} />
			) : null}
		</div>
	);
}

function Search(props) {
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
							<span className="ml3">
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
							<span className="ml3">{result.address}</span>
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
							<span className="ml3">{result.member.email}</span>
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
							<span className="ml3 ttc">{result.name}</span>
						</div>
					</Link>
				);
			default:
				return null;
		}
	}
}
