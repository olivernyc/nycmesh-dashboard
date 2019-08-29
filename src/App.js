import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { useAuth0 } from "./react-auth0-wrapper";
import Header from "./components/Header";
import Nav from "./components/Nav";
import ResourceList from "./components/ResourceList";

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
      <div className="helvetica">
        <div className="fixed top-0 left-0 right-0 z-5 bg-light-gray">
          <Header />
        </div>
        <div
          className="w-100 flex justify-between ph3 pb4 relative z-0"
          style={{ marginTop: "64px" }}
        >
          <div>
            <div className="fixed z-9">
              <Route component={Nav} />
            </div>
          </div>
          <div>
            <Route
              exact
              path="/nodes"
              render={() => (
                <ResourceList
                  name="nodes"
                  columns={["id", "address", "created"]}
                />
              )}
            />
            <Route
              exact
              path="/buildings"
              render={() => (
                <ResourceList
                  name="buildings"
                  columns={["address", "nodes", "join_requests"]}
                />
              )}
            />
            <Route
              exact
              path="/requests"
              render={() => (
                <ResourceList
                  name="requests"
                  columns={["member", "address", "roof_access", "date"]}
                />
              )}
            />
            <Route
              exact
              path="/members"
              render={() => (
                <ResourceList
                  name="members"
                  columns={["email", "name", "phone"]}
                />
              )}
            />
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
