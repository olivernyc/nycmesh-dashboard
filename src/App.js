import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { withAuthenticationRequired } from "@auth0/auth0-react";

import Nav from "./components/Nav";
import SearchBar from "./components/SearchBar";
import Search from "./components/Search";
import Feed from "./components/Feed";
import MapView from "./components/MapView";
import Nodes from "./components/Node/Nodes";
import Node from "./components/Node/Node";
import Buildings from "./components/Building/Buildings";
import Building from "./components/Building/Building";
import Requests from "./components/Request/Requests";
import Request from "./components/Request/Request";
import Members from "./components/Member/Members";
import Member from "./components/Member/Member";

function App() {
  return (
    <Router>
      <div
        className="sans-serif w-100 flex-l flex-row justify-between-ns"
        style={{ height: "100vh" }}
      >
        <Route component={Nav} />
        <div className="mw5 w-100" />
        <div className="w-100 flex flex-column">
          <div className="bb b--light-gray">
            <SearchBar />
          </div>
          <Route path="/search" component={Search} />
          <Route path="/feed" component={Feed} />
          <Route
            exact
            path={[
              "/",
              "/map",
              "/map/nodes/:nodeId",
              "/map/requests/:requestId",
              "/map/members/:memberId",
            ]}
            component={MapView}
          />
          <Route exact path="/nodes" component={Nodes} />
          <Route exact path="/nodes/:id" component={Node} />

          <Route exact path="/buildings" component={Buildings} />
          <Route exact path="/buildings/:id" component={Building} />

          <Route exact path="/requests" component={Requests} />
          <Route exact path="/requests/:id" component={Request} />

          <Route exact path="/members" component={Members} />
          <Route exact path="/members/:id" component={Member} />
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
