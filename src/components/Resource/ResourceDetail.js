import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

import { fetchResource } from "../../api";

export default function ResourceDetail(props) {
	const [resource, setResource] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState();

	const {
		resourceName,
		resourceId,
		titleExtractor,
		renderers,
		blacklist,
	} = props;
	const { isAuthenticated, getAccessTokenSilently } = useAuth0();

	useEffect(() => {
		async function fetchData() {
			if (!resourceName || !resourceId) return;
			try {
				setLoading(true);
				const token = await getAccessTokenSilently();
				const resource = await fetchResource(
					`${resourceName}/${resourceId}`,
					token
				);
				setResource(resource);
				setLoading(false);
			} catch (error) {
				setError(error);
				setLoading(false);
			}
		}
		if (!isAuthenticated) return;
		fetchData();
	}, [isAuthenticated, getAccessTokenSilently, resourceName, resourceId]);

	if (loading) {
		return (
			<div className="flex justify-center ph3 pv4">
				<div className="loading-ring"></div>
			</div>
		);
	}

	if (error) {
		return <div className="w-100">Error</div>;
	}

	if (!resource) return null;

	return (
		<div className="w-100 ph3">
			<div className="flex items-center justify-between ">
				<h1 className="mv0 f3 fw7 ttc pv3">
					{titleExtractor && resource.id
						? titleExtractor(resource)
						: null}
				</h1>
			</div>
			{renderResource(resource, renderers, blacklist)}
		</div>
	);
}

function renderResource(resource, renderers = {}, blacklist = []) {
	const resourceKeys = Object.keys(resource);
	return (
		<div className="f6">
			{resourceKeys
				.filter((key) => !key.includes("_id"))
				.filter((key) => !blacklist.includes(key))
				.map((key) => {
					const value = resource[key];

					let content;

					if (!value) {
						content = (
							<span className="light-silver">No {key}</span>
						);
					} else if (renderers[key] && !Array.isArray(value)) {
						content = (
							<span className="dark-gray">
								{renderers[key](value)}
							</span>
						);
					} else {
						content = (
							<span className="dark-gray">
								{JSON.stringify(value)}
							</span>
						);
					}

					return (
						<div className="mv3">
							<div
								className="w4 mb1"
								style={{ minWidth: "8rem" }}
							>
								<span className="mid-gray ttc">{key}</span>
							</div>
							<span className="dark-gray">{content}</span>
						</div>
					);
				})}
		</div>
	);
}
