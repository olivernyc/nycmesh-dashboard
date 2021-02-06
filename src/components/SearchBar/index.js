import React, { useState, useEffect } from "react";
import Autocomplete from "react-autocomplete";
import { useAuth0 } from "@auth0/auth0-react";
import { SearchIcon } from "@primer/octicons-react";
import { Link } from "react-router-dom";

import { search } from "../../api";
import Status from "../Status";

export default function SearchBar({ history }) {
	const [query, setQuery] = useState("");
	const [loading, setLoading] = useState(0);
	const [resultsMap, setResultsMap] = useState({});
	const [inputRef, setInputRef] = useState();
	const { isAuthenticated, getAccessTokenSilently } = useAuth0();

	useEffect(() => {
		async function fetchResults() {
			setLoading((l) => l + 1);
			let token;
			if (isAuthenticated) {
				token = await getAccessTokenSilently();
			}
			const results = await search(query, token);
			setResultsMap((r) => ({
				...r,
				[query]: results,
			}));
			setLoading((l) => l - 1);
		}
		if (!query) return;
		fetchResults();
	}, [query, isAuthenticated, getAccessTokenSilently]);

	const items = [];
	if (query) {
		items.push({ type: "show_all", item: { id: "show_all" } });
	}
	const results = resultsMap[query] || {};
	if (results.nodes) {
		results.nodes.forEach((node) => {
			items.push({ type: "node", item: node });
		});
	}
	if (results.requests) {
		results.requests.forEach((request) => {
			items.push({ type: "request", item: request });
		});
	}
	if (results.members) {
		results.members.forEach((member) => {
			items.push({ type: "member", item: member });
		});
	}

	const menuStyle = {
		position: "absolute",
		zIndex: 9,
		overflow: "auto",
		maxHeight: "calc(100vh - 4rem)",
		borderRadius: "0.25rem",
		marginTop: "-0.5rem",
	};

	return (
		<div className="f6-l f5 bb b--light-gray">
			<Autocomplete
				ref={(element) => setInputRef(element)}
				value={query}
				items={items}
				getItemValue={(item) => {
					return String(item.item.id);
				}}
				inputProps={{ placeholder: "Search..." }}
				wrapperStyle={{ width: "100%" }}
				renderInput={(props) => {
					return (
						<div className="flex items-center relative">
							{loading && query ? (
								<div className="loading-ring absolute pl3" />
							) : (
								<div className="cursor-text absolute ml3">
									<SearchIcon size="small" />
								</div>
							)}
							<input
								className="w-100 flex bn no-outline w-100 mw6 pv3 bg-transparent black ma0"
								autoComplete="nope"
								spellCheck="false"
								style={{ paddingLeft: "3rem" }}
								{...props}
							/>
						</div>
					);
				}}
				renderMenu={(items, value, style) => {
					if (!items.length) return <div />;
					return (
						<div
							className={`bg-white w-100 mw4 shadow ba b--light-gray ml1-l ${
								items.length ? "pv1" : ""
							}`}
							style={{ ...style, ...menuStyle }}
						>
							<div style={{ maxWidth: "100vw" }} className="w-100">
								{items}
								{query && !loading && items.length === 1 ? (
									<div className="pa4 w-100 flex items-center justify-center">
										<span className="gray fw5">No search results found</span>
									</div>
								) : null}
							</div>
						</div>
					);
				}}
				renderItem={(item, isHighlighted) => {
					let title;
					let subtitle;
					let icon;
					if (item.type === "show_all") {
						return (
							<Link to={`/search?q=${query}`} className="link dark-gray">
								<div key="show_all" className="ph1 pv05 bg-white">
									<div
										className={`ph2 pv1 pointer br2 ${
											isHighlighted ? "bg-purple white" : ""
										}`}
									>
										<div className="pv05">
											Show all results for <span className="fw5">{query}</span>
										</div>
									</div>
								</div>
							</Link>
						);
					}
					if (item.type === "node") {
						const { id, name } = item.item;
						title = name || id;
						subtitle = id;
						icon = "📡";
					}
					if (item.type === "request") {
						const { building, member } = item.item;
						title = building.address || building.id;
						subtitle = member.name;
						icon = "🌆";
					}
					if (item.type === "member") {
						const { name, email } = item.item;
						title = name;
						subtitle = email;
						icon = "🙂";
					}

					return (
						<Link
							to={`/map/${item.type}s/${item.item.id}`}
							className="link dark-gray"
						>
							<div
								key={`${item.type}-${item.item.id}`}
								className="ph1 pv05 bg-white"
							>
								<div
									className={`ph2 pv1 pointer br2 ${
										isHighlighted ? "bg-purple white" : ""
									}`}
								>
									<div className="pv05 flex items-center">
										<div className="w1 mr2 flex items-center justify-center">
											<span
												role="img"
												aria-label="Node icon"
												style={{ fontSize: "0.75rem" }}
											>
												{icon}
											</span>
										</div>
										<span className="truncate mr2">{title}</span>
										<span
											className={`mr2 nowrap ${
												isHighlighted ? "white" : "gray"
											}`}
										>
											{subtitle}
										</span>
										{item.item.status && (
											<div>
												<Status status={item.item.status} />
											</div>
										)}
									</div>
								</div>
							</div>
						</Link>
					);
				}}
				onChange={(event) => setQuery(event.target.value)}
				onSelect={(value, item) => {
					inputRef.blur();
					if (value === "show_all") {
						history.push(`/search?q=${query}`);
					} else {
						history.push(`/map/${item.type}s/${item.item.id}`);
					}
				}}
			/>
		</div>
	);
}
