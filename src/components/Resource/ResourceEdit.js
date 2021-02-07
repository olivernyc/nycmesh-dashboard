import React, { useState } from "react";

import Modal from "../Modal";
import Input from "../Input";

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
		<Modal
			title={`Update ${resourceType}`}
			buttonLabel={`Update ${resourceType}`}
			onSubmit={() => {
				props.onSubmit(newResource);
			}}
			onCancel={props.onCancel}
		>
			<form
				onSubmit={(event) => {
					event.preventDefault();
					props.onSubmit(newResource);
				}}
			>
				{props.fields.map((field) => {
					if (field.type === "text")
						return (
							<Input
								label={field.label || field.key}
								value={newResource[field.key]}
								onChange={(newValue) => updateValue(field.key, newValue)}
							/>
						);
					if (field.type === "select")
						return (
							<Input
								label={field.label || field.key}
								type="select"
								options={field.options}
								value={newResource[field.key]}
								onChange={(newValue) => updateValue(field.key, newValue)}
							/>
						);

					return (
						<Input
							label={field.label || field.key}
							type={field.type}
							value={newResource[field.key]}
							onChange={(newValue) => updateValue(field.key, newValue)}
						/>
					);
				})}
			</form>
		</Modal>
	);
}
