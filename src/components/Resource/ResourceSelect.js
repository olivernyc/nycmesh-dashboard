import React, { useState } from "react";

import Button from "./Button2";

export default function ResourceEdit(props) {
	const { resourceType, resource } = props;
	return (
		<div className="absolute absolute--fill bg-white-70 z-5">
			<div
				className="bg-white mw6 w-100 center shadow br2"
				style={{ marginTop: "15vh" }}
			>
				<div className="pa3 f5 fw5">Update {resourceType}</div>
				<form
					onSubmit={(event) => {
						event.preventDefault();
					}}
				>
					<div className="pa3 bg-near-white bt bb b--light-gray f6 fw5">
						{}
					</div>
					<div className="pa3 flex justify-end">
						<div className="ml2">
							<Button label="Cancel" onClick={props.onCancel} />
						</div>
						<div className="ml2">
							<Button
								label={`Update ${resourceType}`}
								primary
								type="submit"
							/>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}
