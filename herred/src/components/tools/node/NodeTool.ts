import { AssetRecordType, StateNode } from "tldraw";

const OFFSET = 25

export class NodeTool extends StateNode {
  static override id = 'node-selection'
  static override initial = 'idle'

  override onEnter() {
    this.editor.setCursor({ type: 'cross', rotation: 0 })
  }

  override onPointerDown() {
		const { currentPagePoint } = this.editor.inputs

    const assetId = AssetRecordType.createId()
    const imageWidth = 50
    const imageHeight = 50

    this.editor.createAssets([
			{
				id: assetId,
				type: 'image',
				typeName: 'asset',
				props: {
					name: 'node.svg',
					src: '/icons/tools/node.svg',
					w: imageWidth,
					h: imageHeight,
					mimeType: 'image/svg+xml',
					isAnimated: false,
				},
				meta: {},
			},
		])

		this.editor.createShape({
			type: 'image',
			x: currentPagePoint.x - OFFSET,
			y: currentPagePoint.y - OFFSET,
			props: {
				assetId,
				w: imageWidth,
				h: imageHeight,
			},
		})

    console.log('Added node')
	}
}
