import React from "react";
import ReactDOM from "react-dom";
import "tachyons";

import "./index.css";
import App from "./App";
import { Auth0Provider } from "./components/Auth0";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
	<Auth0Provider
		domain={process.env.REACT_APP_AUTH0_DOMAIN}
		client_id={process.env.REACT_APP_AUTH0_CLIENT_ID}
		audience={process.env.REACT_APP_AUTH0_AUDIENCE}
		redirect_uri={window.location.origin}
	>
		<App />
	</Auth0Provider>,
	document.getElementById("root")
);

serviceWorker.unregister();
