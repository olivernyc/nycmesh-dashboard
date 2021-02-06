import React from "react";

import RequestMarker from "./RequestMarker";

function RequestLayer({ requests, selectedRequest, selectedNode, onClick }) {
  return requests.map((request) => (
    <RequestMarker
      key={"request-" + request.id}
      request={request}
      onClick={onClick}
    />
  ));
}

export default React.memo(RequestLayer);
