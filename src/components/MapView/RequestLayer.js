import React from "react";

import RequestMarker from "./RequestMarker";

function RequestLayer(props) {
	const { requests, selectedRequests = {}, selectedNodes, onClick } = props;
	return requests.map((request) => (
		<RequestMarker
			key={request.id}
			request={request}
			dimmed={
				(Object.keys(selectedRequests).length &&
					!selectedRequests[request.id]) ||
				(Object.keys(selectedNodes).length &&
					!selectedRequests[request.id])
			}
			onClick={() => onClick(request)}
		/>
	));
}

export default React.memo(RequestLayer);
