import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

import { fetchResource } from "../../api";

import ResourceEdit from "../Resource/ResourceEdit";
import MemberPreview from "../Member/MemberPreview";
import BuildingPreview from "../Building/BuildingPreview";
import Field from "../Field";
import Status from "../Status";
import Panos from "../Panos";

export default function Request(props) {
	const [request, setRequest] = useState();
	const [editing, setEditing] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState();
	const { isAuthenticated, getAccessTokenSilently } = useAuth0();

	const { id } = props;

	// alert(id);

	useEffect(() => {
		async function fetchData() {
			if (!id) return;
			try {
				setLoading(true);
				const token = await getAccessTokenSilently();
				const resource = await fetchResource(`requests/${id}`, token);
				setRequest(resource);
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

	const createDate = new Date(request.create_date).toLocaleDateString({
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	return (
		<div className="w-100 pa3 f6">
			<div className="flex flex-wrap items-center">
				<span className="f3 fw7">{`Request ${request.id}`}</span>{" "}
				<span className="ml2">
					<Status status={request.status} />
				</span>
			</div>

			<Section title="Details" onEdit={() => setEditing("request")}>
				{request.name && <Field name="name" value={request.name} />}
				<Field name="roof access" value={request.roof_access} />
				<Field name="apartment" value={request.apartment} />
				<Field name="notes" value={request.notes} />
			</Section>
			<Section title="Building">
				<BuildingPreview building={request.building} />
			</Section>
			<Section title="Member">
				<MemberPreview member={request.member} />
			</Section>
			<Section
				title="Panoramas"
				editLabel="Add"
				onEdit={() => setEditing("panoramas")}
			>
				<Panos panos={request.panoramas} />
			</Section>
			{editing === "request" && (
				<ResourceEdit
					resourceType="request"
					resource={request}
					fields={[
						{
							key: "status",
							type: "select",
							options: ["open", "closed"],
						},
						{ key: "apartment", type: "text" },
						{ key: "notes", type: "textarea" },
					]}
					onSubmit={async (nodePatch) => {
						// const token = await getAccessTokenSilently();
						// alert("??");
						// await updateResource(
						// 	"nodes",
						// 	node.id,
						// 	nodePatch,
						// 	token
						// );
						// const resource = await fetchResource(
						// 	`nodes/${id}`,
						// 	token
						// );
						// setNode(resource);
						// setEditing(false);
					}}
					onCancel={() => setEditing(false)}
				/>
			)}
		</div>
	);
}

function Section({ title, children, editLabel, onEdit }) {
	return (
		<div className="mt3">
			<div className="pv3 flex item-center justify-between bb b--light-gray">
				<span className="f5 fw7">{title}</span>
				{onEdit && (
					<button
						className="bn pa0 bg-transparent purple pointer fw5"
						onClick={() => onEdit(true)}
					>
						{editLabel || "Edit"}
					</button>
				)}
			</div>
			{children}
		</div>
	);
}
