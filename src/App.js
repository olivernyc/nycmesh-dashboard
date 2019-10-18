import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import LazyLoad from "react-lazyload";
import { useAuth0 } from "./components/Auth0";
import Nav from "./components/Nav";
import Feed from "./components/Feed";
import MapView from "./components/MapView";
import DateCell from "./components/DateCell";
import ResourceList from "./components/ResourceList";
import ResourceDetail from "./components/ResourceDetail";
import Button from "./components/Button";

function App() {
  const { loading, isAuthenticated, loginWithRedirect } = useAuth0();

  if (loading) return null;

  if (!isAuthenticated) {
    loginWithRedirect({
      appState: { targetUrl: window.location.pathname }
    });
    return null;
  }

  return (
    <Router>
      <div
        className="sans-serif w-100 flex flex-row-ns flex-column justify-between-ns"
        style={{ height: "100vh" }}
      >
        <Route component={Nav} />
        <div className="mw5 w-100" />
        <Route path="/feed" component={Feed} />
        <Route path="/map" component={MapView} />

        <Route
          exact
          path="/nodes"
          render={() => (
            <ResourceList
              resourceName="nodes"
              columns={[
                {
                  name: "id",
                  width: 64,
                  cellRenderer: ({ cellData }) => (
                    <span className="fw5 near-black">{cellData}</span>
                  )
                },
                {
                  name: "status",
                  width: 80,
                  cellRenderer: ({ cellData }) => (
                    <div
                      className="ph1 pv1 br2 f7 fw5 ttc black-60"
                      style={{
                        backgroundColor:
                          cellData === "active"
                            ? "rgba(48,209,88,0.25)"
                            : "rgba(142,142,147,0.25)"
                      }}
                    >
                      {cellData}
                    </div>
                  )
                },
                { name: "building", width: 350 },
                { name: "notes" },
                {
                  name: "create_date",
                  width: 150,
                  cellRenderer: DateCell
                }
              ]}
            />
          )}
        />
        <Route
          exact
          path="/nodes/:id"
          render={({ match }) => (
            <ResourceDetail
              resourceName="nodes"
              resourceId={match.params.id}
              titleExtractor={resource =>
                resource.name || `Node ${resource.id}`
              }
              renderers={{
                create_date: value => <DateCell cellData={value} />,
                building: value => (
                  <Link className="link blue" to={`/buildings/${value.id}`}>
                    {value.address}
                  </Link>
                )
              }}
              blacklist={["lat", "lng", "alt", "name"]}
            />
          )}
        />

        <Route
          exact
          path="/buildings"
          render={() => (
            <ResourceList
              resourceName="buildings"
              columns={[
                {
                  name: "address",
                  width: 350,
                  cellRenderer: ({ cellData }) => (
                    <span className="fw5 near-black truncate">{cellData}</span>
                  )
                },
                {
                  name: "nodes",
                  cellRenderer: ({ cellData }) =>
                    cellData ? (
                      <div className="flex">
                        {cellData
                          .filter(node => node) // Handle null values from API bug
                          .map(node => (
                            <div
                              key={node.id}
                              className=" bg-near-white br2 ph1 pv05 flex items-center mr2"
                            >
                              <div
                                className="h05 w05 br-pill mr1"
                                style={{
                                  backgroundColor:
                                    node.status === "active"
                                      ? "rgb(48,209,88)"
                                      : "rgb(142,142,147)"
                                }}
                              />
                              <span className="fw5">
                                {node.name || node.id}
                              </span>
                            </div>
                          ))}
                      </div>
                    ) : null
                },
                { name: "requests" }
              ]}
            />
          )}
        />
        <Route
          exact
          path="/buildings/:id"
          render={({ match }) => (
            <ResourceDetail
              resourceName="buildings"
              resourceId={match.params.id}
              titleExtractor={resource => resource.address}
              blacklist={["id", "lat", "lng", "bin_address", "requests"]}
            />
          )}
        />

        <Route
          exact
          path="/requests"
          render={() => (
            <ResourceList
              resourceName="requests"
              columns={[
                {
                  name: "address",
                  width: 350,
                  cellRenderer: ({ cellData }) => (
                    <span className="fw5 near-black truncate">{cellData}</span>
                  )
                },
                {
                  name: "member",
                  cellRenderer: ({ cellData }) => <span>{cellData.name}</span>
                },
                {
                  name: "roof_access",
                  width: 120,
                  cellRenderer: ({ cellData }) => (
                    <span className="ttc">{cellData}</span>
                  )
                },
                {
                  name: "panoramas",
                  cellRenderer: ({ cellData }) => (
                    <div className="flex items-center overflow-hidden">
                      {cellData
                        .filter(panorama => panorama.url)
                        .map(panorama => (
                          <LazyLoad height={16}>
                            <img
                              src={panorama.url}
                              className="h1 mr1"
                              alt="panorama thumbnail"
                            />
                          </LazyLoad>
                        ))}
                    </div>
                  )
                },
                {
                  name: "date",
                  width: 150,
                  cellRenderer: DateCell
                }
              ]}
            />
          )}
        />
        <Route
          exact
          path="/requests/:id"
          render={({ match }) => (
            <ResourceDetail
              resourceName="requests"
              resourceId={match.params.id}
              blacklist={["id"]}
              titleExtractor={resource => resource.building.address}
              buttons={resource => [
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
                  <a className="black link" target="_" href="#">
                    <Button title="View Ticket" />
                  </a>
                </div>
              ]}
              renderers={{
                date: value => <DateCell cellData={value} />,
                email: value => (
                  <a className="link blue" href={`mailto:${value}`}>
                    {value}
                  </a>
                ),
                phone: value => (
                  <a className="link blue" href={`tel:${value}`}>
                    {value}
                  </a>
                ),
                roof_access: value => (value ? "Yes" : "No"),
                panoramas: value => {
                  const panoramas = value.filter(panorama => panorama.url);
                  return (
                    <div className="flex flex-wrap man1">
                      {panoramas.map(panorama => (
                        <div className="h4 w-50 pa1">
                          <div
                            className="h-100 w-100 cover bg-center bg-near-white"
                            style={{
                              backgroundImage: `url('${panorama.url}')`
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  );
                }
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
                  )
                },
                { name: "name", width: 200 },
                { name: "phone" },
                {
                  name: "nodes",
                  cellRenderer: ({ cellData }) =>
                    cellData ? (
                      <div className="flex">
                        {cellData
                          .filter(node => node) // Handle null values from API bug
                          .map(node => (
                            <div className=" bg-near-white br2 ph1 pv05 flex items-center mr1">
                              <div
                                className="h05 w05 br-pill mr1"
                                style={{
                                  backgroundColor:
                                    node.status === "active"
                                      ? "rgb(48,209,88)"
                                      : "rgb(142,142,147)"
                                }}
                              />
                              <span className="fw5">
                                {node.name || node.id}
                              </span>
                            </div>
                          ))}
                      </div>
                    ) : null
                }
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
              titleExtractor={resource => resource.name}
              blacklist={["id"]}
              renderers={{
                email: value => (
                  <a className="link blue" href={`mailto:${value}`}>
                    {value}
                  </a>
                ),
                phone: value => (
                  <a className="link blue" href={`tel:${value}`}>
                    {value}
                  </a>
                )
              }}
            />
          )}
        />
      </div>
    </Router>
  );
}

export default App;
