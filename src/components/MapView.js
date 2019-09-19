import React from "react";
import { withScriptjs, withGoogleMap, GoogleMap } from "react-google-maps";
import Octicon, { Settings } from "@primer/octicons-react";
import Button from "./Button";

// import NodeMarker from "./NodeMarker";
// import KioskMarker from "./KioskMarker";
// import LinkLine from "./LinkLine";
// import NodeDetail from "../NodeDetail";
// import Gallery from "../Gallery";

const DEFAULT_ZOOM = 11;
const DEFAULT_CENTER = { lat: 40.72, lng: -73.9595798 };
const MAP_STYLES = [
	{
		elementType: "labels.icon",
		stylers: [
			{
				visibility: "off"
			}
		]
	},
	{
		featureType: "road",
		elementType: "labels.icon",
		stylers: [
			{
				visibility: "off"
			}
		]
	},
	{
		featureType: "road.highway",
		stylers: [
			{
				visibility: "off"
			}
		]
	},
	{
		featureType: "transit",
		stylers: [
			{
				visibility: "off"
			}
		]
	}
];

const options = {
	styles: MAP_STYLES,
	fullscreenControl: false,
	streetViewControl: false,
	mapTypeControl: false,
	zoomControlOptions: {
		position: "9"
	},
	mapTypeControlOptions: {
		position: "3"
	},
	backgroundColor: "#f5f5f5",
	gestureHandling: "greedy",
	clickableIcons: false
};

const MapComponent = withScriptjs(
	withGoogleMap(props => (
		<GoogleMap ref={props.mapRef} {...props}>
			{props.children}
		</GoogleMap>
	))
);

export default function NodeMap(props) {
	return (
		<div className="h-100 w-100 flex flex-column">
			<div className="flex items-center justify-between ph4-ns ph3">
				<h1 className="mv0 f5 fw5 ttc pv3">Map</h1>
				<div>
					<Button
						title="Filters"
						icon={<Octicon icon={Settings} />}
					/>
				</div>
			</div>
			<MapComponent
				defaultZoom={DEFAULT_ZOOM}
				defaultCenter={DEFAULT_CENTER}
				defaultOptions={options}
				loadingElement={<div className="flex" style={{ flex: 1 }} />}
				containerElement={<div className="flex" style={{ flex: 1 }} />}
				mapElement={<div className="flex" style={{ flex: 1 }} />}
				googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyBNClp7oJsw-eleEoR3-PQKV23tpeW-FpE"
			>
				{
					// {this.renderLinks()}
					// {this.renderKiosks()}
					// {this.renderNodes()}
					// {this.renderNodeDetail()}
				}
			</MapComponent>
		</div>
	);
}

