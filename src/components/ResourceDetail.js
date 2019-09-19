import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "../react-auth0-wrapper";
import NodeName from "./NodeName";

export default function ResourceList(props) {
	const [resource, setResource] = useState({});

	const { resourceName, resourceId, titleExtractor, renderers } = props;
	const { isAuthenticated, getTokenSilently } = useAuth0();

	useEffect(() => {
		async function fetchData() {
			const resource = await fetchResource(resourceName);
			setResource(resource);
			async function fetchResource() {
				const path = `${process.env.REACT_APP_API_ROOT}/${resourceName}/${resourceId}`;
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
					alert(`Failed to fetch ${resourceName}`);
					return [];
				}
			}
		}
		if (!isAuthenticated) return;
		fetchData();
	}, [isAuthenticated, getTokenSilently, resourceName, resourceId]);

	return (
		<div className="w-100 ph4-ns ph3">
			<div className="flex items-center justify-between ">
				<h1 className="mv0 f5 fw5 ttc pv3">
					{titleExtractor
						? titleExtractor(resource)
						: `${resourceName.slice(
								0,
								resourceName.length - 1
						  )} ${resourceId}`}
				</h1>
			</div>
			{renderResource(resource, renderers)}
			{// Temp hack
			resourceName === "nodes" ? (
				<a
					href={`https://www.nycmesh.net/map/nodes/${resource.id}`}
					className="blue link"
				>
					View on map →
				</a>
			) : null}
		</div>
	);
}

function renderResource(resource, renderers = {}) {
	const resourceKeys = Object.keys(resource);
	return (
		<div className="f6">
			{resourceKeys
				.filter(key => key !== "id" && !key.includes("_id"))
				.map(key => {
					const value = resource[key];
					if (!value)
						return (
							<div key={key} className="flex items-center mv2">
								<div className="w4">
									<span className="mid-gray">{key}</span>
								</div>
								<span className="light-silver">No {key}</span>
							</div>
						);

					if (renderers[key])
						return (
							<div key={key} className="flex items-center mv2">
								<div className="w4">
									<span className="mid-gray">{key}</span>
								</div>
								<span className="dark-gray">
									{renderers[key](value)}
								</span>
							</div>
						);

					switch (typeof value) {
						case "string":
							return (
								<div
									key={key}
									className="flex items-center mv2"
								>
									<div className="w4">
										<span className="mid-gray">{key}</span>
									</div>
									<span className="dark-gray">{value}</span>
								</div>
							);
						case "boolean":
							return (
								<div
									key={key}
									className="flex items-center mv2"
								>
									<div className="w4">
										<span className="mid-gray">{key}</span>
									</div>
									<span className="dark-gray">
										{value ? "✅" : "❌"}
									</span>
								</div>
							);
						case "object":
							return Array.isArray(value) &&
								!value.filter(v => v).length ? null : (
								<div key={key} className="pv3">
									<h2 className="f5 fw5 mt0 mb3 ttc">
										{key}
									</h2>
									<div>
										{Array.isArray(value) ? (
											<div className="flex flex-wrap">
												{value
													.filter(v => v)
													.map(value => {
														if (key === "nodes")
															return (
																<Link
																	to={`/nodes/${value.id}`}
																	className="mr1 link dark-gray"
																>
																	<NodeName
																		node={
																			value
																		}
																	/>
																</Link>
															);
														return (
															<pre>
																{JSON.stringify(
																	value,
																	null,
																	2
																)}
															</pre>
														);
													})}
											</div>
										) : (
											renderResource(value, renderers)
										)}
									</div>
								</div>
							);
						default:
							return (
								<div
									key={key}
									className="flex items-center mv2"
								>
									<div className="w4">
										<span className="mid-gray">{key}</span>
									</div>
									<span className="dark-gray">{value}</span>
								</div>
							);
					}
				})}
		</div>
	);
}
