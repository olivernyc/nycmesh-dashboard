import React from "react";
import { Link } from "react-router-dom";

const tabs = ["Nodes", "Buildings", "Requests", "Members"];

export default function Nav(props) {
	const pathComponents = props.location.pathname.split("/");
	const currentResource = pathComponents.length ? pathComponents[1] : "/";
	return (
		<div className="w5-ns bg-near-white pa3 br b--light-gray">
			<div className="flex items-center justify-between">
				<Link to="/" className="link flex items-center black">
					<div className="flex justify-center items-center w2-ns mr2-ns mr3">
						<div className={`h1 w1 br-pill bg-gold`} />
					</div>
					<span className="fw5">NYC Mesh</span>
				</Link>
			</div>
			<ul className="mb0 mt3 list pa0 f6 db-ns dn">
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
