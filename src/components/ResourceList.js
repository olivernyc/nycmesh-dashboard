import React, { useState, useEffect } from "react";
import BaseTable, { Column, AutoResizer } from "react-base-table";
import "react-base-table/styles.css";
import { Button, Dropdown } from "@primer/components";

import { useAuth0 } from "../react-auth0-wrapper";

export default function ResourceList(props) {
	const [data, setData] = useState([]);

	const { name, columns } = props;
	const { isAuthenticated, getTokenSilently } = useAuth0();

	useEffect(() => {
		async function fetchData() {
			const data = await fetchResource(name);
			setData(data);
			async function fetchResource(resource) {
				const path = `/v1/${resource}`;
				const token = await getTokenSilently();
				const options = {
					headers: {
						Authorization: `Bearer ${token}`
					}
				};
				try {
					const res = await fetch(path, options);
					if (res.status !== 200) throw Error(res.error);
					return await res.json();
				} catch (error) {
					alert(`Failed to fetch ${name}`);
					return [];
				}
			}
		}
		if (!isAuthenticated) return;
		fetchData();
	}, [isAuthenticated, getTokenSilently, name]);

	const keys = columns || (data.length ? Object.keys(data[0]) : []);

	return (
		<div
			className="mv2 bg-white br2 overflow-hidden shadow"
			style={{
				width: "calc(100vw - 19rem)"
			}}
		>
			<div className="flex items-center justify-between pa3">
				<Dropdown title="Filter">
					<Dropdown.Menu direction="se">
						<Dropdown.Item>Item 1</Dropdown.Item>
						<Dropdown.Item>Item 2</Dropdown.Item>
						<Dropdown.Item>Item 3</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>
				<Button>New</Button>
			</div>
			<div style={{ height: 20 * 38 - 4 }}>
				<AutoResizer>
					{({ width, height }) => (
						<BaseTable
							data={data.slice(0, 20)}
							width={width}
							maxHeight={1000}
							rowHeight={36}
							headerHeight={36}
						>
							{keys.map((key, index) => (
								<Column
									key={index}
									title={key.replace("_", " ")}
									dataKey={key}
									width={100}
									className="f6 fw4 mid-gray pointer"
									headerClassName="ttu f7 fw5 dark-gray"
									flexGrow={0.5}
								/>
							))}
						</BaseTable>
					)}
				</AutoResizer>
			</div>
			<div className="flex items-center justify-between pa3">
				<span className="f6 dark-gray">
					<span className="fw5">{data.length.toLocaleString()}</span>{" "}
					results
				</span>
				<div className="flex items-center">
					<div className="mr2">
						<Button disabled={true}>Previous</Button>
					</div>
					<Button>Next</Button>
				</div>
			</div>
		</div>
	);
}
