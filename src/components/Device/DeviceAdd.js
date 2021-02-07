import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import AsyncSelect from "react-select/async";

import Modal from "../Modal";
import Input from "../Input";
import { searchDeviceTypes } from "../../api";

export default function DeviceAdd({ node, onSubmit, onCancel }) {
  if (!node) throw new Error("Must specify a node");
  const [device, setDevice] = useState({
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
  const { getAccessTokenSilently } = useAuth0();

  function handleTypeChange(device_type) {
    setDevice((device) => ({
      ...device,
      device_type_id: device_type.id,
    }));
  }

  function handleSSIDChange(SSID) {
    setDevice((device) => ({
      ...device,
      SSID,
    }));
  }

  function handleNameChange(name) {
    setDevice((device) => ({
      ...device,
      name,
    }));
  }

  function handleLatChange(lat) {
    setDevice((device) => ({
      ...device,
      lat,
    }));
  }

  function handleLngChange(lng) {
    setDevice((device) => ({
      ...device,
      lng,
    }));
  }

  function handleAltChange(alt) {
    setDevice((device) => ({
      ...device,
      alt,
    }));
  }

  function handleAzimuthChange(azimuth) {
    setDevice((device) => ({
      ...device,
      azimuth,
    }));
  }

  function handleNotesChange(notes) {
    setDevice((device) => ({
      ...device,
      notes,
    }));
  }

  async function loadOptions(query) {
    const token = await getAccessTokenSilently();
    return searchDeviceTypes(query, token);
  }

  console.log(device);

  const validForm =
    device.node_id &&
    device.device_type_id &&
    device.name &&
    device.SSID &&
    device.lat &&
    device.lng &&
    device.azimuth &&
    device.alt;

  return (
    <Modal
      title="Add a device"
      buttonLabel="Add device"
      buttonDisabled={!validForm}
      onSubmit={() => {
        onSubmit && onSubmit(device);
      }}
      onCancel={onCancel}
    >
      <form onSubmit={({ preventDefault }) => preventDefault()}>
        <div className="flex flex-column mv3">
          <label htmlFor="member" className="mb2">
            Type
          </label>
          <div>
            <AsyncSelect
              onChange={handleTypeChange}
              loadOptions={loadOptions}
              getOptionLabel={({ name }) => name}
              getOptionValue={({ id }) => id}
              className="react-select"
              classNamePrefix="react-select"
            />
          </div>
        </div>

        <Input label="name" value={device.name} onChange={handleNameChange} />
        <Input label="SSID" value={device.SSID} onChange={handleSSIDChange} />
        <Input
          label="lat"
          type="number"
          value={device.lat}
          onChange={handleLatChange}
        />
        <Input
          label="lng"
          type="number"
          value={device.lng}
          onChange={handleLngChange}
        />
        <Input
          label="alt"
          type="number"
          value={device.alt}
          onChange={handleAltChange}
        />
        <Input
          label="azimuth"
          type="number"
          value={device.azimuth}
          onChange={handleAzimuthChange}
        />
        <Input
          label="notes"
          type="textarea"
          value={device.notes}
          onChange={handleNotesChange}
        />
      </form>
    </Modal>
  );
}
