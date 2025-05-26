import { createShapeId, StateNode, TLArrowShape, TLShapeId } from "tldraw";

export class ConnectionTool extends StateNode {
    static override id = 'connection-tool'
    static override initial = 'idle'

    startShapeId: TLShapeId | null = null
    arrowId: TLShapeId | null = null

    override onEnter() {
        this.editor.setCursor({ type: 'cross', rotation: 0 })
        this.startShapeId = null
        // this.arrowId = null
    }

    override onExit() {
        // si no se completo la conexion, quitarlo
        if (this.arrowId && !this.startShapeId) {
            this.editor.deleteShape(this.arrowId);
        }
        // this.arrowId = null
        this.startShapeId = null
    }

    override onPointerMove() {
        if (!this.startShapeId || !this.arrowId) return

        // follow users mouse
        const { currentPagePoint } = this.editor.inputs
        const arrow = this.editor.getShape<TLArrowShape>(this.arrowId)

        if (arrow) {
            this.editor.updateShape<TLArrowShape>({
                id: this.arrowId,
                type: 'arrow',
                props: {
                    ...arrow.props,
                    end: {
                        x: currentPagePoint.x - arrow.x,
                        y: currentPagePoint.y - arrow.y,
                    }
                }
            })
        }
    }

    override onPointerDown() {
        const { currentPagePoint } = this.editor.inputs
        const hitShape = this.editor.getShapesAtPoint(currentPagePoint)[0]

        // connect only node shapes
        if (hitShape && hitShape.type === 'node') {
            if (!this.startShapeId) {
                // 1st click, select start node
                this.startShapeId = hitShape.id
                this.arrowId = createShapeId()

                // get center point of starting shape
                const bounds = this.editor.getShapePageBounds(hitShape.id)!
                const startX = bounds.x + bounds.width / 2
                const startY = bounds.y + bounds.height / 2

                // create temp arrow
                this.editor.createShape<TLArrowShape>({
                    id: this.arrowId,
                    type: 'arrow',
                    x: startX,
                    y: startY,
                    props: {
                        start: { x: 0, y: 0 },
                        end: { x: currentPagePoint.x - startX, y: currentPagePoint.y - startY },
                        dash: 'solid',
                        color: 'yellow',
                        arrowheadStart: 'none',
                        arrowheadEnd: 'none', 
                    }
                })

                // create binding for start
                this.editor.createBinding({
                    fromId: this.arrowId,
                    toId: this.startShapeId!, // TODO check later the '!'
                    type: 'arrow',
                    props: {
                        terminal: 'start',
                        normalizedAnchor: { x: 0.5, y: 0.5 }
                    }
                })
            } else {
                // second click, complete connection
                const endShapeId = hitShape.id

                // create binding for end
                this.editor.createBinding({
                    fromId: this.arrowId!, // TODO check later the '!'
                    toId: endShapeId,
                    type: 'arrow',
                    props: {
                        terminal: 'end',
                        normalizedAnchor: { x: 0.5, y: 0.5 }
                    }
                })

                this.editor.setCurrentTool('select')
                this.editor.select(this.arrowId!)

                // reset state and switch back to select tool
                this.startShapeId = null
                // this.arrowId = null
            }
        } else if (this.startShapeId && this.arrowId) {
            // user clicked empty space after selecting first node
            // in this case, cancel operation
            this.editor.deleteShape(this.arrowId)
            this.startShapeId = null
            // this.arrowId = null
        }
    }

    override onCancel() {
        if (this.arrowId) {
            this.editor.deleteShape(this.arrowId)
        }
        this.startShapeId = null
        this.arrowId = null
        this.editor.setCurrentTool('select')
    }
}