// class MapView extends Component {
// 	// 	render() {
// 	// 		const { history } = this.props;
// 	// 		return (
// 	// 			<MapComponent
// 	// 				mapRef={this.map}
// 	// 				defaultZoom={DEFAULT_ZOOM}
// 	// 				defaultCenter={DEFAULT_CENTER}
// 	// 				defaultOptions={options}
// 	// 				onClick={() => {
// 	// 					// TODO: Make this less hacky
// 	// 					setTimeout(() => {
// 	// 						const now = Date.now();
// 	// 						if (now - this.lastDoubleClick > 2000) {
// 	// 							history.push("/");
// 	// 						}
// 	// 					}, 500);
// 	// 				}}
// 	// 				onDblClick={() => {
// 	// 					const now = Date.now();
// 	// 					this.lastDoubleClick = now;
// 	// 				}}
// 	// 				loadingElement={<div className="h-100 flex flex-column" />}
// 	// 				containerElement={<div className="h-100 flex flex-column" />}
// 	// 				mapElement={<div className="h-100 flex flex-column" />}
// 	// 				googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyBNClp7oJsw-eleEoR3-PQKV23tpeW-FpE"
// 	// 			>
// 	// 				{this.renderLinks()}
// 	// 				{this.renderKiosks()}
// 	// 				{this.renderNodes()}
// 	// 				{this.renderNodeDetail()}
// 	// 				<Route
// 	// 					exact
// 	// 					path="/nodes/:nodeId/panoramas/:panoId"
// 	// 					component={Gallery}
// 	// 				/>
// 	// 			</MapComponent>
// 	// 		);
// 	// 	}
// 	//
// 	// 	renderNodes() {
// 	// 		const { nodes, filters } = this.props;
// 	//
// 	// 		// TODO: Refactor
// 	// 		const selectedIds = this.selectedNodeIds().reduce(
// 	// 			(idMap, nodeId) => ({ ...idMap, [nodeId]: true }),
// 	// 			{}
// 	// 		);
// 	// 		return nodes.map(node => {
// 	// 			const isFiltered = filters[node.type] === false;
// 	// 			const isSelected = selectedIds[node.id] === true;
// 	// 			let neighborIsSelected = false;
// 	// 			if (node.links) {
// 	// 				node.links.forEach(link => {
// 	// 					if (selectedIds[link.from] && selectedIds[link.to]) {
// 	// 						neighborIsSelected = true;
// 	// 					}
// 	// 				});
// 	// 			}
// 	// 			const visible = !isFiltered || isSelected || neighborIsSelected;
// 	//
// 	// 			return (
// 	// 				<NodeMarker
// 	// 					key={node.id}
// 	// 					node={node}
// 	// 					visible={visible}
// 	// 					filters={filters}
// 	// 					onClick={() => this.handleNodeClick(node)}
// 	// 					ref={ref => this.handleMarkerRef(ref)}
// 	// 				/>
// 	// 			);
// 	// 		});
// 	// 	}
// 	//
// 	// 	renderLinks() {
// 	// 		const { links, filters } = this.props;
// 	//
// 	// 		// TODO: Refactor
// 	// 		const selectedIds = this.selectedNodeIds().reduce(
// 	// 			(idMap, nodeId) => ({ ...idMap, [nodeId]: true }),
// 	// 			{}
// 	// 		);
// 	//
// 	// 		return links.map((link, index) => {
// 	// 			const { fromNode, toNode, status } = link;
// 	// 			if (!fromNode || !toNode) return null;
// 	//
// 	// 			const isSelected =
// 	// 				selectedIds[fromNode.id] && selectedIds[toNode.id];
// 	// 			const isFiltered =
// 	// 				filters[fromNode.type] === false ||
// 	// 				filters[toNode.type] === false ||
// 	// 				(status === "potential" && filters.potential === false);
// 	// 			const visible = isSelected || !isFiltered;
// 	// 			return (
// 	// 				<LinkLine
// 	// 					key={this.linkId(link)}
// 	// 					ref={ref => {
// 	// 						this.handleLineRef(ref);
// 	// 					}}
// 	// 					visible={visible}
// 	// 					link={link}
// 	// 					filters={filters}
// 	// 				/>
// 	// 			);
// 	// 		});
// 	// 	}
// 	//
// 	// 	renderKiosks() {
// 	// 		const { kiosks } = this.props;
// 	// 		return kiosks.map(kiosk => (
// 	// 			<KioskMarker key={kiosk.id} kiosk={kiosk} />
// 	// 		));
// 	// 	}
// 	//
// 	// 	renderNodeDetail() {
// 	// 		const { match } = this.props;
// 	// 		if (!match || !match.params) {
// 	// 			return null;
// 	// 		}
// 	// 		const nodeIds = this.selectedNodeIds();
// 	//
// 	// 		const nodeTitles = nodeIds.join(", ");
// 	// 		const title = `${nodeTitles} - Map - NYC Mesh`;
// 	// 		return (
// 	// 			<DocumentTitle title={title}>
// 	// 				<Fragment>
// 	// 					{nodeIds.map(id => (
// 	// 						<NodeDetail key={id} nodeId={id} />
// 	// 					))}
// 	// 				</Fragment>
// 	// 			</DocumentTitle>
// 	// 		);
// 	// 	}
// }
