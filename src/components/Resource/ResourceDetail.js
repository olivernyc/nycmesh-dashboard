import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

export default function ResourceDetail(props) {
	const [resource, setResource] = useState({});

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
			setResource({});
			const resource = await fetchResource(resourceName);
			setResource(resource);
			async function fetchResource() {
				const path = `${process.env.REACT_APP_API_ROOT}/${resourceName}/${resourceId}`;
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
					alert(`Failed to fetch ${resourceName}`);
					return [];
				}
			}
		}
		if (!isAuthenticated) return;
		fetchData();
	}, [isAuthenticated, getAccessTokenSilently, resourceName, resourceId]);

	if (Object.keys(resource).length === 0) return null;

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
						content = <span className="dark-gray">{value}</span>;
					}

					return (
						<div key={key} className="flex items-start mv2">
							<div className="w4" style={{ minWidth: "8rem" }}>
								<span className="mid-gray">{key}</span>
							</div>
							{content}
						</div>
					);
				})}
		</div>
	);
}
