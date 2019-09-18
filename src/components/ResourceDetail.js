import React, { useState, useEffect } from "react";
import { useAuth0 } from "../react-auth0-wrapper";

export default function ResourceList(props) {
	const [resource, setResource] = useState({});

	const { resourceName, resourceId } = props;
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
		<div className="w-100 ph4">
			<div className="flex items-center justify-between ">
				<h1 className="mv0 f5 fw5 ttc pv3">
					{resourceName.slice(0, resourceName.length - 1)}{" "}
					{resourceId}
				</h1>
			</div>
			{renderResource(resource)}
		</div>
	);
}

function renderResource(resource) {
	const resourceKeys = Object.keys(resource);
	return (
		<div className="">
			{resourceKeys
				.filter(key => resource[key]) // Filter keys with null values
				.filter(key => key !== "id" && !key.includes("_id"))
				.map(key => {
					const value = resource[key];
					switch (typeof value) {
						case "string":
							return (
								<div className="flex items-center mv2">
									<div className="w4">
										<span className="mid-gray">{key}</span>
									</div>
									<span className="dark-gray">{value}</span>
								</div>
							);
						case "boolean":
							return (
								<div className="flex items-center mv2">
									<div className="w4">
										<span className="mid-gray">{key}</span>
									</div>
									<span className="dark-gray">
										{value ? "✅" : "❌"}
									</span>
								</div>
							);
						case "object":
							console.log("object", key, value);
							return (
								<div className="pv3">
									<h2 className="f5 fw5 mt0 mb3 ttc">
										{key}
									</h2>
									<div>
										{Array.isArray(value)
											? JSON.stringify(value)
											: renderResource(value)}
									</div>
								</div>
							);
						default:
							return (
								<div className="flex items-center mv2">
									<div className="w4">
										<span className="mid-gray">{key}</span>
									</div>
									<span className="dark-gray">
										{JSON.stringify(value)}
									</span>
								</div>
							);
					}
				})}
		</div>
	);
}
