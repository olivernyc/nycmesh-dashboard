import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

import Modal from "../Modal";
import { fetchResource } from "../../api";

export default function MemberSelect(props) {
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();

  async function fetchMembers() {
    const token = await getAccessTokenSilently();
    const members = await fetchResource("members", token);
    const sorted = members.filter(m => m.name).sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase())

    setMembers(sorted);
    setLoading(false);

    if (sorted[0]) {
      setSelectedId(sorted[0].id)
    }
  }

  function handleChange(e) {
    setSelectedId(parseInt(e.target.value, 10))
  }

  useEffect(() => {
    if (!isAuthenticated) return;

    fetchMembers();
  }, [isAuthenticated, getAccessTokenSilently])

  return (
    <Modal
      title="Add a member"
      buttonLabel="Add member"
      onDone={() => {
        props.onSubmit(selectedId)
      }}
      onCancel={props.onCancel}
    >
      <div className="flex flex-column">
        <label htmlFor="member" className="mb2">Member</label>
        <div>
          <select id="member" className="mr2" onChange={handleChange}>
            {
              members.map(m =>
                <option key={m.id} value={m.id}>{m.name} – {m.email}</option>
              )
            }
          </select>

          {
            loading ?
            <div>Loading...</div> :
            null
          }
        </div>
      </div>
    </Modal>
  );
}
