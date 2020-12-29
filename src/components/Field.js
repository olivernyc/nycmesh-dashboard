import React from "react";

export default function Field({ name, value }) {
  let label;
  if (typeof value === "boolean") {
    label = value ? "Yes" : "No";
  } else {
    label = value || `No ${name}`;
  }
  return (
    <div className="mv3">
      <div className="w4 mb1" style={{ minWidth: "8rem" }}>
        <span className="mid-gray ttc">{name}</span>
      </div>
      <span className="dark-gray">{label}</span>
    </div>
  );
}
