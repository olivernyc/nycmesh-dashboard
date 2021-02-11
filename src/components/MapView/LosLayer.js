import React, { useContext } from "react";

import LosLine from "./LosLine";
import { MapContext } from ".";

export default function LosLayer({ los }) {
  if (!los) return null;
  return los.map(({ from, to }) => (
    <LosLine key={`los-${from.id}-${to.id}`} from={from} to={to} />
  ));
}
