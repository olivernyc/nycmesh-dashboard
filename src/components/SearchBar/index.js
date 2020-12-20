import React, { useState, useEffect } from "react";
import Autocomplete from "react-autocomplete";
import { search } from "../../api";
import { useAuth0 } from "../Auth0";
import Status from "../Status";
import Octicon, { Search as SearchIcon } from "@primer/octicons-react";
import { Link } from "react-router-dom";

export default function SearchBar(props) {
	const [query, setQuery] = useState("");
	const [loading, setLoading] = useState(false);
	const [resultsMap, setResultsMap] = useState({});
	const { isAuthenticated, getTokenSilently } = useAuth0();

	useEffect(() => {
		async function fetchResults() {
			setLoading(true);
			const token = await getTokenSilently();
			const results = await search(query, token);
			setResultsMap({
				...resultsMap,
				[query]: results,
			});
			setLoading(false);
		}
		if (!query) return;
		if (!isAuthenticated) return;
		fetchResults();
	}, [query, isAuthenticated]);

	let inputRef;

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
		boxShadow:
			"rgba(66, 66, 66, 0.5) 0px 4px 20px 0px, rgba(0, 0, 0, 0.0666) 0px 1px 1px 0px",
		position: "absolute",
		zIndex: 9,
		overflow: "auto",
		maxHeight: "50%", // TODO: don't cheat, let it flow to the bottom
		borderRadius: "0.25rem",
		marginTop: "-0.5rem",
		marginLeft: "-0.75rem",
	};

	return (
		<div className="pv2 ph3">
			<Autocomplete
				ref={(element) => {
					inputRef = element;
				}}
				value={query}
				items={items}
				getItemValue={(item) => {
					return String(item.item.id);
				}}
				inputProps={{ placeholder: "Search..." }}
				wrapperStyle={{ width: "100%" }}
				renderInput={(props) => {
					return (
						<div className="flex items-center relative h2">
							{loading ? (
								<div className="loading-ring" />
							) : (
								<div className="cursor-text absolute">
									<Octicon icon={SearchIcon} size="small" />
								</div>
							)}
							<input
								className="f6 bn no-outline w-100 mw6 pv3 pl4 bg-transparent absolute"
								autoComplete="nope"
								spellCheck="false"
								{...props}
							/>
						</div>
					);
				}}
				renderMenu={(items, value, style) => {
					return (
						<div
							className={`bg-white ${items.length ? "pv1" : ""}`}
							style={{ ...style, ...menuStyle }}
						>
							{items}
							{query && !loading && items.length === 1 ? (
								<div className="pa4 flex items-center justify-center">
									<span className="f6 gray fw5">
										No search results found
									</span>
								</div>
							) : null}
						</div>
					);
				}}
				renderItem={(item, isHighlighted) => {
					let title;
					let subtitle;
					let icon;
					let status;
					if (item.type === "show_all") {
						return (
							<Link to={`/search`} className="link dark-gray">
								<div
									key="show_all"
									className="ph1 pv05 bg-white"
								>
									<div
										className={`ph2 pv1 pointer f6 br2 ${
											isHighlighted
												? "bg-purple white"
												: ""
										}`}
									>
										<div className="pv05">
											Show all results for{" "}
											<span className="fw5">{query}</span>
										</div>
									</div>
								</div>
							</Link>
						);
					}
					if (item.type === "node") {
						const { id, name, status } = item.item;
						title = name || id;
						subtitle = id;
						icon = "📡";
					}
					if (item.type === "request") {
						const { building, member, status } = item.item;
						title = building.address;
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
									className={`ph2 pv1 pointer f6 br2 ${
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
										<span className="truncate mr2">
											{title}
										</span>
										<span
											className={`mr2 ${
												isHighlighted ? "white" : "gray"
											}`}
										>
											{subtitle}
										</span>
										{item.item.status && (
											<div>
												<Status
													status={item.item.status}
												/>
											</div>
										)}
									</div>
								</div>
							</div>
						</Link>
					);

					return null;

					const {
						name,
						borough,
						locality,
						postalcode,
					} = item.properties;
					const address1 = titleCase(name);
					const address2 = `${borough}, ${locality} ${postalcode}`;
					return (
						<div
							key={item.properties.id}
							className="pa3 bb b--light-gray pointer bg-white"
							style={{
								backgroundColor: isHighlighted
									? "#f5f5f5"
									: "#fff",
							}}
						>
							<span>{address1} </span>
							<span className="gray">{address2}</span>
						</div>
					);
				}}
				onChange={(event) => setQuery(event.target.value)}
				onSelect={(value, item) => {
					// setValue(value);
					// onSelect({
					// 	address: value,
					// 	bin: item.properties.pad_bin,
					// 	lat: item.geometry.coordinates[1],
					// 	lng: item.geometry.coordinates[0],
					// });
					inputRef.blur();
				}}
			/>
		</div>
	);
}

function titleCase(text) {
	return text
		.toLowerCase()
		.split(" ")
		.map((s) => s.charAt(0).toUpperCase() + s.substring(1))
		.join(" ");
}
