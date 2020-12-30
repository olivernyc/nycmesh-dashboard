import React from "react";
import Octicon, { Trashcan } from "@primer/octicons-react";

export default function MemberPreview(props) {
	const { member, onDelete } = props;
	if (!member) return <div>Invalid member</div>;

	function handleDelete(e) {
		e.preventDefault();

		if (window.confirm(`Are you sure you want to remove ${member.name} from this node?`) && onDelete) {
			onDelete(member)
		}
	}

	return (
		<div className="pv3 bb b--light-gray flex justify-between items-center show-on-hover">
			<div>
				<div className="mb1">
					<span className="fw5">{member.name}</span>
				</div>
				<div className="mid-gray">
					<span>{member.email}</span> • <span>{member.phone}</span>
				</div>
			</div>

			<div className="show-on-hover--content mr2">
				<a href="" onClick={handleDelete}>
					<Octicon className="gray" icon={Trashcan} />
				</a>
			</div>
		</div>
	);
}
