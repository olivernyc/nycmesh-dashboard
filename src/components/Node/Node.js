import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

import { fetchResource, updateResource, destroyResource, createMembership, RequestError } from "../../api";

import ResourceEdit from "../Resource/ResourceEdit";
import ResourceSection from "../Resource/ResourceSection";
import MemberPreview from "../Member/MemberPreview";
import MemberSelect from "../Member/MemberSelect";
import BuildingPreview from "../Building/BuildingPreview";
import Status from "../Status";
import Panos from "../Panos";
import Field from "../Field";

import Device from "./Device";
import LinksList from "./LinksList";

export default function Node({ id }) {
	const [node, setNode] = useState();
	const [editing, setEditing] = useState();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState();
	const { isAuthenticated, getAccessTokenSilently } = useAuth0();

	useEffect(() => {
		async function fetchData() {
			if (!id) return;
			try {
				setLoading(true);
				setError();
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

	async function addMember(memberId) {
		const token = await getAccessTokenSilently();

		let newNode
		try {
			newNode = await createMembership(node, memberId, token);
		} catch (e) {
			// If we're adding a member who's already been added in
			// another window, just reload the node.
			if (e instanceof RequestError && e.response.status === 422) {
				newNode = await fetchResource(`nodes/${node.id}`, token);
			} else {
				throw e;
			}
		}

		setNode(newNode);
		setEditing(false);
	}

	async function removeMember(member) {
		const token = await getAccessTokenSilently();

		try {
			await destroyResource("memberships", member.membership_id, token);
		} catch (e) {
			// If we get a 404, we assume that the member was deleted in
			// another window, and we remove them from the node locally.
			if (!(e instanceof RequestError) || e.response.status !== 404) {
				throw e;
			}
		}

		setNode({
			...node,
			members: node.members.filter(m => m.id !== member.id)
		});
	}

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

	const localizedInstallDate = new Date(node.create_date).toLocaleDateString(
		undefined,
		{
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
		}
	);

	const localizedAbandonDate = new Date(node.abandon_date).toLocaleDateString(
		undefined,
		{
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
		}
	);

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

			<ResourceSection title="Details" onEdit={() => setEditing("node")}>
				{node.name && <Field name="name" value={node.name} />}
				<Field name="installed" value={localizedInstallDate} />
				{node.abandon_date && (
					<Field name="deactivated" value={localizedAbandonDate} />
				)}
				<Field name="notes" value={node.notes} />
			</ResourceSection>
			<ResourceSection title="Building">
				<BuildingPreview building={node.building} />
			</ResourceSection>
			<ResourceSection
				title="Members"
				editLabel="Add"
				onEdit={() => setEditing("members")}
			>
				{node.members.map((member) => (
					<MemberPreview
						key={member.id}
						member={member}
						onDelete={removeMember}
					/>
				))}
			</ResourceSection>
			<ResourceSection
				title="Devices"
				editLabel="Add"
				onEdit={() => setEditing(true)}
			>
				{node.devices.map((device) => (
					<Device key={device.id} device={device} />
				))}
			</ResourceSection>
			<LinksList node={node} />
			<ResourceSection
				title="Panoramas"
				editLabel="Add"
				onEdit={() => setEditing(true)}
			>
				<Panos panos={node.panoramas} />
			</ResourceSection>
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
						await updateResource("nodes", node.id, nodePatch, token);
						const resource = await fetchResource(`nodes/${id}`, token);
						setNode(resource);
						setEditing(false);
					}}
					onCancel={() => setEditing(false)}
				/>
			)}
			{editing === "members" && (
				<MemberSelect
					onSubmit={addMember}
					onCancel={() => setEditing(false)}
					existingMembers={node.members}
				/>
			)}
		</div>
	);
}
