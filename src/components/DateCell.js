import React from "react";
import { format, isThisYear } from "date-fns";

export default function Date(props) {
	const { cellData } = props;
	if (!cellData) return null;
	const formatString = isThisYear(cellData) ? "ddd, MMM D" : "MMM D, YYYY";
	return <time>{format(cellData, formatString)}</time>;
}
