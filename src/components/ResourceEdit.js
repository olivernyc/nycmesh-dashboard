import React, { useState } from "react";

import Input from "./Input";
import Button from "./Button2";

export default function ResourceEdit(props) {
	const { resourceType, resource } = props;
	const [newResource, setNewResource] = useState(resource);

	const updateValue = (key, newValue) => {
		setNewResource({
			...newResource,
			[key]: newValue,
		});
	};
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
						props.onSubmit(newResource);
					}}
				>
					<div className="pa3 bg-near-white bt bb b--light-gray f6 fw5">
						{props.fields.map((field) => {
							if (field.type === "text")
								return (
									<Input
										label={field.key}
										value={newResource[field.key]}
										onChange={(newValue) =>
											updateValue(field.key, newValue)
										}
									/>
								);
							if (field.type === "textarea")
								return (
									<Input
										label={field.key}
										type="textarea"
										value={newResource[field.key]}
										onChange={(newValue) =>
											updateValue(field.key, newValue)
										}
									/>
								);
							if (field.type === "select")
								return (
									<Input
										label={field.key}
										type="select"
										options={field.options}
										value={newResource[field.key]}
										onChange={(newValue) =>
											updateValue(field.key, newValue)
										}
									/>
								);
							return null;
						})}
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
