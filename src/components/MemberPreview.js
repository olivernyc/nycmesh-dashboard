import React from "react";

export default function MemberPreview(props) {
	const { member } = props;
	if (!member) return <div>Invalid member</div>;
	return (
		<div className="pv3 bb b--light-gray">
			<div className="mb1">
				<span className="fw5">{member.name}</span>
			</div>
			<div className="mid-gray">
				<span>{member.email}</span> • <span>{member.phone}</span>
			</div>
		</div>
	);
}
