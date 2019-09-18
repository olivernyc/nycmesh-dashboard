import React from "react";
import { Link } from "react-router-dom";

const tabs = ["Nodes", "Buildings", "Requests", "Members"];

export default function Nav(props) {
	console.log(props);
	const pathComponents = props.location.pathname.split("/");
	const currentResource = pathComponents.length ? pathComponents[1] : "/";
	return (
		<div className="mw5 w-100 bg-near-white pa3 br b--light-gray">
			<div className="mb3">
				<Link to="/" className="link flex items-center black">
					<div className="flex justify-center items-center w2 mr2">
						<div className={`h1 w1 br-pill bg-gold`} />
					</div>
					<span className="fw5">NYC Mesh</span>
				</Link>
			</div>
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
							<div className="flex justify-center items-center w2 mr2">
								<div
									className={`h1 w1 br-pill ${
										tab.toLowerCase() === currentResource
											? "bg-purple"
											: "bg-black-20"
									}`}
								/>
							</div>
							<span>{tab}</span>
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}
