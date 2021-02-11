import React, { useState, useEffect } from "react";

import { fetchResource } from "../../api";

import NodePreview from "../Node/NodePreview";

export default function LineOfSight({ building, onResults }) {
  const [los, setLos] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    async function fetchData() {
      if (!building.bin) return;
      try {
        setLoading(true);
        setError();
        const response = await fetchResource(`los?bin=${building.bin}`);
        setLos(response);
        onResults && onResults(response);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    }
    fetchData();
    return () => {
      onResults && onResults();
    };
  }, [building, onResults]);

  if (!building) return null;
  if (!building.bin)
    return (
      <div className="pv3">
        <span className="light-silver">No line of sight</span>
      </div>
    );

  if (loading)
    return (
      <div className="pv3">
        <span className="light-silver">Loading...</span>
      </div>
    );
  if (error)
    return (
      <div className="pv3">
        <span className="light-silver">Error</span>
      </div>
    );

  const losNodes = [
    ...los.visibleSectors,
    ...los.visibleOmnis,
    // ...(showPlanned ? los.visibleRequests.map(nodeFromRequest) : []),
  ].filter(
    (node) =>
      node.devices.filter((device) => device.type.name !== "Unknown").length
  );

  if (!losNodes.length)
    return (
      <div className="pv3">
        <span className="light-silver">No line of sight</span>
      </div>
    );

  return losNodes
    .filter((node) => node.type !== "los")
    .sort((a, b) => a.distance - b.distance)
    .map((node) => {
      const nonUnknown = node.devices.filter((d) => d.type.name !== "Unknown");
      const device = nonUnknown[0] || node.devices[0] || { type: {} };
      return (
        <NodePreview
          key={`${node.id}-${device.type.name}-${device.type.id}`}
          node={node}
          device={device}
        />
      );
    });
}
