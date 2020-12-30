import React from "react";

export default function Field({ name, value }) {
  let formattedValue;
  if (typeof value === "boolean") {
    formattedValue = value ? "Yes" : "No";
  } else {
    formattedValue = value || `No ${name}`;
  }
  return (
    <div className="mv3">
      <div className="w4 mb1" style={{ minWidth: "8rem" }}>
        <span className="mid-gray ttc">{name}</span>
      </div>
      <span className="dark-gray">{formattedValue}</span>
    </div>
  );
}
