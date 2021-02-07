import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import AsyncSelect from "react-select/async";

import Modal from "../Modal";
import { search, fetchResource } from "../../api";

export default function LinkAdd({ node, onSubmit, onCancel }) {
  if (!node) throw new Error("Must specify a node");
  const [link, setLink] = useState({
    device_type_id: null,
    node_id: node.id,
    name: "",
    SSID: "",
    lat: node.lat,
    lng: node.lng,
    alt: node.alt,
    azimuth: null,
    notes: "",
  });
  const [nodeB, setNodeB] = useState();
  const [nodeBDevices, setNodeBDevices] = useState([]);

  const { getAccessTokenSilently } = useAuth0();

  function handleDeviceAChange(device) {
    setLink((link) => ({
      ...link,
      device_a_id: device.id,
    }));
  }

  function handleNodeBChange(node) {
    setNodeB(node);
  }

  function handleDeviceBChange(device) {
    setLink((link) => ({
      ...link,
      device_b_id: device.id,
    }));
  }

  async function loadNodeBOptions(query) {
    const token = await getAccessTokenSilently();
    const { nodes } = await search(query, token);
    return nodes;
  }

  useEffect(() => {
    setNodeBDevices([]);
    if (!nodeB) return;
    (async () => {
      const token = await getAccessTokenSilently();
      const { devices } = await fetchResource(`nodes/${nodeB.id}`, token);
      setNodeBDevices(devices);
    })();
  }, [nodeB, getAccessTokenSilently]);

  const validForm = link.device_a_id && link.device_b_id;

  return (
    <Modal
      title="Add a link"
      buttonLabel="Add link"
      buttonDisabled={!validForm}
      onSubmit={() => {
        onSubmit && onSubmit(link);
      }}
      onCancel={onCancel}
    >
      <form onSubmit={({ preventDefault }) => preventDefault()}>
        <div className="flex flex-column mv3">
          <label htmlFor="member" className="mb2">
            Device A
          </label>
          <div>
            <AsyncSelect
              onChange={handleDeviceAChange}
              defaultOptions={node.devices}
              getOptionLabel={({ ssid, type }) => ssid || type.name}
              getOptionValue={({ id }) => id}
              className="react-select"
              classNamePrefix="react-select"
            />
          </div>
        </div>

        <div className="flex flex-column mv3">
          <label htmlFor="member" className="mb2">
            Node B
          </label>

          <div>
            <AsyncSelect
              onChange={handleNodeBChange}
              loadOptions={loadNodeBOptions}
              getOptionLabel={({ id, name }) => name || id}
              getOptionValue={({ id }) => id}
              className="react-select"
              classNamePrefix="react-select"
            />
          </div>
        </div>

        {nodeBDevices && nodeBDevices.length > 0 && (
          <div className="flex flex-column mv3">
            <label htmlFor="member" className="mb2">
              Device B
            </label>

            <div>
              <AsyncSelect
                onChange={handleDeviceBChange}
                defaultOptions={nodeBDevices}
                getOptionLabel={({ ssid, type }) => ssid || type.name}
                getOptionValue={({ id }) => id}
                className="react-select"
                classNamePrefix="react-select"
              />
            </div>
          </div>
        )}
      </form>
    </Modal>
  );
}
