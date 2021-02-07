import React from "react";
import { Link } from "react-router-dom";

import { SmileyIcon, TrashcanIcon } from "@primer/octicons-react";

export default function MemberPreview({ member, onDelete }) {
	if (!member) return <div>Invalid member</div>;

	function handleDelete(event) {
		event.preventDefault();
		if (
			window.confirm(
				`Are you sure you want to remove ${member.name} from this node?`
			) &&
			onDelete
		) {
			onDelete(member);
		}
	}

	return (
		<Link to={`/map/members/${member.id}`} className="link">
			<div className="pv2 bb b--light-gray flex justify-between items-center show-on-hover">
				<div className="flex items-center">
					<div className="bg-silver h2 w2 br2 ml1 mr2 flex items-center justify-center white">
						<SmileyIcon />
					</div>
					<div>
						<div className="mb1">
							<span className="fw5 black">{member.name}</span>
						</div>
						<div className="mid-gray">
							<span>{member.email}</span>
						</div>
					</div>
				</div>

				{onDelete && (
					<div className="show-on-hover--content mr2">
						<button
							className="button-reset input-reset pa0 ma0 bn bg-transparent pointer"
							onClick={handleDelete}
						>
							<TrashcanIcon className="gray" />
						</button>
					</div>
				)}
			</div>
		</Link>
	);
}
