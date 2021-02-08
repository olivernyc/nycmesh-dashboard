import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import AsyncSelect from "react-select/async";

import Modal from "../Modal";
import Input from "../Input";
import { search, fetchResource } from "../../api";

export default function NodeAdd({ building, onSubmit, onCancel }) {
  if (!building) throw new Error("Must specify a building");
  const [node, setNode] = useState({
    status: "active",
    lat: building.lat,
    lng: building.lng,
    alt: building.alt,
    location: building.address,
    building_id: building.id,
  });

  const { getAccessTokenSilently } = useAuth0();

  function handleNameChange(name) {
    setNode((node) => ({ ...node, name }));
  }

  function handleNotesChange(notes) {
    setNode((node) => ({ ...node, notes }));
  }

  function handleStatusChange(status) {
    setNode((node) => ({ ...node, status }));
  }

  function handleLatChange(lat) {
    setNode((node) => ({ ...node, lat }));
  }

  function handleLngChange(lng) {
    setNode((node) => ({ ...node, lng }));
  }

  function handleAltChange(alt) {
    setNode((node) => ({ ...node, alt }));
  }

  function excludeSameNode(option) {
    return option.value !== node.id;
  }

  const validForm =
    node.status && node.lat && node.lng && node.alt && node.building_id;

  return (
    <Modal
      title="Add a node"
      buttonLabel="Add node"
      buttonDisabled={!validForm}
      onSubmit={() => {
        onSubmit && onSubmit(node);
      }}
      onCancel={onCancel}
    >
      <form onSubmit={({ preventDefault }) => preventDefault()}>
        <div className="flex flex-column mv3">
          <Input label="name" value={node.name} onChange={handleNameChange} />
          <Input
            label="status"
            type="select"
            value={node.status}
            options={["active", "potential"]}
            onChange={handleStatusChange}
          />

          <Input
            label="latitude"
            value={node.lat}
            type="number"
            onChange={handleLatChange}
          />
          <Input
            label="longitude"
            value={node.lng}
            type="number"
            onChange={handleLngChange}
          />
          <Input
            label="altitude"
            value={node.alt}
            type="number"
            onChange={handleAltChange}
          />
          <Input
            label="notes"
            value={node.notes}
            type="textarea"
            onChange={handleNotesChange}
          />
        </div>
      </form>
    </Modal>
  );
}
