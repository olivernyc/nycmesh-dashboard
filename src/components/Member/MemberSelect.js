import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import AsyncSelect from "react-select/async";
import _ from "underscore";

import Modal from "../Modal";
import { searchMembers } from "../../api";

export default function MemberSelect(props) {
  const [selectedId, setSelectedId] = useState(null);
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();

  function handleChange(member) {
    setSelectedId(member.id)
  }

  async function loadOptions(query) {
    const token = await getAccessTokenSilently();
    return searchMembers(query, token);
  }

  function excludeExistingNodeMembers(option) {
    const existingIds = _.map(props.existingMembers, 'id');

    return !_.include(existingIds, option.data.id);
  }

  return (
    <Modal
      title="Add a member"
      buttonLabel="Add member"
      buttonEnabled={ !!selectedId }
      onSubmit={() => {
        props.onSubmit(selectedId)
      }}
      onCancel={props.onCancel}
    >
      <div className="flex flex-column">
        <label htmlFor="member" className="mb2">Member</label>
        <div>
          <AsyncSelect
            onChange={handleChange}
            loadOptions={loadOptions}
            filterOption={excludeExistingNodeMembers}
            getOptionLabel={o => `${o.name} – ${o.email}`}
            getOptionValue={o => o.id}
            className="react-select"
            classNamePrefix="react-select"
          />
        </div>
      </div>
    </Modal>
  );
}
