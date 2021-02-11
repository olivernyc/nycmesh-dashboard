import React from "react";
import { Polyline } from "@react-google-maps/api";

const lineSymbol = {
  path: "M 0,-1 0,1",
  strokeOpacity: 1,
  scale: 3,
};

export default function LosLine({ from, to }) {
  const path = [
    { lat: from.lat, lng: from.lng },
    { lat: to.lat, lng: to.lng },
  ];

  const options = {
    strokeColor: "rgb(255,0,255)",
    strokeWeight: 2,
    strokeOpacity: 0,
    icons: [
      {
        icon: lineSymbol,
        offset: "0",
        repeat: "20px",
      },
    ],
    zIndex: 9,
  };
  return <Polyline path={path} options={options} />;
}
