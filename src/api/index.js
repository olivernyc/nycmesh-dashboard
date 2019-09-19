export async function fetchResource(resource, token) {
	const path = `${process.env.REACT_APP_API_ROOT}/${resource}`;
	const options = {
		headers: {
			Authorization: `Bearer ${token}`
		}
	};
	try {
		const res = await fetch(path, options);
		if (res.status !== 200) throw Error(res.error);
		return await res.json();
	} catch (error) {
		alert(`Failed to fetch ${resource}`);
		return [];
	}
}
