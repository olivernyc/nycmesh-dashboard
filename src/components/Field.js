import React from "react";
import { Link } from "react-router-dom";

export default function Field({ name, value, url }) {
  let formattedValue;
  if (typeof value === "boolean") {
    formattedValue = value ? "Yes" : "No";
  } else {
    formattedValue = value || `No ${name}`;
  }
  const color = value ? "dark-gray" : "light-silver";
  return (
    <div className="mv3">
      <div className="w4 mb1" style={{ minWidth: "8rem" }}>
        <span className="mid-gray ttc">{name}</span>
      </div>
      {url ? (
        <Link to={url} className="link purple fw5">
          {formattedValue}
        </Link>
      ) : (
        <span className={color}>{formattedValue}</span>
      )}
    </div>
  );
}
