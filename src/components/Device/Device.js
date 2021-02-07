import React, { useState, useEffect } from "react";
import DocumentTitle from "react-document-title";
import { useAuth0 } from "@auth0/auth0-react";

import { fetchResource } from "../../api";
import Status from "../Status";
import Field from "../Field";
import ResourceSection from "../Resource/ResourceSection";
import NodePreview from "../Node/NodePreview";

export default function Device({ id }) {
  const [device, setDevice] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [editing, setEditing] = useState();
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      try {
        setLoading(true);
        setError();
        const token = await getAccessTokenSilently();
        const resource = await fetchResource(`devices/${id}`, token);
        setDevice(resource);
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

  console.log(device);

  if (!device) return null;

  return (
    <DocumentTitle title={`${device.ssid || device.type.name} - NYC Mesh`}>
      <div className="w-100 pa3 f6">
        <div className="">
          <span className="f3 fw7">{device.ssid || device.type.name}</span>
        </div>
        <div className="mt2 flex">
          <span className="mid-gray f5 mr2">{device.type.name}</span>
          <Status status={device.status} />
        </div>

        <ResourceSection
          title="Details"
          disableEdit={!isAuthenticated}
          onEdit={() => setEditing("device")}
        >
          <Field name="name" value={device.name} />
          <Field name="SSID" value={device.ssid} />
          <Field name="lat" value={device.lat} />
          <Field name="lng" value={device.lng} />
          <Field name="alt" value={device.alt} />
          <Field name="azimuth" value={device.azimuth} />
          <Field name="installed" value={device.create_date} />
          <Field name="notes" value={device.notes} />
        </ResourceSection>

        <ResourceSection title="Node" disableEdit={true}>
          <NodePreview node={device.node} />
        </ResourceSection>

        {editing === "device" && null}
      </div>
    </DocumentTitle>
  );
}
