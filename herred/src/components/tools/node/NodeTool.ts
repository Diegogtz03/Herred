import { AssetRecordType, createShapeId, StateNode } from "tldraw";

const OFFSET = 25

export class NodeTool extends StateNode {
  static override id = 'node-selection'
  static override initial = 'idle'

  override onEnter() {
    this.editor.setCursor({ type: 'cross', rotation: 0 })
  }

  override onPointerDown() {
		const { currentPagePoint } = this.editor.inputs

    const shapeId = createShapeId()
    const assetId = AssetRecordType.createId()
    const imageWidth = 50
    const imageHeight = 50

		this.editor.createShape({
			type: 'node',
			id: shapeId,
			x: currentPagePoint.x - OFFSET,
			y: currentPagePoint.y - OFFSET,
			props: {
        w: imageWidth,
        h: imageHeight,
      },
    });

    this.editor.setCurrentTool('select')
    this.editor.select(shapeId)

    this.editor.on('event', (event) => {
      if (event.name === 'pointer_down') {
        const selectedShapes = this.editor.getSelectedShapeIds()


      }
    })
	}
}
