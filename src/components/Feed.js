import React, { useState, useEffect } from "react";
import Octicon, { Settings } from "@primer/octicons-react";
import LazyLoad from "react-lazyload";
import { format, isEqual, isAfter } from "date-fns";
import { useAuth0 } from "./Auth0";
import Button from "./Button";
import { fetchResource } from "../api";

export default function NodeMap(props) {
	const [nodes, setNodes] = useState([]);
	const [links, setLinks] = useState([]);
	const [requests, setRequests] = useState([]);
	const { isAuthenticated, getTokenSilently } = useAuth0();
	useEffect(() => {
		async function fetchNodes() {
			const token = await getTokenSilently();
			const nodesRes = await fetchResource("nodes", token);
			setNodes(nodesRes);
		}
		async function fetchLinks() {
			const token = await getTokenSilently();
			const linksRes = await fetchResource("links", token);
			setLinks(linksRes);
		}
		async function fetchRequests() {
			const token = await getTokenSilently();
			const requestsRes = await fetchResource("requests", token);
			setRequests(requestsRes);
		}
		if (!isAuthenticated) return;
		fetchNodes();
		fetchLinks();
		fetchRequests();
	}, [isAuthenticated, getTokenSilently]);

	const feed = [];
	feed.push(
		...links.map(link => ({
			type: "link",
			date: link.create_date,
			item: link
		}))
	);

	feed.push(
		...nodes.map(node => ({
			type: "node",
			date: node.create_date,
			item: node
		}))
	);

	feed.push(
		...requests
			.filter(request => request.panoramas && request.panoramas.length)
			.map(request => ({
				type: "panorama",
				date: request.panoramas[0].date,
				item: request
			}))
	);

	feed.sort((a, b) =>
		isEqual(a.date, b.date) ? 0 : isAfter(a.date, b.date) ? -1 : 1
	);

	return (
		<div className="w-100">
			<div className="flex items-center justify-between ph4-ns ph3">
				<h1 className="mv0 f5 fw5 ttc pv3">Feed</h1>
				<div>
					<Button
						title="Filters"
						icon={<Octicon icon={Settings} />}
					/>
				</div>
			</div>
			<div className="w-100">
				{feed.map(item => {
					const itemClassName = "pv3 ph4 bb b--light-gray f6 w-100";
					switch (item.type) {
						case "node":
							return (
								<div className={itemClassName}>
									<div className="flex items-start w-100 mw6">
										<span className="mr3">🎉</span>
										<div>
											<span className="fw5 mr2">
												{item.item.building}
											</span>
											<time className="mid-gray">
												{format(
													item.date,
													"MMM D, YYYY"
												)}
											</time>
											<p className="mb0 mt2 m">
												{item.item.name ||
													`Node ${item.item.id}`}{" "}
												installed
											</p>
										</div>
									</div>
								</div>
							);
						case "link":
							return (
								<div className={itemClassName}>
									<div className="flex items-start w-100 mw6">
										<span className="mr3">🔗</span>
										<div>
											<span className="fw5 mr2">
												{item.item.nodes[1].name ||
													`Node ${item.item.nodes[1].id}`}
											</span>
											<time className="mid-gray">
												{format(
													item.date,
													"MMM D, YYYY"
												)}
											</time>
											<p className="mb0 mt2 m">
												Connected to{" "}
												{item.item.nodes[0].name ||
													`Node ${item.item.nodes[0].id}`}
											</p>
										</div>
									</div>
								</div>
							);
						case "panorama":
							return (
								<div className={itemClassName}>
									<div className="flex items-start w-100 mw6">
										<span className="mr3">🌇</span>
										<div className="w-100">
											<span className="fw5 mr2">
												{item.item.address}
											</span>
											<time className="mid-gray">
												{format(
													item.date,
													"MMM D, YYYY"
												)}
											</time>
											<p className="mv2">
												{item.item.member.name}{" "}
												submitted panoramas
											</p>
											<LazyLoad height={256}>
												<div className="h4 w-100 pb2">
													<div
														className="h-100 w-100 cover bg-center bg-near-white"
														style={{
															backgroundImage: `url('${item.item.panoramas[0].url}')`
														}}
													/>
												</div>
											</LazyLoad>
											<LazyLoad height={256}>
												<div className="flex flex-wrap man1">
													{item.item.panoramas
														.slice(1, 3)
														.map(p => (
															<div
																key={p.id}
																className="h4 w-50 pa1"
															>
																<div
																	className="h-100 w-100 cover bg-center bg-near-white"
																	style={{
																		backgroundImage: `url('${p.url}')`
																	}}
																/>
															</div>
														))}
												</div>
											</LazyLoad>
										</div>
									</div>
								</div>
							);
						default:
							return <div>{item.type}</div>;
					}
				})}
			</div>
		</div>
	);
}
