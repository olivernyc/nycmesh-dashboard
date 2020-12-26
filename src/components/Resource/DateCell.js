import React from "react";
import { format, isThisYear, parseISO } from "date-fns";

export default function DateCell(props) {
	const { cellData } = props;
	if (!cellData) return null;
	const date = parseISO(cellData);
	const formatString = isThisYear(date) ? "EEE, MMM d" : "MMM d, YYYY";
	return <time>{format(date, formatString)}</time>;
}
