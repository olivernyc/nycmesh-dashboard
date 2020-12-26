import React, { useState, useEffect } from "react";
import Octicon, { Settings } from "@primer/octicons-react";
import { Link } from "react-router-dom";

import { useAuth0 } from "../Auth0";
import MapComponent from "./MapComponent";
import Button from "../Button";
import ResourceDetail from "../ResourceDetail";
import DateCell from "../DateCell";
import { fetchResource } from "../../api";

export default function NodeMap(props) {
	const [selectedNode, setSelectedNode] = useState();
	const [nodes, setNodes] = useState([]);
	const [links, setLinks] = useState([]);
	const [requests, setRequests] = useState([]);
	const { isAuthenticated, getAccessTokenSilently } = useAuth0();
	useEffect(() => {
		async function fetchNodes() {
			const token = await getAccessTokenSilently();
			const nodesRes = await fetchResource("nodes", token);
			setNodes(nodesRes);
		}
		async function fetchLinks() {
			const token = await getAccessTokenSilently();
			const linksRes = await fetchResource("links", token);
			setLinks(linksRes);
		}
		async function fetchRequests() {
			const token = await getAccessTokenSilently();
			const requestsRes = await fetchResource("requests", token);
			setRequests(requestsRes);
		}
		if (!isAuthenticated) return;
		fetchNodes();
		fetchLinks();
		fetchRequests();
	}, [isAuthenticated, getAccessTokenSilently]);
	return (
		<div className="h-100 w-100 flex flex-column">
			<div>
				<div className="flex items-center justify-between ph4-ns ph3">
					<h1 className="mv0 f5 fw5 ttc pv3">Map</h1>
					<div>
						<Button
							title="Filters"
							icon={<Octicon icon={Settings} />}
						/>
					</div>
				</div>
			</div>
			<div className="h-100 flex">
				<MapComponent
					nodes={nodes}
					links={links}
					requests={requests}
					selectedNode={selectedNode}
					onMarkerClick={(node) => setSelectedNode(node)}
					onMapClick={() => setSelectedNode()}
				/>
				{selectedNode && (
					<div
						className="w-100 h-100 overflow-y-scroll"
						style={{ maxWidth: "24rem" }}
					>
						<ResourceDetail
							resourceName="nodes"
							resourceId={selectedNode.id}
							titleExtractor={(resource) =>
								resource.name || `Node ${resource.id}`
							}
							renderers={{
								create_date: (value) => (
									<DateCell cellData={value} />
								),
								building: (value) => (
									<Link
										className="link blue"
										to={`/buildings/${value.id}`}
									>
										{value.address}
									</Link>
								),
							}}
							blacklist={["lat", "lng", "alt", "name"]}
						/>
					</div>
				)}
			</div>
		</div>
	);
}
