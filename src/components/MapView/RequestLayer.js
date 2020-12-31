import React from "react";

import RequestMarker from "./RequestMarker";

function RequestLayer({ requests, selectedRequest, selectedNode, onClick }) {
  return requests.map((request) => (
    <RequestMarker
      key={request.id}
      request={request}
      onClick={() => onClick(request)}
    />
  ));
}

export default React.memo(RequestLayer);
