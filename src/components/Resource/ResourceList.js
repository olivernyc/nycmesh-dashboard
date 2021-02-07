import React, { useState, useEffect } from "react";
import BaseTable, { AutoResizer } from "react-base-table";
import { Link } from "react-router-dom";
import { FilterIcon } from "@primer/octicons-react";
import { useAuth0 } from "@auth0/auth0-react";

import Button from "../Button2";

export default function ResourceList(props) {
	const { resourceName, title, columns } = props;
	const [data, setData] = useState([]);
	const { isAuthenticated, getAccessTokenSilently } = useAuth0();

	useEffect(() => {
		async function fetchData() {
			const data = await fetchResource(resourceName);
			setData(data);
			async function fetchResource(resource) {
				const path = `${process.env.REACT_APP_API_ROOT}/${resource}`;
				const token = await getAccessTokenSilently();
				const options = {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				};
				try {
					const res = await fetch(path, options);
					if (res.status !== 200) throw Error(res.error);
					return await res.json();
				} catch (error) {
					alert(`Failed to fetch ${resourceName}`);
					return [];
				}
			}
		}
		if (!isAuthenticated) return;
		fetchData();
	}, [isAuthenticated, getAccessTokenSilently, resourceName]);

	return (
		<div className="w-100">
			<div className="flex items-center justify-between ph4-ns ph3">
				<h1 className="mv0 f5 fw5 ttc pv3">{resourceName}</h1>
				<div>
					<Button title="Filters" icon={<FilterIcon />} />
				</div>
			</div>
			<div style={{ height: "calc(100vh - 50px)" }}>
				<AutoResizer>
					{({ width, height }) => (
						<BaseTable
							width={width}
							height={height}
							rowHeight={36}
							headerHeight={36}
							fixed={width < 900}
							data={data}
							columns={columns.map((column, index) => ({
								key: column.name,
								dataKey: column.name,
								title: column.title || column.name.replace("_", " "),
								width: column.width || 200,
								flexGrow: column.width ? 0 : 1,
								className: "f6 fw4 dark-gray pointer",
								headerClassName: "ttu f7 fw5 near-black",
								cellRenderer: column.cellRenderer,
							}))}
							headerRenderer={({ rowData, cells }) => (
								<div className="ph3-ns flex w-100 h-100 bg-white f6">
									{cells}
								</div>
							)}
							rowRenderer={({ rowData, cells }) => (
								<Link
									to={`/map/${resourceName}/${rowData.id}`}
									className="w-100 h-100 flex link ph3-ns bg-white"
								>
									{cells}
								</Link>
							)}
						></BaseTable>
					)}
				</AutoResizer>
			</div>
		</div>
	);
}
