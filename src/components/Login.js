import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

export default function Login() {
  const { loading, isAuthenticated, loginWithRedirect, logout } = useAuth0();

  const label = isAuthenticated ? "Log out →" : "Log in →";
  const returnTo = `${window.location.pathname}${window.location.search}`;
  const onClick = isAuthenticated
    ? () => logout({ returnTo })
    : () =>
        loginWithRedirect({
          appState: {
            returnTo,
          },
        });

  return (
    <button
      className="pa0 bn bg-transparent purple f6 pointer"
      onClick={onClick}
    >
      {label}
    </button>
  );
}
