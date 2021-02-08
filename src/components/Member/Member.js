import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import DocumentTitle from "react-document-title";

import { fetchResource, updateResource } from "../../api";

import ResourceEdit from "../Resource/ResourceEdit";
import ResourceSection from "../Resource/ResourceSection";
import NodePreview from "../Node/NodePreview";
import RequestPreview from "../Request/RequestPreview";
import Field from "../Field";

export default function Member({ id }) {
	const [member, setMember] = useState();
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
				const token = isAuthenticated ? await getAccessTokenSilently() : null;
				const resource = await fetchResource(`members/${id}`, token);
				setMember(resource);
				setLoading(false);
			} catch (error) {
				setError(error);
				setLoading(false);
			}
		}
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
		<DocumentTitle title={`${member.name} - NYC Mesh`}>
			<div className="w-100 pa3 f6">
				<div className="flex items-center">
					<span className="f3 fw7">{member.name}</span>
					{member.donor && (
						<img
							src="/img/donor.png"
							className="ml1"
							title="Donor"
							alt="heart icon"
						/>
					)}
				</div>
				<div className="mt2 flex">
					<span className="mid-gray f5 mr2">{member.email}</span>
				</div>
				<ResourceSection
					title="Details"
					disableEdit={!isAuthenticated}
					onEdit={() => setEditing("member")}
				>
					{member.name && <Field name="name" value={member.name} />}
					{member.email && <Field name="address" value={member.email} />}
					{member.phone && <Field name="phone" value={member.phone} />}
					<Field name="notes" value={member.notes} />
				</ResourceSection>
				<ResourceSection
					title="Nodes"
					editLabel="Add"
					onEdit={() => setEditing("nodes")}
				>
					{!member.nodes || !member.nodes.length ? (
						<div className="pv3">
							<span className="light-silver">No nodes</span>
						</div>
					) : (
						member.nodes.map((node) => (
							<NodePreview key={node.id} node={node} />
						))
					)}
				</ResourceSection>

				{isAuthenticated && (
					<ResourceSection title="Requests" disableEdit>
						{!member.requests || !member.requests.length ? (
							<div className="pv3">
								<span className="light-silver">No requests</span>
							</div>
						) : (
							member.requests.map((request) => (
								<RequestPreview key={request.id} request={request} />
							))
						)}
					</ResourceSection>
				)}

				{editing === "member" && (
					<ResourceEdit
						resourceType="member"
						resource={member}
						fields={[
							{ key: "name", type: "text" },
							{ key: "email", type: "text" },
							{ key: "notes", type: "textarea" },
						]}
						onSubmit={async (patch) => {
							const token = await getAccessTokenSilently();
							await updateResource("member", member.id, patch, token);
							const resource = await fetchResource(`member/${id}`, token);
							setMember(resource);
							setEditing(false);
						}}
						onCancel={() => setEditing(false)}
					/>
				)}
			</div>
		</DocumentTitle>
	);
}
