import React, { useState, useEffect } from "react";
import Octicon, { Sync } from "@primer/octicons-react";

import Button from "./Button2";
import { useAuth0 } from "./Auth0";
import { fetchResource } from "../api";


export default function MemberSelect(props) {
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const { isAuthenticated, getTokenSilently } = useAuth0();

  async function fetchMembers() {
    const token = await getTokenSilently();
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
  }, [isAuthenticated, getTokenSilently])

  return (
    <div className="absolute absolute--fill bg-white-70 z-5">
      <div
        className="bg-white mw6 w-100 center shadow br2"
        style={{ marginTop: "15vh" }}
      >
        <div className="pa3 f5 fw5">Add a member</div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            props.onSubmit(selectedId);
          }}
        >
          <div className="pa3 bg-near-white bt bb b--light-gray f6 fw5 flex flex-column">
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
                <Octicon icon={Sync} className="spin gray" /> :
                null
              }
            </div>
          </div>
          <div className="pa3 flex justify-end">
            <div className="ml2">
              <Button label="Cancel" onClick={props.onCancel} />
            </div>
            <div className="ml2">
              <Button
                label="Add member"
                primary
                type="submit"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
