import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import DocumentTitle from "react-document-title";

import { fetchResource } from "../../api";

import ResourceSection from "../Resource/ResourceSection";
import MemberPreview from "../Member/MemberPreview";
import NodePreview from "../Node/NodePreview";
import RequestPreview from "../Request/RequestPreview";
import Field from "../Field";

export default function Appointment({ id }) {
  const [appointment, setAppointment] = useState();
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
        const resource = await fetchResource(`appointments/${id}`, token);
        setAppointment(resource);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    }
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

  const localizedDate = new Date(appointment.date).toLocaleDateString(
    undefined,
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <DocumentTitle
      title={`${appointment.type} - ${appointment.building.address} - NYC Mesh`}
    >
      <div className="w-100 pa3 f6">
        <div className="">
          <span className="f3 fw7 ttc">{appointment.type}</span>
        </div>
        <div className="mt2 flex">
          <span className="mid-gray f5 mr2">
            {appointment.building.address}
          </span>
        </div>
        <ResourceSection title="Details" disableEdit={true}>
          <Field name="date" value={localizedDate} />
          <Field name="notes" value={appointment.notes} />
        </ResourceSection>
        <ResourceSection title="Node" editLabel="Add" disableEdit={true}>
          {!appointment.node ? (
            <div className="pv3">
              <span className="light-silver">No node</span>
            </div>
          ) : (
            <NodePreview key={appointment.node.id} request={appointment.node} />
          )}
        </ResourceSection>

        <ResourceSection title="Member" disableEdit>
          {!appointment.member ? (
            <div className="pv3">
              <span className="light-silver">No members</span>
            </div>
          ) : (
            <MemberPreview
              key={appointment.member.id}
              member={appointment.member}
            />
          )}
        </ResourceSection>

        <ResourceSection title="Request" disableEdit>
          {!appointment.request ? (
            <div className="pv3">
              <span className="light-silver">No request</span>
            </div>
          ) : (
            <RequestPreview
              key={appointment.request.id}
              request={appointment.request}
            />
          )}
        </ResourceSection>
      </div>
    </DocumentTitle>
  );
}
