import React, { useState, useEffect } from "react";

import { fetchResource } from "../../api";

export default function LineOfSight({ building }) {
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
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    }
    fetchData();
  }, [building]);

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
        <NodeRow
          key={`${node.id}-${device.type.name}-${device.type.id}`}
          node={node}
          device={device}
        />
      );
    });
}

function NodeRow({ node, device }) {
  return (
    <li className="bb b--light-gray pv2 pointer flex items-start justify-between">
      <div className="flex items-center mr4">
        <div className="f6">
          <div className="flex fw5 items-center">
            <span className="black">{node.name || `${node.id}`}</span>
          </div>
          <div className="mt1">
            <span className="mid-gray db nowrap">
              {`${parseFloat(node.distance / 1000).toFixed(1)}km`} •{" "}
              {device.ssid || device.type.name}
            </span>
          </div>
        </div>
      </div>
    </li>
  );
}
