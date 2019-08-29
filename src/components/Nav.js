import React from "react";
import { Link } from "react-router-dom";

const tabs = ["Nodes", "Buildings", "Requests", "Members"];

export default function Nav(props) {
	console.log(props);
	const pathComponents = props.location.pathname.split("/");
	const currentResource = pathComponents.length ? pathComponents[1] : "/";
	console.log(pathComponents, currentResource);
	return (
		<div className="w5 mr3">
			<ul className="ma0 list pa0 f6">
				{tabs.map(tab => (
					<li key={tab} className="pv1 mv1">
						<Link
							to={`/${tab.toLowerCase()}`}
							className={`link flex items-center ${
								tab.toLowerCase() === currentResource
									? "purple fw5"
									: "near-black"
							}`}
						>
							<div className="flex justify-center w2 mr2">
								<div
									className={`h1 w1 br-pill ${
										tab.toLowerCase() === currentResource
											? "bg-purple"
											: "bg-black-20"
									}`}
								/>
							</div>
							{tab}
							<span></span>
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}
