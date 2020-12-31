export async function fetchResource(resource, token) {
	const path = `${process.env.REACT_APP_API_ROOT}/${resource}`;
	const options = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const res = await fetch(path, options);
	if (res.status !== 200) throw Error(res.error);
	return res.json();
}

export async function updateResource(
	resourceType,
	resourceId,
	resourcePatch,
	token
) {
	const path = `${process.env.REACT_APP_API_ROOT}/${resourceType}/${resourceId}`;
	const options = {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify(resourcePatch),
	};
	const res = await fetch(path, options);
	if (res.status !== 200) throw Error(res.error);
	return res.json();
}

export async function destroyResource(resourceType, resourceId, token) {
	const path = `${process.env.REACT_APP_API_ROOT}/${resourceType}/${resourceId}`;
	const options = {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const res = await fetch(path, options);
	if (res.status !== 200) throw Error(res.error);
	return await res.json();
}

export async function search(query, token) {
	const path = `${process.env.REACT_APP_API_ROOT}/search?s=${query}`;
	const options = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const res = await fetch(path, options);
	if (res.status !== 200) throw Error(res.error);
	return res.json();
}

export async function searchMembers(query, token) {
	const path = `${process.env.REACT_APP_API_ROOT}/members/search?s=${query}`;

	const options = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const res = await fetch(path, options);
	if (res.status !== 200) throw Error(res.error);
	return res.json();
}

export async function addMember(node, memberId, token) {
	const path = `${process.env.REACT_APP_API_ROOT}/nodes/${node.id}/memberships`;

	const options = {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({member_id: memberId}),
	};

	const res = await fetch(path, options);
	if (res.status !== 200) throw Error(res.error);
	return await res.json();
}
