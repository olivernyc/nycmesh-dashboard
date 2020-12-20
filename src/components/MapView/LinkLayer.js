import React from "react";

import LinkLine from "./LinkLine";

function LinkLayer(props) {
	const { links } = props;
	return links
		.filter((link) => link.status === "active")
		.map((link) => <LinkLine key={link.id} link={link} />);
}

export default React.memo(LinkLayer);
