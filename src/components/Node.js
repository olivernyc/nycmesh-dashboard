import React, { useState, useEffect } from "react";
import { useAuth0 } from "./Auth0";
import { Link } from "react-router-dom";
import Octicon, { Pencil } from "@primer/octicons-react";

import { fetchResource, updateResource, addMember } from "../api";

import ResourceEdit from "./ResourceEdit";
import ResourceSelect from "./ResourceSelect";
import DateCell from "./DateCell";
import Device from "./Device";
import MemberPreview from "./MemberPreview";
import MemberSelect from "./MemberSelect";
import BuildingPreview from "./BuildingPreview";
import Status from "./Status";
import Panos from "./Panos";

export default function Node(props) {
	const [node, setNode] = useState();
	const [editing, setEditing] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState();
	const { isAuthenticated, getTokenSilently } = useAuth0();

	const { id } = props;

	useEffect(() => {
		async function fetchData() {
			if (!id) return;
			try {
				setLoading(true);
				const token = await getTokenSilently();
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
	}, [isAuthenticated, getTokenSilently, id]);

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

	const createDate = new Date(node.create_date).toLocaleDateString({
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	});

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
			<Section title="Building" onEdit={() => setEditing("building")}>
				<BuildingPreview building={node.building} />
			</Section>
			<Section
				title="Members"
				editLabel="Add"
				onEdit={() => setEditing("members")}
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
			<Section
				title="Links"
				editLabel="Add"
				onEdit={() => setEditing(true)}
			>
				{node.connected_nodes &&
					node.connected_nodes.map((node) => (
						<NodePreview node={node} />
					))}
			</Section>
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
						const token = await getTokenSilently();
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
			{editing === "building" && (
				<BuildingSelect
					node={node}
					onSubmit={async (newBuilding) => {
						const token = await getTokenSilently();
						const nodePatch = {
							building_id: 422,
						};
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
			{editing === "members" && (
				<MemberSelect
					onSubmit={async (memberId) => {
						const token = await getTokenSilently();
						const newNode = await addMember(node, memberId, token);

						setNode(newNode);
						setEditing(false);
					}}
					onCancel={() => setEditing(false)}
				/>
			)}
		</div>
	);
}

function BuildingSelect(props) {
	const { node } = props;
	return (
		<ResourceSelect
			resourceType="building"
			resource={node}
			onSubmit={props.onSubmit}
			onCancel={props.onCancel}
		/>
	);
}

function Section(props) {
	return (
		<div className="mt3">
			<div className="pv3 flex item-center justify-between bb b--light-gray">
				<span className="f5 fw7">{props.title}</span>
				<button
					className="bn pa0 bg-transparent purple pointer fw5"
					onClick={props.onEdit}
				>
					{props.editLabel || "Edit"}
				</button>
			</div>
			{props.children}
		</div>
	);
}

function MultiSection(props) {
	return (
		<div className="mt3">
			<div className="pv3 flex items-center justify-between bb b--light-gray">
				<span className="f5 fw7">{props.title}</span>
				<button
					className="bn pa0 bg-transparent purple pointer fw5"
					onClick={props.onEdit}
				>
					Edit
				</button>
			</div>
			{props.children}
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

function NodePreview({ node }) {
	if (!node) return <div>Invalid node</div>;
	return (
		<div className="pv2 bb b--light-gray">
			<div className="mb1">
				<span className="fw5">{node.name || node.id}</span>
			</div>
		</div>
	);
}
