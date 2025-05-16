import { TLComponents, TLUiAssetUrlOverrides, TLUiOverrides } from "tldraw";
import { NodeTool } from "./node/NodeTool";
import { CustomToolbar } from "./CustomToolbar";
import { CustomStylePanel } from "./CustomStylePanel";
// Defines list of custom tools available
export const customTools = [NodeTool]

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
		}
	},
}

// Defines custom asset paths for the tools
export const customAssetsUrls: TLUiAssetUrlOverrides = {
	icons: {
		'node-selection': '/icons/tools/node.svg',
	},
}

export const customComponents: TLComponents = {
	Toolbar: CustomToolbar,
	StylePanel: CustomStylePanel,
}