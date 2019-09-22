import React, { useState, useEffect } from "react";
import { withScriptjs, withGoogleMap, GoogleMap } from "react-google-maps";
import Octicon, { Settings } from "@primer/octicons-react";
import { useAuth0 } from "../Auth0";

import MapComponent from "./MapComponent";
import Button from "../Button";
import { fetchResource } from "../../api";

export default function NodeMap(props) {
	const [nodes, setNodes] = useState([]);
	const [links, setLinks] = useState([]);
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
		if (!isAuthenticated) return;
		fetchNodes();
		fetchLinks();
	}, [isAuthenticated, getTokenSilently]);
	return (
		<div className="h-100 w-100 flex flex-column">
			<div className="flex items-center justify-between ph4-ns ph3">
				<h1 className="mv0 f5 fw5 ttc pv3">Map</h1>
				<div>
					<Button
						title="Filters"
						icon={<Octicon icon={Settings} />}
					/>
				</div>
			</div>
			<MapComponent nodes={nodes} links={links} />
		</div>
	);
}
