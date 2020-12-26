import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { withAuthenticationRequired } from "@auth0/auth0-react";

import Nav from "./components/Nav";
import SearchBar from "./components/SearchBar";
import Search from "./components/Search";
import Feed from "./components/Feed";
import MapView from "./components/MapView";
import DateCell from "./components/DateCell";
import ResourceList from "./components/ResourceList";
import ResourceDetail from "./components/ResourceDetail";
import Button from "./components/Button";
import Nodes from "./components/Nodes";
import Node from "./components/Node";
import Buildings from "./components/Buildings";
import Building from "./components/Building";
import Requests from "./components/Requests";

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
          <Route
            exact
            path="/requests/:id"
            render={({ match }) => (
              <ResourceDetail
                resourceName="requests"
                resourceId={match.params.id}
                blacklist={["id"]}
                titleExtractor={(resource) => resource.building.address}
                buttons={(resource) => [
                  <div className="mr2">
                    <a
                      className="black link"
                      target="_"
                      href={`https://earth.google.com/web/search/${resource.building.address
                        .split(" ")
                        .map(encodeURIComponent)
                        .join("+")}@${resource.building.lat},${
                        resource.building.lng
                      },${resource.building.alt}a,300d,35y,0.6h,65t,0r`}
                    >
                      <Button title="View Earth" />
                    </a>
                  </div>,
                  <div className="mr2">
                    <Button title="View Ticket" />
                  </div>,
                ]}
                renderers={{
                  date: (value) => <DateCell cellData={value} />,
                  email: (value) => (
                    <a className="link blue" href={`mailto:${value}`}>
                      {value}
                    </a>
                  ),
                  phone: (value) => (
                    <a className="link blue" href={`tel:${value}`}>
                      {value}
                    </a>
                  ),
                  roof_access: (value) => (value ? "Yes" : "No"),
                  panoramas: (value) => {
                    const panoramas = value.filter((panorama) => panorama.url);
                    return (
                      <div className="flex flex-wrap man1">
                        {panoramas.map((panorama) => (
                          <div className="h4 w-50 pa1">
                            <img
                              className="w-100 cover bg-center bg-near-white"
                              src={panorama.url}
                              alt="rooftop panorama thumbnail"
                            />
                          </div>
                        ))}
                      </div>
                    );
                  },
                }}
              />
            )}
          />

          <Route
            exact
            path="/members"
            render={() => (
              <ResourceList
                resourceName="members"
                columns={[
                  {
                    name: "email",
                    width: 250,
                    cellRenderer: ({ cellData }) => (
                      <span className="fw5 near-black">{cellData}</span>
                    ),
                  },
                  { name: "name", width: 200 },
                  { name: "phone" },
                  {
                    name: "nodes",
                    cellRenderer: ({ cellData }) =>
                      cellData ? (
                        <div className="flex">
                          {cellData
                            .filter((node) => node) // Handle null values from API bug
                            .map((node) => (
                              <div className=" bg-near-white br2 ph1 pv05 flex items-center mr1">
                                <div
                                  className="h05 w05 br-pill mr1"
                                  style={{
                                    backgroundColor:
                                      node.status === "active"
                                        ? "rgb(48,209,88)"
                                        : "rgb(142,142,147)",
                                  }}
                                />
                                <span className="fw5">
                                  {node.name || node.id}
                                </span>
                              </div>
                            ))}
                        </div>
                      ) : null,
                  },
                ]}
              />
            )}
          />
          <Route
            exact
            path="/members/:id"
            render={({ match }) => (
              <ResourceDetail
                resourceName="members"
                resourceId={match.params.id}
                titleExtractor={(resource) => resource.name}
                blacklist={["id"]}
                renderers={{
                  email: (value) => (
                    <a className="link blue" href={`mailto:${value}`}>
                      {value}
                    </a>
                  ),
                  phone: (value) => (
                    <a className="link blue" href={`tel:${value}`}>
                      {value}
                    </a>
                  ),
                }}
              />
            )}
          />
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
