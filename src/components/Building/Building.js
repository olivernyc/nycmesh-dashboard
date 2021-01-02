import React from "react";

import ResourceDetail from "../Resource/ResourceDetail";

export default function Building({ id }) {
  return (
    <ResourceDetail
      resourceName="buildings"
      resourceId={id}
      titleExtractor={(resource) => resource.address}
      blacklist={["id", "lat", "lng", "bin_address", "requests"]}
    />
  );
}
