import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { withAuthenticationRequired } from "@auth0/auth0-react";

import Nav from "./components/Nav";
import SearchBar from "./components/SearchBar";
import Search from "./components/Search";
import MapView from "./components/MapView";
import Nodes from "./components/Node/Nodes";
import Buildings from "./components/Building/Buildings";
import Requests from "./components/Request/Requests";
import Members from "./components/Member/Members";
import Appointments from "./components/Appointment/Appointments";

function App() {
  return (
    <Router>
      <div
        className="sans-serif w-100 flex-l flex-row justify-between-ns"
        style={{ height: "100vh" }}
      >
        <Route component={Nav} />
        <div className="w-100 flex flex-column">
          <Route component={SearchBar} />
          <Route path="/search" component={Search} />
          <Route
            exact
            path={[
              "/",
              "/map",
              "/map/nodes/:nodeId",
              "/map/requests/:requestId",
              "/map/members/:memberId",
              "/map/buildings/:buildingId",
              "/map/devices/:deviceId",
              "/appointments/:appointmentId",
              "/map/appointments/:appointmentId",
            ]}
            component={MapView}
          />
          <Route exact path="/nodes" component={Nodes} />
          <Route exact path="/buildings" component={Buildings} />
          <Route exact path="/requests" component={Requests} />
          <Route exact path="/members" component={Members} />
          <Route exact path="/appointments" component={Appointments} />
        </div>
      </div>
    </Router>
  );
}

export default withAuthenticationRequired(App, {
  onRedirecting: () => (
    <div
      className="h-100 w-100 flex items-center justify-center"
      style={{ height: "100vh" }}
    >
      <div className="loading-ring-large" />
    </div>
  ),
});
