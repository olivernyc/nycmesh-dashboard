import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import DocumentTitle from "react-document-title";

import { fetchResource, updateResource, createResource } from "../../api";

import ResourceEdit from "../Resource/ResourceEdit";
import ResourceSection from "../Resource/ResourceSection";
import NodePreview from "../Node/NodePreview";
import RequestPreview from "../Request/RequestPreview";
import PanoramaPreview from "../Panorama/PanoramaPreview";
import NodeAdd from "../Node/NodeAdd";
import Field from "../Field";

export default function Building({ id }) {
  const [building, setBuilding] = useState();
  const [editing, setEditing] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      try {
        setLoading(true);
        setError();
        const token = isAuthenticated ? await getAccessTokenSilently() : null;
        const resource = await fetchResource(`buildings/${id}`, token);
        setBuilding(resource);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    }
    fetchData();
  }, [isAuthenticated, getAccessTokenSilently, id]);

  async function addNode(node) {
    const token = await getAccessTokenSilently();
    await createResource("nodes", node, token);
    const resource = await fetchResource(`buildings/${id}`, token);
    setBuilding(resource);
    setEditing(false);
  }

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

  return (
    <DocumentTitle title={`${building.address} - NYC Mesh`}>
      <div className="w-100 pa3 f6">
        <div className="">
          <span className="f3 fw7">{building.address.split(",")[0]}</span>
        </div>
        <div className="mt2 flex">
          <span className="mid-gray f5 mr2">
            {building.address.split(",").slice(1).join(",")}
          </span>
        </div>
        <ResourceSection
          title="Details"
          disableEdit={!isAuthenticated}
          onEdit={() => setEditing("building")}
        >
          {building.name && <Field name="name" value={building.name} />}
          {building.address && (
            <Field name="address" value={building.address} />
          )}
          <Field name="BIN" value={building.bin} />
          <Field name="lat" value={building.lat} />
          <Field name="lng" value={building.lng} />
          <Field name="notes" value={building.notes} />
        </ResourceSection>

        <ResourceSection
          title="Panoramas"
          editLabel="Add"
          disableEdit={!isAuthenticated}
          onEdit={async () => {
            await setEditing(); // hack to rerun PanoramaAdd effect
            setEditing("panoramas");
          }}
        >
          <PanoramaPreview panoramas={building.panoramas} />
        </ResourceSection>

        <ResourceSection
          title="Nodes"
          editLabel="Add"
          onEdit={() => setEditing("nodes")}
        >
          {!building.nodes || !building.nodes.length ? (
            <div className="pv3">
              <span className="light-silver">No nodes</span>
            </div>
          ) : (
            building.nodes.map((node) => (
              <NodePreview key={node.id} node={node} />
            ))
          )}
        </ResourceSection>

        {isAuthenticated && (
          <ResourceSection title="Requests" disableEdit>
            {!building.requests || !building.requests.length ? (
              <div className="pv3">
                <span className="light-silver">No requests</span>
              </div>
            ) : (
              building.requests.map((request) => (
                <RequestPreview key={request.id} request={request} />
              ))
            )}
          </ResourceSection>
        )}

        {editing === "building" && (
          <ResourceEdit
            resourceType="building"
            resource={building}
            fields={[
              { key: "name", type: "text" },
              { key: "address", type: "text" },
              { key: "bin", label: "BIN", type: "number" },
              { key: "lat", type: "number" },
              { key: "lng", type: "number" },
              { key: "notes", type: "textarea" },
            ]}
            onSubmit={async (patch) => {
              const token = await getAccessTokenSilently();
              await updateResource("buildings", building.id, patch, token);
              const resource = await fetchResource(`buildings/${id}`, token);
              setBuilding(resource);
              setEditing(false);
            }}
            onCancel={() => setEditing(false)}
          />
        )}

        {editing === "nodes" && (
          <NodeAdd
            building={building}
            onCancel={() => setEditing(false)}
            onSubmit={addNode}
          />
        )}
      </div>
    </DocumentTitle>
  );
}
