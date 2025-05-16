import { TLComponents, TLUiAssetUrlOverrides, TLUiOverrides } from "tldraw";
import { NodeTool } from "./node/NodeTool";
import { ConnectionTool } from "./connection/ConnectionTool";
import { CustomToolbar } from "./CustomToolbar";
import { CustomStylePanel } from "./CustomStylePanel";
import { DeleteTool } from "./delete/DeleteTool";
// Defines list of custom tools available
export const customTools = [NodeTool, ConnectionTool, DeleteTool]

// Defines custom UI overrides for the tools
export const customUiOverrides: TLUiOverrides = {
	tools: (editor) => {
		return {
			node: {
				id: 'node-selection',
				label: 'Node Selection',
				icon: 'node-selection',
				kbd: 'n',
				onSelect() {
					editor.setCurrentTool('node-selection')
				},
			},
			connection: {
				id: 'connection-tool',
				label: 'Connection',
				icon: 'connection-tool',
				kbd: 'c',
				onSelect() {
					editor.setCurrentTool('connection-tool')
				},
			},
			delete: {
				id: 'delete-tool',
				label: 'Delete',
				icon: 'delete-tool',
				kbd: 'd', // Tecla opcional
				onSelect() {
					editor.setCurrentTool('delete-tool')
				},
			},
		}
	},
}

// Defines custom asset paths for the tools
export const customAssetsUrls: TLUiAssetUrlOverrides = {
	icons: {
		'node-selection': '/icons/tools/node.svg',
		'connection-tool': '/icons/tools/connection.svg',
		'delete-tool': '/icons/tools/delete.svg'
	},
}

export const customComponents: TLComponents = {
	Toolbar: CustomToolbar,
	StylePanel: CustomStylePanel,
}