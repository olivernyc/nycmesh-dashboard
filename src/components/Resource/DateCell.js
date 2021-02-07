import React from "react";
import { format, isThisYear, parseISO } from "date-fns";

export default function DateCell({ cellData }) {
  if (!cellData) return null;
  const date = parseISO(cellData);
  const formatString = isThisYear(date) ? "EEE, MMM d" : "MMM d, yyyy";
  return <time>{format(date, formatString)}</time>;
}
