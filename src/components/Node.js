import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

import { fetchResource, updateResource } from "../api";

import ResourceEdit from "./ResourceEdit";
import Device from "./Device";
import MemberPreview from "./MemberPreview";
import BuildingPreview from "./BuildingPreview";
import Status from "./Status";
import Panos from "./Panos";
import LinksList from "./LinksList";
import Section from "./Section";

export default function Node(props) {
	const [node, setNode] = useState();
	const [editing, setEditing] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState();
	const { isAuthenticated, getAccessTokenSilently } = useAuth0();

	const { id } = props;

	useEffect(() => {
		async function fetchData() {
			if (!id) return;
			try {
				setLoading(true);
				const token = await getAccessTokenSilently();
				const resource = await fetchResource(`nodes/${id}`, token);
				setNode(resource);
				setLoading(false);
			} catch (error) {
				setError(error);
				setLoading(false);
			}
		}
		if (!isAuthenticated) return;
		fetchData();
	}, [isAuthenticated, getAccessTokenSilently, id]);

	if (!id) return null;

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

	return (
		<div className="w-100 pa3 f6">
			<div className="">
				<span className="f3 fw7">
					{node.name ? node.name : `Node ${node.id}`}
				</span>
			</div>
			<div className="mt2 flex">
				<span className="mid-gray f5 mr2">Node {node.id}</span>
				<Status status={node.status} />
			</div>

			<Section title="Details" onEdit={() => setEditing("node")}>
				{node.name && <Field name="name" value={node.name} />}
				<Field name="status" value={node.status} />
				<Field name="notes" value={node.notes} />
			</Section>
			<Section title="Building">
				<BuildingPreview building={node.building} />
			</Section>
			<Section
				title="Members"
				editLabel="Add"
				onEdit={() => setEditing(true)}
			>
				{node.members.map((member) => (
					<MemberPreview key={member.id} member={member} />
				))}
			</Section>
			<Section
				title="Devices"
				editLabel="Add"
				onEdit={() => setEditing(true)}
			>
				{node.devices.map((device) => (
					<Device key={device.id} device={device} />
				))}
			</Section>
			<LinksList node={node} />
			<Section
				title="Panoramas"
				editLabel="Add"
				onEdit={() => setEditing(true)}
			>
				<Panos panos={node.panoramas} />
			</Section>
			{editing === "node" && (
				<ResourceEdit
					resourceType="node"
					resource={node}
					fields={[
						{ key: "name", type: "text" },
						{
							key: "status",
							type: "select",
							options: ["active", "inactive", "potential"],
						},
						{ key: "notes", type: "textarea" },
					]}
					onSubmit={async (nodePatch) => {
						const token = await getAccessTokenSilently();
						alert("??");
						await updateResource(
							"nodes",
							node.id,
							nodePatch,
							token
						);
						const resource = await fetchResource(
							`nodes/${id}`,
							token
						);
						setNode(resource);
						setEditing(false);
					}}
					onCancel={() => setEditing(false)}
				/>
			)}
		</div>
	);
}

function Field(props) {
	return (
		<div className="mv3">
			<div className="w4 mb1" style={{ minWidth: "8rem" }}>
				<span className="mid-gray ttc">{props.name}</span>
			</div>
			<span className="dark-gray">
				{props.value || `No ${props.name}`}
			</span>
		</div>
	);
}
