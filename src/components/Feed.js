import React from "react";
import Octicon, { Settings } from "@primer/octicons-react";
import Button from "./Button";

export default function NodeMap(props) {
	return (
		<div className="h-100 w-100 flex flex-column">
			<div className="flex items-center justify-between ph4-ns ph3">
				<h1 className="mv0 f5 fw5 ttc pv3">Feed</h1>
				<div>
					<Button
						title="Filters"
						icon={<Octicon icon={Settings} />}
					/>
				</div>
			</div>
		</div>
	);
}
